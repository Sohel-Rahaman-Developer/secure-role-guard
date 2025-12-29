/**
 * Secure Role Guard - Adapters Module
 *
 * Optional backend adapters for Express and Next.js.
 * These are thin wrappers that delegate to the core permission engine.
 */

// Express Adapter
export {
  requirePermission,
  requireAllPermissions,
  requireAnyPermission,
  type ExpressRequest,
  type ExpressResponse,
  type ExpressNextFunction,
  type ExpressMiddleware,
  type PermissionMiddlewareOptions,
} from "./express";

// Next.js Adapter
export {
  checkNextPermission,
  checkNextPermissionAll,
  checkNextPermissionAny,
  withPermission,
  withAllPermissions,
  withAnyPermission,
  type NextRequest,
  type NextResponse,
  type PermissionResult,
  type NextPermissionOptions,
} from "./nextjs";
