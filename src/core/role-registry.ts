/**
 * Secure Role Guard - Role Registry
 *
 * Creates an immutable registry of role definitions.
 * Pure functions only, zero side effects.
 */

import type { RoleDefinition, RoleRegistry } from "./types";

/**
 * Creates an immutable role registry from role definitions.
 *
 * Security guarantees:
 * - Returns a frozen, immutable object
 * - No mutations possible after creation
 * - Unknown roles return empty permissions (deny by default)
 *
 * @param definitions - Object mapping role names to permission arrays
 * @returns Frozen RoleRegistry object
 *
 * @example
 * const registry = defineRoles({
 *   superadmin: ['*'],
 *   admin: ['user.read', 'user.update'],
 *   support: ['ticket.read', 'ticket.reply']
 * });
 *
 * registry.getPermissions('admin'); // ['user.read', 'user.update']
 * registry.getPermissions('unknown'); // []
 */
export function defineRoles(definitions: RoleDefinition): RoleRegistry {
  // Create a deep-frozen copy to prevent external mutations
  const frozenDefinitions: Record<string, readonly string[]> = {};

  for (const role of Object.keys(definitions)) {
    const permissions = definitions[role];
    if (permissions !== undefined) {
      // Freeze the permissions array
      frozenDefinitions[role] = Object.freeze([...permissions]);
    }
  }

  // Freeze the definitions object itself
  Object.freeze(frozenDefinitions);

  const registry: RoleRegistry = {
    getPermissions(role: string): readonly string[] {
      const permissions = frozenDefinitions[role];
      // Deny by default: unknown roles get empty permissions
      return permissions !== undefined ? permissions : Object.freeze([]);
    },

    hasRole(role: string): boolean {
      return Object.prototype.hasOwnProperty.call(frozenDefinitions, role);
    },

    getRoleNames(): readonly string[] {
      return Object.freeze(Object.keys(frozenDefinitions));
    },
  };

  // Freeze the registry object to prevent modifications
  return Object.freeze(registry);
}

/**
 * Creates an empty role registry.
 * Useful for testing or when no roles are defined.
 *
 * @returns Empty frozen RoleRegistry
 */
export function createEmptyRegistry(): RoleRegistry {
  return defineRoles({});
}
