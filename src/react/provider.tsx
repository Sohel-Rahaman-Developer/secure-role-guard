/**
 * Secure Role Guard - React Provider
 *
 * Main provider component for permission management.
 * Framework-agnostic: works with Next.js, Remix, Gatsby, CRA, Vite.
 */

import { useMemo, type ReactNode } from "react";
import type { UserContext, RoleRegistry } from "../core/types";
import { canUser, canUserAll, canUserAny } from "../core/permission-engine";
import { PermissionContext, type PermissionContextValue } from "./context";

/**
 * Props for the PermissionProvider component.
 */
export type PermissionProviderProps = {
  /** Current user context (from your auth system) */
  readonly user: UserContext | null;
  /** Role registry created by defineRoles() */
  readonly registry: RoleRegistry;
  /** Child components */
  readonly children: ReactNode;
};

/**
 * Provides permission context to all child components.
 *
 * SECURITY: If user is null/undefined, all permission checks will deny by default.
 *
 * @example
 * ```tsx
 * import { defineRoles, PermissionProvider } from 'secure-role-guard';
 *
 * const roleRegistry = defineRoles({
 *   admin: ['user.read', 'user.update'],
 *   viewer: ['user.read']
 * });
 *
 * function App() {
 *   const user = { roles: ['admin'] }; // From your auth system
 *
 *   return (
 *     <PermissionProvider user={user} registry={roleRegistry}>
 *       <YourApp />
 *     </PermissionProvider>
 *   );
 * }
 * ```
 */
export function PermissionProvider({
  user,
  registry,
  children,
}: PermissionProviderProps): ReactNode {
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<PermissionContextValue>(
    () => ({
      user,
      registry,
      can: (permission: string) => canUser(user, permission, registry),
      canAll: (permissions: readonly string[]) =>
        canUserAll(user, permissions, registry),
      canAny: (permissions: readonly string[]) =>
        canUserAny(user, permissions, registry),
    }),
    [user, registry]
  );

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  );
}
