# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2024-12-29

### Added

- **Core Permission Engine**

  - `defineRoles()` - Create immutable role registries
  - `canUser()` - Check single permission
  - `canUserAll()` - Check all permissions (AND logic)
  - `canUserAny()` - Check any permission (OR logic)
  - `checkPermission()` - Detailed permission check with reason

- **Wildcard Support**

  - Global wildcard (`*`) grants all permissions
  - Namespace wildcards (`user.*`) grant all under namespace

- **React Integration**

  - `PermissionProvider` - Context provider for React apps
  - `useCan()` - Hook for single permission check
  - `useCanAll()` - Hook for AND permission check
  - `useCanAny()` - Hook for OR permission check
  - `usePermissions()` - Hook for full context access
  - `useUser()` - Hook for current user context
  - `<Can>` - Declarative component for conditional rendering
  - `<Cannot>` - Inverse of Can component

- **Express Adapter**

  - `requirePermission()` - Middleware for single permission
  - `requireAllPermissions()` - Middleware for AND logic
  - `requireAnyPermission()` - Middleware for OR logic

- **Next.js Adapter**

  - `withPermission()` - HOF wrapper for route handlers
  - `withAllPermissions()` - HOF for AND logic
  - `withAnyPermission()` - HOF for OR logic
  - `checkNextPermission()` - Pure check function

- **TypeScript Support**

  - Full strict mode compilation
  - Exported types: `UserContext`, `RoleDefinition`, `RoleRegistry`
  - Declaration files for all exports

- **Documentation**
  - Comprehensive README with examples
  - Security guarantees documentation
  - API reference
  - Framework compatibility table

### Security

- Deny-by-default permission model
- Immutable role configurations (`Object.freeze()`)
- Zero runtime dependencies in core
- No eval, no dynamic imports, no network calls
- TypeScript strict mode enabled
- ESLint security plugin configured

---

**Author:** Sohel Rahaman
