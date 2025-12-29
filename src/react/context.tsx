/**
 * Secure Role Guard - React Context
 *
 * Framework-agnostic React context for permission management.
 * Works with Next.js, Remix, Gatsby, CRA, Vite, and any React framework.
 */

import { createContext } from "react";
import type { UserContext, RoleRegistry } from "../core/types";

/**
 * Shape of the permission context value.
 */
export type PermissionContextValue = {
  /** Current user context */
  readonly user: UserContext | null;
  /** Role registry for permission lookups */
  readonly registry: RoleRegistry;
  /** Check if user has a specific permission */
  readonly can: (permission: string) => boolean;
  /** Check if user has ALL permissions */
  readonly canAll: (permissions: readonly string[]) => boolean;
  /** Check if user has ANY permission */
  readonly canAny: (permissions: readonly string[]) => boolean;
};

/**
 * Default context value (deny all).
 * Used when no provider is present.
 */
const defaultContextValue: PermissionContextValue = {
  user: null,
  registry: {
    getPermissions: () => Object.freeze([]),
    hasRole: () => false,
    getRoleNames: () => Object.freeze([]),
  },
  can: () => false,
  canAll: () => false,
  canAny: () => false,
};

/**
 * React context for permissions.
 * Default value denies all permissions (deny by default).
 */
export const PermissionContext =
  createContext<PermissionContextValue>(defaultContextValue);

// Set display name for React DevTools
PermissionContext.displayName = "PermissionContext";
