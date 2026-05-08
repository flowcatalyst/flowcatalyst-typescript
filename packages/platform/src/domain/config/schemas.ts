/**
 * Platform Config Access – Event Data Schemas
 */

import { Type } from "@sinclair/typebox";

export const PlatformConfigAccessGrantedDataSchema = Type.Object({
	grantId: Type.String(),
	applicationCode: Type.String(),
	roleCode: Type.String(),
	canRead: Type.Boolean(),
	canWrite: Type.Boolean(),
});

export const PlatformConfigAccessUpdatedDataSchema = Type.Object({
	grantId: Type.String(),
	applicationCode: Type.String(),
	roleCode: Type.String(),
	canRead: Type.Boolean(),
	canWrite: Type.Boolean(),
});

export const PlatformConfigAccessRevokedDataSchema = Type.Object({
	applicationCode: Type.String(),
	roleCode: Type.String(),
});
