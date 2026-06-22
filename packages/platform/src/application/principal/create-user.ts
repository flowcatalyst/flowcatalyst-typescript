/**
 * Create User — command + use case in one file.
 */

import type { Command, UseCase } from "@flowcatalyst/application";
import {
	validateRequired,
	validateEmail,
	Result,
	type ExecutionContext,
	UseCaseError,
} from "@flowcatalyst/application";
import type { UnitOfWork } from "@flowcatalyst/domain";
import type { PasswordService } from "@flowcatalyst/platform-crypto";

import type {
	PrincipalRepository,
	AnchorDomainRepository,
	EmailDomainMappingRepository,
	IdentityProviderRepository,
	ClientAccessGrantRepository,
} from "../../infrastructure/persistence/index.js";
import {
	createUserPrincipal,
	createUserIdentity,
	createClientAccessGrant,
	extractEmailDomain,
	UserCreated,
	ClientAccessGranted,
	IdpType,
	PrincipalScope,
	resolveScopeForEmail,
} from "../../domain/index.js";

/**
 * Command to create a new user.
 */
export interface CreateUserCommand extends Command {
	/** User's email address (will determine anchor user status) */
	readonly email: string;

	/** Plain text password (will be hashed) - required for INTERNAL auth */
	readonly password: string | null;

	/** User's display name */
	readonly name: string;

	/** Home client ID (nullable, will be auto-detected from email domain if not provided) */
	readonly clientId: string | null;

	/**
	 * When false, the platform skips its password complexity rules
	 * (uppercase/lowercase/digit/special) and only enforces a 2-character
	 * minimum. Intended for SDK callers that apply their own policy.
	 * Defaults to true.
	 */
	readonly enforcePasswordComplexity?: boolean | null;
}

/**
 * Dependencies for CreateUserUseCase.
 */
export interface CreateUserUseCaseDeps {
	readonly principalRepository: PrincipalRepository;
	readonly anchorDomainRepository: AnchorDomainRepository;
	readonly emailDomainMappingRepository: EmailDomainMappingRepository;
	readonly identityProviderRepository: IdentityProviderRepository;
	readonly clientAccessGrantRepository: ClientAccessGrantRepository;
	readonly passwordService: PasswordService;
	readonly unitOfWork: UnitOfWork;
}

/**
 * Create the CreateUserUseCase.
 */
