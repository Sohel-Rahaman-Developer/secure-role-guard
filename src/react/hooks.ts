/**
 * Secure Role Guard - React Hooks
 *
 * Hooks for permission checking in React components.
 * Framework-agnostic: works with any React framework.
 */

import { useContext } from "react";
import { PermissionContext, type PermissionContextValue } from "./context";

/**
 * Hook to access the full permission context.
 *
 * @returns Full PermissionContextValue
 *
 * @example
 * ```tsx
 * function UserProfile() {
 *   const { user, can, canAll } = usePermissions();
 *
 *   if (can('user.read')) {
 *     return <UserDetails />;
 *   }
 *   return <AccessDenied />;
 * }
 * ```
 */
export function usePermissions(): PermissionContextValue {
  return useContext(PermissionContext);
}

/**
 * Hook to check a single permission.
 *
 * @param permission - The permission to check
 * @returns True if user has the permission
 *
 * @example
 * ```tsx
 * function EditButton() {
 *   const canEdit = useCan('user.update');
 *
 *   if (!canEdit) return null;
 *   return <button>Edit User</button>;
 * }
 * ```
 */
export function useCan(permission: string): boolean {
  const { can } = useContext(PermissionContext);
  return can(permission);
}

/**
 * Hook to check if user has ALL specified permissions.
 *
 * @param permissions - Array of permissions to check
 * @returns True if user has all permissions
 *
 * @example
 * ```tsx
 * function AdminPanel() {
 *   const canManage = useCanAll(['user.read', 'user.update', 'user.delete']);
 *
 *   if (!canManage) return <AccessDenied />;
 *   return <AdminDashboard />;
 * }
 * ```
 */
export function useCanAll(permissions: readonly string[]): boolean {
  const { canAll } = useContext(PermissionContext);
  return canAll(permissions);
}

/**
 * Hook to check if user has ANY of the specified permissions.
 *
 * @param permissions - Array of permissions to check
 * @returns True if user has at least one permission
 *
 * @example
 * ```tsx
 * function ViewReports() {
 *   const canView = useCanAny(['report.admin', 'report.viewer']);
 *
 *   if (!canView) return null;
 *   return <ReportList />;
 * }
 * ```
 */
export function useCanAny(permissions: readonly string[]): boolean {
  const { canAny } = useContext(PermissionContext);
  return canAny(permissions);
}

/**
 * Hook to get current user context.
 *
 * @returns Current UserContext or null
 *
 * @example
 * ```tsx
 * function UserInfo() {
 *   const user = useUser();
 *   return <span>User ID: {user?.userId ?? 'Anonymous'}</span>;
 * }
 * ```
 */
export function useUser() {
  const { user } = useContext(PermissionContext);
  return user;
}
