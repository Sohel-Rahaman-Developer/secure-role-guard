# Secure Role Guard - Roadmap & Future Updates

> This document tracks planned features, improvements, and ideas for future versions.

**Current Version:** 1.0.1  
**Last Updated:** 2025-12-29

---

## 📋 Version History

| Version | Date       | Changes                                                                     |
| ------- | ---------- | --------------------------------------------------------------------------- |
| 1.0.0   | 2025-12-29 | Initial release with core RBAC, React integration, Express/Next.js adapters |
| 1.0.1   | 2025-12-29 | Added comprehensive Fixed vs Dynamic Roles documentation                    |

---

## 🚀 Planned Features

### v1.1.0 - Enhanced Adapters (Next Release)

- [ ] **Fastify Adapter** - Native middleware for Fastify framework
- [ ] **Hono Adapter** - Support for Hono (edge-first framework)
- [ ] **NestJS Decorator** - `@RequirePermission('user.read')` decorator for NestJS
- [ ] **Koa Middleware** - Adapter for Koa.js

### v1.2.0 - Advanced Features

- [ ] **Role Hierarchy** - Define role inheritance (e.g., `admin` inherits all `manager` permissions)
- [ ] **Conditional Permissions** - Permissions based on resource ownership
  ```typescript
  canUser(user, "post.edit", registry, { resourceOwnerId: post.authorId });
  ```
- [ ] **Permission Groups** - Group related permissions together
  ```typescript
  const groups = {
    "user-management": [
      "user.read",
      "user.create",
      "user.update",
      "user.delete",
    ],
  };
  ```

### v1.3.0 - Developer Experience

- [ ] **CLI Tool** - Generate role definitions from database schema
  ```bash
  npx secure-role-guard generate --db mongodb://...
  ```
- [ ] **VSCode Extension** - Autocomplete for permission strings
- [ ] **Debug Mode** - Verbose logging for permission checks in development
- [ ] **Permission Linting** - Detect unused or misspelled permissions

### v2.0.0 - Major Features (Breaking Changes)

- [ ] **Attribute-Based Access Control (ABAC)** - Beyond roles, use attributes
  ```typescript
  canAccess(user, resource, {
    condition: (u, r) => u.department === r.department,
  });
  ```
- [ ] **Policy-as-Code** - Define policies in separate files
- [ ] **Audit Trail Hook** - Callback for logging all permission checks
- [ ] **Real-time Permission Updates** - WebSocket support for instant permission changes

---

## 💡 Ideas (Under Consideration)

These are ideas that may or may not be implemented based on community feedback:

1. **GraphQL Directive** - `@requirePermission(permission: "user.read")`
2. **tRPC Middleware** - Permission middleware for tRPC procedures
3. **Remix Loader Guard** - Permission check for Remix loaders
4. **SvelteKit Integration** - Hooks and components for SvelteKit
5. **Vue.js Support** - Composables and components for Vue 3
6. **Permission Testing Utils** - Helpers for testing permission logic
7. **Permission Visualization** - Generate role-permission matrix diagram

---

## 🐛 Known Issues / Improvements

- [ ] Add more comprehensive error messages
- [ ] Improve TypeScript inference for permission strings
- [ ] Add performance benchmarks
- [ ] Create example repositories for each framework

---

## 📝 How to Contribute Ideas

1. Open a GitHub Issue with the `enhancement` label
2. Describe the feature and use case
3. Community votes via 👍 reactions
4. Features with most votes get prioritized

---

## 🔄 Release Process

When making a new release:

```bash
# 1. Update version
npm version patch  # for bug fixes / docs
npm version minor  # for new features (backward compatible)
npm version major  # for breaking changes

# 2. Push to Git with tags
git push origin main --tags

# 3. Publish to NPM
npm publish

# 4. Update this ROADMAP.md with the new version
```

---

## 📊 Priority Matrix

| Priority  | Feature          | Effort    | Impact    |
| --------- | ---------------- | --------- | --------- |
| 🔴 High   | Role Hierarchy   | Medium    | High      |
| 🔴 High   | NestJS Decorator | Low       | High      |
| 🟡 Medium | Fastify Adapter  | Low       | Medium    |
| 🟡 Medium | Debug Mode       | Low       | Medium    |
| 🟢 Low    | CLI Tool         | High      | Medium    |
| 🟢 Low    | ABAC (v2.0)      | Very High | Very High |

---

## 📞 Contact

For feature requests or questions:

- **GitHub Issues**: [secure-role-guard/issues](https://github.com/Sohel-Rahaman-Developer/secure-role-guard/issues)
- **Author**: Sohel Rahaman