export function createCreateUserUseCase(
	deps: CreateUserUseCaseDeps,
): UseCase<CreateUserCommand, UserCreated | ClientAccessGranted> {
	const {
		principalRepository,
		anchorDomainRepository,
		emailDomainMappingRepository,
		identityProviderRepository,
		clientAccessGrantRepository,
		passwordService,
		unitOfWork,
	} = deps;

	return {
		async execute(
			command: CreateUserCommand,
			context: ExecutionContext,
		): Promise<Result<UserCreated | ClientAccessGranted>> {
			// Validate email
			const emailResult = validateRequired(
				command.email,
				"email",
				"EMAIL_REQUIRED",
			);
			if (Result.isFailure(emailResult)) {
				return emailResult;
			}

			const emailFormatResult = validateEmail(command.email);
			if (Result.isFailure(emailFormatResult)) {
				return emailFormatResult;
			}

			// Validate name
			const nameResult = validateRequired(
				command.name,
				"name",
				"NAME_REQUIRED",
			);
			if (Result.isFailure(nameResult)) {
				return nameResult;
			}

			// Extract domain and resolve scope
			const emailDomain = extractEmailDomain(command.email);
			const mapping =
				await emailDomainMappingRepository.findByEmailDomain(emailDomain);
			const isAnchorDomain =
				!mapping && (await anchorDomainRepository.existsByDomain(emailDomain));

			const resolved = resolveScopeForEmail({
				mapping,
				isAnchorDomain,
			});
			const scope = resolved.scope;
			const isAnchorUser = scope === PrincipalScope.ANCHOR;

			// Anchor scope ignores any requested clientId.
			const effectiveClientId =
				scope === PrincipalScope.ANCHOR ? null : command.clientId;

			// PARTNER scope: validate clientId against mapping, merge onto existing
			// user instead of rejecting on duplicate email.
			if (scope === PrincipalScope.PARTNER && mapping) {
				if (!effectiveClientId) {
					return Result.failure(
						UseCaseError.validation(
							"CLIENT_ID_REQUIRED",
							"clientId is required for partner users",
						),
					);
				}

				const allowedClientIds = new Set<string>([
					...mapping.grantedClientIds,
					...(mapping.primaryClientId ? [mapping.primaryClientId] : []),
				]);
				if (!allowedClientIds.has(effectiveClientId)) {
					return Result.failure(
						UseCaseError.validation(
							"CLIENT_ID_NOT_ALLOWED",
							`clientId ${effectiveClientId} is not allowed for partner domain ${emailDomain}`,
						),
					);
				}

				const existing =
					await principalRepository.findByEmail(command.email);
				if (existing) {
					const alreadyLinked =
						existing.clientId === effectiveClientId ||
						(await clientAccessGrantRepository.existsByPrincipalAndClient(
							existing.id,
							effectiveClientId,
						));
					if (alreadyLinked) {
						return Result.failure(
							UseCaseError.businessRule(
								"EMAIL_EXISTS",
								"Email already exists and is linked to this client",
								{
									email: command.email,
									clientId: effectiveClientId,
								},
							),
						);
					}

					const grant = createClientAccessGrant({
						principalId: existing.id,
						clientId: effectiveClientId,
						grantedBy: context.principalId,
					});
					const grantEvent = new ClientAccessGranted(context, {
						userId: existing.id,
						email: existing.userIdentity?.email ?? command.email,
						clientId: effectiveClientId,
					});
					return unitOfWork.commit(grant, grantEvent, command);
				}
			}

			// Non-merge path: dup email → 409-style business rule.
			const emailExists =
				await principalRepository.existsByEmail(command.email);
			if (emailExists) {
				return Result.failure(
					UseCaseError.businessRule("EMAIL_EXISTS", "Email already exists", {
						email: command.email,
					}),
				);
			}

			// Determine IdpType for new users.
			let idpType: IdpType = IdpType.INTERNAL;
			if (mapping) {
				const idp = await identityProviderRepository.findById(
					mapping.identityProviderId,
				);
				if (idp && idp.type === "OIDC") {
					idpType = IdpType.OIDC;
				}
			}

			// Validate and hash password for INTERNAL auth, or reject for OIDC
			let passwordHash: string | null = null;
			if (idpType === IdpType.OIDC) {
				if (command.password) {
					return Result.failure(
						UseCaseError.validation(
							"PASSWORD_NOT_ALLOWED",
							"Password is not allowed for OIDC-authenticated users. Authentication is handled by the external identity provider.",
						),
					);
				}
			} else {
				if (!command.password) {
					return Result.failure(
						UseCaseError.validation(
							"PASSWORD_REQUIRED",
							"Password is required for internal authentication",
						),
					);
				}

				const enforceComplexity =
					command.enforcePasswordComplexity ?? true;

				const passwordValidation = passwordService.validateComplexity(
					command.password,
					{ enforceComplexity },
				);
				if (passwordValidation.isErr()) {
					const err = passwordValidation.error;
					return Result.failure(
						UseCaseError.validation("INVALID_PASSWORD", err.message),
					);
				}

				const hashResult = await passwordService.hash(command.password);
				if (hashResult.isErr()) {
					return Result.failure(
						UseCaseError.businessRule("HASH_FAILED", hashResult.error.message),
					);
				}
				passwordHash = hashResult.value;
			}

			// Create user identity
			const userIdentity = createUserIdentity({
				email: command.email,
				idpType,
				passwordHash,
			});

			// Create principal
			const principal = createUserPrincipal({
				name: command.name,
				scope,
				clientId: effectiveClientId,
				userIdentity,
			});

			// Create domain event
			const event = new UserCreated(context, {
				userId: principal.id,
				email: userIdentity.email,
				emailDomain: userIdentity.emailDomain,
				name: principal.name,
				scope,
				clientId: principal.clientId,
				idpType,
				isAnchorUser,
			});

			// Commit atomically
			return unitOfWork.commit(principal, event, command);
		},
	};
}
