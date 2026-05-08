export {
	WebauthnService,
	WebauthnVerificationError,
	generateEnumerationDefenseKey,
	type WebauthnServiceConfig,
	type VerifiedRegistration,
	type VerifiedAuthentication,
} from "./webauthn-service.js";

export {
	WebauthnDomainFederatedError,
	WebauthnInvalidEmailError,
	ensureInternalAuth,
	extractDomain,
} from "./webauthn-gate.js";

export {
	registerWebauthnRoutes,
	type WebauthnRoutesDeps,
} from "./webauthn-routes.js";
