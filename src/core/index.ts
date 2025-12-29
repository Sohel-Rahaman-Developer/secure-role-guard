/**
 * Secure Role Guard - Core Module
 *
 * Pure TypeScript RBAC authorization engine.
 * Zero dependencies, zero side effects.
 */

// Types
export type {
  UserContext,
  RoleDefinition,
  RoleRegistry,
  PermissionEngineConfig,
  PermissionCheckResult,
  PermissionCheckOptions,
} from "./types";

// Role Registry
export { defineRoles, createEmptyRegistry } from "./role-registry";

// Permission Engine
export {
  canUser,
  canUserAll,
  canUserAny,
  checkPermission,
} from "./permission-engine";
