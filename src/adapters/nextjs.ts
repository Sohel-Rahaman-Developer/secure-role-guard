/**
 * Secure Role Guard - Next.js Adapter
 *
 * Thin wrapper for Next.js API routes and Route Handlers.
 * Delegates all authorization logic to the core permission engine.
 *
 * IMPORTANT: This adapter does NOT handle authentication.
 * You must provide the user context from your auth system.
 */

import type { UserContext, RoleRegistry } from "../core/types";
import { canUser, canUserAll, canUserAny } from "../core/permission-engine";

/**
 * Next.js Request type (minimal interface for App Router).
 * Using minimal interface to avoid requiring next as a dependency.
 */
export interface NextRequest {
  /** Headers from the request */
  headers: {
    get(name: string): string | null;
  };
}

/**
 * Next.js Response helper for App Router.
 */
export interface NextResponse {
  json(body: unknown, init?: { status?: number }): Response;
}

/**
 * Result of a permission check in Next.js context.
 */
export type PermissionResult = {
  readonly allowed: boolean;
  readonly user: UserContext | null;
};

/**
 * Options for Next.js permission wrappers.
 */
export type NextPermissionOptions = {
  /** Function to extract user context from request */
  readonly getUser: (
    request: NextRequest
  ) => UserContext | null | Promise<UserContext | null>;
  /** HTTP status code on denial (default: 403) */
  readonly statusCode?: number;
  /** Error message on denial (default: 'Forbidden') */
  readonly message?: string;
};

/**
 * Checks if a user has permission in a Next.js API context.
 *
 * This is a pure check function - you handle the response.
 *
 * @param user - User context
 * @param permission - Required permission
 * @param registry - Role registry
 * @returns PermissionResult
 *
 * @example
 * ```ts
 * // app/api/users/route.ts
 * import { defineRoles } from 'secure-role-guard/core';
 * import { checkNextPermission } from 'secure-role-guard/adapters/nextjs';
 *
 * const registry = defineRoles({ admin: ['user.update'] });
 *
 * export async function PUT(request: NextRequest) {
 *   const user = await getUser(request); // Your auth function
 *   const result = checkNextPermission(user, 'user.update', registry);
 *
 *   if (!result.allowed) {
 *     return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
 *   }
 *
 *   // Handle the request...
 * }
 * ```
 */
export function checkNextPermission(
  user: UserContext | null | undefined,
  permission: string,
  registry: RoleRegistry
): PermissionResult {
  return {
    allowed: canUser(user, permission, registry),
    user: user ?? null,
  };
}

/**
 * Checks if a user has ALL specified permissions.
 *
 * @param user - User context
 * @param permissions - Required permissions
 * @param registry - Role registry
 * @returns PermissionResult
 */
export function checkNextPermissionAll(
  user: UserContext | null | undefined,
  permissions: readonly string[],
  registry: RoleRegistry
): PermissionResult {
  return {
    allowed: canUserAll(user, permissions, registry),
    user: user ?? null,
  };
}

/**
 * Checks if a user has ANY of the specified permissions.
 *
 * @param user - User context
 * @param permissions - Permissions to check
 * @param registry - Role registry
 * @returns PermissionResult
 */
export function checkNextPermissionAny(
  user: UserContext | null | undefined,
  permissions: readonly string[],
  registry: RoleRegistry
): PermissionResult {
  return {
    allowed: canUserAny(user, permissions, registry),
    user: user ?? null,
  };
}

/**
 * Higher-order function that wraps a Next.js Route Handler with permission check.
 *
 * @param permission - Required permission
 * @param registry - Role registry
 * @param options - Configuration options
 * @param handler - The route handler to wrap
 * @returns Wrapped route handler
 *
 * @example
 * ```ts
 * // app/api/admin/route.ts
 * import { defineRoles } from 'secure-role-guard/core';
 * import { withPermission } from 'secure-role-guard/adapters/nextjs';
 *
 * const registry = defineRoles({ admin: ['admin.access'] });
 *
 * async function getUser(req: NextRequest) {
 *   // Your auth logic to extract user from session/token
 *   return { roles: ['admin'] };
 * }
 *
 * export const GET = withPermission(
 *   'admin.access',
 *   registry,
 *   { getUser },
 *   async (request, user) => {
 *     return Response.json({ message: 'Welcome, admin!' });
 *   }
 * );
 * ```
 */
export function withPermission<T extends NextRequest>(
  permission: string,
  registry: RoleRegistry,
  options: NextPermissionOptions,
  handler: (request: T, user: UserContext) => Response | Promise<Response>
): (request: T) => Promise<Response> {
  const statusCode = options.statusCode ?? 403;
  const message = options.message ?? "Forbidden";

  return async (request: T): Promise<Response> => {
    const user = await options.getUser(request);

    if (user === null || !canUser(user, permission, registry)) {
      return Response.json({ error: message }, { status: statusCode });
    }

    return handler(request, user);
  };
}

/**
 * Higher-order function that wraps a handler requiring ALL permissions.
 */
export function withAllPermissions<T extends NextRequest>(
  permissions: readonly string[],
  registry: RoleRegistry,
  options: NextPermissionOptions,
  handler: (request: T, user: UserContext) => Response | Promise<Response>
): (request: T) => Promise<Response> {
  const statusCode = options.statusCode ?? 403;
  const message = options.message ?? "Forbidden";

  return async (request: T): Promise<Response> => {
    const user = await options.getUser(request);

    if (user === null || !canUserAll(user, permissions, registry)) {
      return Response.json({ error: message }, { status: statusCode });
    }

    return handler(request, user);
  };
}

/**
 * Higher-order function that wraps a handler requiring ANY permission.
 */
export function withAnyPermission<T extends NextRequest>(
  permissions: readonly string[],
  registry: RoleRegistry,
  options: NextPermissionOptions,
  handler: (request: T, user: UserContext) => Response | Promise<Response>
): (request: T) => Promise<Response> {
  const statusCode = options.statusCode ?? 403;
  const message = options.message ?? "Forbidden";

  return async (request: T): Promise<Response> => {
    const user = await options.getUser(request);

    if (user === null || !canUserAny(user, permissions, registry)) {
      return Response.json({ error: message }, { status: statusCode });
    }

    return handler(request, user);
  };
}
