/**
 * Secure Role Guard - React Module
 *
 * Framework-agnostic React integration for RBAC authorization.
 * Works with Next.js, Remix, Gatsby, CRA, Vite, and any React framework.
 */

// Context
export { PermissionContext, type PermissionContextValue } from "./context";

// Provider
export { PermissionProvider, type PermissionProviderProps } from "./provider";

// Hooks
export { usePermissions, useCan, useCanAll, useCanAny, useUser } from "./hooks";

// Components
export { Can, Cannot, type CanProps, type CannotProps } from "./components";
