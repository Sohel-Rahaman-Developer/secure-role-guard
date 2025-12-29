/**
 * Secure Role Guard - Core Types
 *
 * Pure TypeScript type definitions for RBAC authorization.
 * Zero dependencies, zero side effects.
 */

/**
 * Represents the current user's authorization context.
 * This is the input shape provided by the consuming application.
 *
 * @example
 * const user: UserContext = {
 *   userId: 'user-123',
 *   roles: ['admin', 'manager'],
 *   permissions: ['custom.permission'],
 *   meta: { tenantId: 'tenant-abc' }
 * };
 */
export type UserContext = {
  /** Optional unique identifier for the user */
  readonly userId?: string;
  /** Array of role names assigned to this user */
  readonly roles?: readonly string[];
  /** Array of direct permissions granted to this user (bypasses role lookup) */
  readonly permissions?: readonly string[];
  /** Optional metadata for tenant/org context or custom data */
  readonly meta?: Readonly<Record<string, unknown>>;
};

/**
 * Defines a mapping of role names to their granted permissions.
 *
 * @example
 * const roles: RoleDefinition = {
 *   superadmin: ['*'],
 *   admin: ['user.read', 'user.update', 'user.delete'],
 *   viewer: ['user.read', 'report.view']
 * };
 */
export type RoleDefinition = Readonly<Record<string, readonly string[]>>;

/**
 * Immutable registry of role definitions.
 * Created by the defineRoles() function.
 */
export type RoleRegistry = {
  /** Get permissions for a specific role. Returns empty array if role not found. */
  readonly getPermissions: (role: string) => readonly string[];
  /** Check if a role exists in the registry */
  readonly hasRole: (role: string) => boolean;
  /** Get all registered role names */
  readonly getRoleNames: () => readonly string[];
};

/**
 * Configuration options for the permission engine.
 */
export type PermissionEngineConfig = {
  /** The role registry to use for permission lookups */
  readonly roleRegistry: RoleRegistry;
};

/**
 * Result of a permission check.
 * Simple boolean for now, but structured for future extensibility.
 */
export type PermissionCheckResult = {
  readonly allowed: boolean;
  /** Optional reason for debugging (only in development) */
  readonly reason?: string;
};

/**
 * Options for permission checking.
 */
export type PermissionCheckOptions = {
  /** If true, any of the permissions being checked will grant access */
  readonly anyOf?: boolean;
};
