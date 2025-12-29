/**
 * Secure Role Guard
 *
 * Zero-vulnerability, framework-agnostic RBAC authorization library.
 * Works with React, Next.js, Remix, Gatsby, and any React framework.
 *
 * @author Sohel Rahaman
 * @license MIT
 * @see https://github.com/sohelrahaman/secure-role-guard
 */

// Core exports (always available, zero dependencies)
export {
  // Types
  type UserContext,
  type RoleDefinition,
  type RoleRegistry,
  type PermissionEngineConfig,
  type PermissionCheckResult,
  type PermissionCheckOptions,
  // Role Registry
  defineRoles,
  createEmptyRegistry,
  // Permission Engine
  canUser,
  canUserAll,
  canUserAny,
  checkPermission,
} from "./core";

// React exports (requires React as peer dependency)
export {
  // Context
  PermissionContext,
  type PermissionContextValue,
  // Provider
  PermissionProvider,
  type PermissionProviderProps,
  // Hooks
  usePermissions,
  useCan,
  useCanAll,
  useCanAny,
  useUser,
  // Components
  Can,
  Cannot,
  type CanProps,
  type CannotProps,
} from "./react";
