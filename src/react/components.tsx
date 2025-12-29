/**
 * Secure Role Guard - React Components
 *
 * Declarative components for conditional rendering based on permissions.
 * Framework-agnostic: works with any React framework.
 */

import type { ReactNode } from "react";
import { useCan, useCanAll, useCanAny } from "./hooks";

/**
 * Props for the Can component.
 */
export type CanProps = {
  /** Single permission to check */
  readonly permission?: string;
  /** Multiple permissions - user must have ALL (default behavior) */
  readonly permissions?: readonly string[];
  /** If true, user needs only ANY of the permissions */
  readonly anyOf?: boolean;
  /** Content to render if permission granted */
  readonly children: ReactNode;
  /** Optional fallback content if permission denied */
  readonly fallback?: ReactNode;
};

/**
 * Conditionally renders children based on user permissions.
 *
 * SECURITY: If no permission matches, nothing is rendered (deny by default).
 *
 * @example Single permission
 * ```tsx
 * <Can permission="user.update">
 *   <EditButton />
 * </Can>
 * ```
 *
 * @example Multiple permissions (ALL required)
 * ```tsx
 * <Can permissions={['user.read', 'user.update']}>
 *   <UserEditor />
 * </Can>
 * ```
 *
 * @example Multiple permissions (ANY required)
 * ```tsx
 * <Can permissions={['admin', 'moderator']} anyOf>
 *   <ModPanel />
 * </Can>
 * ```
 *
 * @example With fallback
 * ```tsx
 * <Can permission="premium.access" fallback={<UpgradePrompt />}>
 *   <PremiumContent />
 * </Can>
 * ```
 */
export function Can({
  permission,
  permissions,
  anyOf = false,
  children,
  fallback = null,
}: CanProps): ReactNode {
  // Single permission check
  if (permission !== undefined) {
    const allowed = useCan(permission);
    return allowed ? children : fallback;
  }

  // Multiple permissions check
  if (permissions !== undefined && permissions.length > 0) {
    const allowed = anyOf ? useCanAny(permissions) : useCanAll(permissions);
    return allowed ? children : fallback;
  }

  // No permissions specified - deny by default
  return fallback;
}

/**
 * Props for the Cannot component.
 */
export type CannotProps = {
  /** Single permission to check */
  readonly permission?: string;
  /** Multiple permissions to check */
  readonly permissions?: readonly string[];
  /** If true, blocked when user has ANY permission */
  readonly anyOf?: boolean;
  /** Content to render if permission is NOT granted */
  readonly children: ReactNode;
};

/**
 * Inverse of Can - renders children when user does NOT have the permission.
 * Useful for showing upgrade prompts, locked features, etc.
 *
 * @example
 * ```tsx
 * <Cannot permission="premium.access">
 *   <UpgradePrompt />
 * </Cannot>
 * ```
 */
export function Cannot({
  permission,
  permissions,
  anyOf = false,
  children,
}: CannotProps): ReactNode {
  // Single permission check
  if (permission !== undefined) {
    const allowed = useCan(permission);
    return allowed ? null : children;
  }

  // Multiple permissions check
  if (permissions !== undefined && permissions.length > 0) {
    const allowed = anyOf ? useCanAny(permissions) : useCanAll(permissions);
    return allowed ? null : children;
  }

  // No permissions specified - show children (inverse of deny by default)
  return children;
}
