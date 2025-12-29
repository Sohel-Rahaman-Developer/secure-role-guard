/**
 * Secure Role Guard - Express Adapter
 *
 * Thin middleware wrapper for Express.js applications.
 * Delegates all authorization logic to the core permission engine.
 *
 * IMPORTANT: This adapter does NOT handle authentication.
 * You must provide the user context from your auth middleware.
 */

import type { UserContext, RoleRegistry } from "../core/types";
import { canUser, canUserAll, canUserAny } from "../core/permission-engine";

/**
 * Express-compatible Request type (minimal interface).
 * We use a minimal interface to avoid requiring express as a dependency.
 */
export interface ExpressRequest {
  /** User context attached by your auth middleware */
  user?: UserContext;
}

/**
 * Express-compatible Response type (minimal interface).
 */
export interface ExpressResponse {
  status(code: number): ExpressResponse;
  json(body: unknown): ExpressResponse;
}

/**
 * Express-compatible NextFunction type.
 */
export type ExpressNextFunction = (error?: unknown) => void;

/**
 * Express middleware signature.
 */
export type ExpressMiddleware = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction
) => void;

/**
 * Options for the permission middleware.
 */
export type PermissionMiddlewareOptions = {
  /** HTTP status code to return on denial (default: 403) */
  readonly statusCode?: number;
  /** Custom error message (default: 'Forbidden') */
  readonly message?: string;
  /** Custom function to extract user from request */
  readonly getUser?: (req: ExpressRequest) => UserContext | null | undefined;
};

const DEFAULT_OPTIONS: Required<PermissionMiddlewareOptions> = {
  statusCode: 403,
  message: "Forbidden",
  getUser: (req) => req.user,
};

/**
 * Creates Express middleware that requires a specific permission.
 *
 * SECURITY: Denies by default if user is missing or permission not granted.
 *
 * @param permission - Required permission
 * @param registry - Role registry
 * @param options - Optional configuration
 * @returns Express middleware function
 *
 * @example
 * ```ts
 * import { defineRoles } from 'secure-role-guard/core';
 * import { requirePermission } from 'secure-role-guard/adapters/express';
 *
 * const registry = defineRoles({ admin: ['user.update'] });
 *
 * app.put('/users/:id',
 *   authMiddleware, // Your auth middleware sets req.user
 *   requirePermission('user.update', registry),
 *   updateUserHandler
 * );
 * ```
 */
export function requirePermission(
  permission: string,
  registry: RoleRegistry,
  options: PermissionMiddlewareOptions = {}
): ExpressMiddleware {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return (req, res, next) => {
    const user = opts.getUser(req);

    if (canUser(user, permission, registry)) {
      next();
    } else {
      res.status(opts.statusCode).json({ error: opts.message });
    }
  };
}

/**
 * Creates Express middleware that requires ALL specified permissions.
 *
 * @param permissions - Array of required permissions
 * @param registry - Role registry
 * @param options - Optional configuration
 * @returns Express middleware function
 *
 * @example
 * ```ts
 * app.delete('/users/:id',
 *   authMiddleware,
 *   requireAllPermissions(['user.read', 'user.delete'], registry),
 *   deleteUserHandler
 * );
 * ```
 */
export function requireAllPermissions(
  permissions: readonly string[],
  registry: RoleRegistry,
  options: PermissionMiddlewareOptions = {}
): ExpressMiddleware {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return (req, res, next) => {
    const user = opts.getUser(req);

    if (canUserAll(user, permissions, registry)) {
      next();
    } else {
      res.status(opts.statusCode).json({ error: opts.message });
    }
  };
}

/**
 * Creates Express middleware that requires ANY of the specified permissions.
 *
 * @param permissions - Array of permissions (user needs at least one)
 * @param registry - Role registry
 * @param options - Optional configuration
 * @returns Express middleware function
 *
 * @example
 * ```ts
 * app.get('/reports',
 *   authMiddleware,
 *   requireAnyPermission(['report.admin', 'report.viewer'], registry),
 *   getReportsHandler
 * );
 * ```
 */
export function requireAnyPermission(
  permissions: readonly string[],
  registry: RoleRegistry,
  options: PermissionMiddlewareOptions = {}
): ExpressMiddleware {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return (req, res, next) => {
    const user = opts.getUser(req);

    if (canUserAny(user, permissions, registry)) {
      next();
    } else {
      res.status(opts.statusCode).json({ error: opts.message });
    }
  };
}
