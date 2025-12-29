/**
 * Secure Role Guard - Permission Engine
 *
 * Pure functions for permission checking.
 * Zero side effects, zero dependencies, zero mutations.
 */

import type { UserContext, RoleRegistry, PermissionCheckResult } from "./types";

/** Wildcard permission that grants all access */
const WILDCARD_PERMISSION = "*";

/**
 * Collects all permissions for a user from their roles and direct permissions.
 *
 * @param user - The user context
 * @param registry - The role registry to resolve role permissions
 * @returns Set of all permissions (for efficient lookup)
 */
function collectUserPermissions(
  user: UserContext,
  registry: RoleRegistry
): ReadonlySet<string> {
  const permissions = new Set<string>();

  // Add direct user permissions
  if (user.permissions !== undefined) {
    for (const permission of user.permissions) {
      permissions.add(permission);
    }
  }

  // Add permissions from all user roles
  if (user.roles !== undefined) {
    for (const role of user.roles) {
      const rolePermissions = registry.getPermissions(role);
      for (const permission of rolePermissions) {
        permissions.add(permission);
      }
    }
  }

  return permissions;
}

/**
 * Checks if a permission set contains a wildcard that grants the requested permission.
 *
 * Supports:
 * - Exact wildcard (*) - grants everything
 * - Namespace wildcards (user.*) - grants all under namespace
 *
 * @param permissions - Set of permissions to check
 * @param requested - The permission being requested
 * @returns True if wildcard grants access
 */
function hasWildcardAccess(
  permissions: ReadonlySet<string>,
  requested: string
): boolean {
  // Check for global wildcard
  if (permissions.has(WILDCARD_PERMISSION)) {
    return true;
  }

  // Check for namespace wildcards (e.g., user.* grants user.read)
  const parts = requested.split(".");
  let namespace = "";

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (part !== undefined) {
      namespace = namespace === "" ? part : `${namespace}.${part}`;
      if (permissions.has(`${namespace}.*`)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks if a user has a specific permission.
 *
 * SECURITY GUARANTEES:
 * - Deny by default: undefined/null/empty always returns false
 * - Pure function: no side effects, no mutations
 * - Deterministic: same inputs always produce same output
 *
 * @param user - The user context to check
 * @param permission - The permission required
 * @param registry - The role registry for resolving roles
 * @returns True if user has the permission, false otherwise
 *
 * @example
 * const canEdit = canUser(currentUser, 'user.update', roleRegistry);
 */
export function canUser(
  user: UserContext | null | undefined,
  permission: string,
  registry: RoleRegistry
): boolean {
  // DENY BY DEFAULT: No user context means no access
  if (user === null || user === undefined) {
    return false;
  }

  // DENY BY DEFAULT: Empty permission request is invalid
  if (permission === "" || permission.trim() === "") {
    return false;
  }

  const userPermissions = collectUserPermissions(user, registry);

  // Check for exact permission match
  if (userPermissions.has(permission)) {
    return true;
  }

  // Check for wildcard access
  if (hasWildcardAccess(userPermissions, permission)) {
    return true;
  }

  // DENY BY DEFAULT
  return false;
}

/**
 * Checks if a user has ALL of the specified permissions.
 *
 * @param user - The user context to check
 * @param permissions - Array of permissions required
 * @param registry - The role registry
 * @returns True if user has ALL permissions
 *
 * @example
 * const canManage = canUserAll(user, ['user.read', 'user.update'], registry);
 */
export function canUserAll(
  user: UserContext | null | undefined,
  permissions: readonly string[],
  registry: RoleRegistry
): boolean {
  // DENY BY DEFAULT: Empty permissions array
  if (permissions.length === 0) {
    return false;
  }

  for (const permission of permissions) {
    if (!canUser(user, permission, registry)) {
      return false;
    }
  }

  return true;
}

/**
 * Checks if a user has ANY of the specified permissions.
 *
 * @param user - The user context to check
 * @param permissions - Array of permissions to check
 * @param registry - The role registry
 * @returns True if user has at least one permission
 *
 * @example
 * const canView = canUserAny(user, ['report.view', 'report.admin'], registry);
 */
export function canUserAny(
  user: UserContext | null | undefined,
  permissions: readonly string[],
  registry: RoleRegistry
): boolean {
  // DENY BY DEFAULT: Empty permissions array
  if (permissions.length === 0) {
    return false;
  }

  for (const permission of permissions) {
    if (canUser(user, permission, registry)) {
      return true;
    }
  }

  return false;
}

/**
 * Extended permission check with detailed result.
 * Useful for debugging and logging.
 *
 * @param user - The user context
 * @param permission - Permission to check
 * @param registry - The role registry
 * @returns PermissionCheckResult with allowed status and reason
 */
export function checkPermission(
  user: UserContext | null | undefined,
  permission: string,
  registry: RoleRegistry
): PermissionCheckResult {
  if (user === null || user === undefined) {
    return Object.freeze({
      allowed: false,
      reason: "No user context provided",
    });
  }

  if (permission === "" || permission.trim() === "") {
    return Object.freeze({
      allowed: false,
      reason: "Empty permission requested",
    });
  }

  const allowed = canUser(user, permission, registry);

  return Object.freeze({
    allowed,
    reason: allowed
      ? `Permission "${permission}" granted`
      : `Permission "${permission}" denied`,
  });
}
