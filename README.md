# secure-role-guard

> Zero-vulnerability, framework-agnostic RBAC authorization library for React and Node.js applications.

[![npm version](https://img.shields.io/npm/v/secure-role-guard.svg)](https://www.npmjs.com/package/secure-role-guard)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](https://www.npmjs.com/package/secure-role-guard)

**Author:** Sohel Rahaman

---

## Table of Contents

- [What This Package Does](#what-this-package-does)
- [What This Package Does NOT Do](#what-this-package-does-not-do)
- [Security Guarantees](#security-guarantees)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Real-World Examples](#real-world-examples)
- [Framework Compatibility](#framework-compatibility)
- [Common Mistakes to Avoid](#common-mistakes-to-avoid)
- [License](#license)

---

## What This Package Does ✅

| Feature                       | Description                                             |
| ----------------------------- | ------------------------------------------------------- |
| **Role-Based Access Control** | Define roles with granular permissions                  |
| **Pure Permission Checking**  | Deterministic, side-effect-free authorization           |
| **React Integration**         | Provider, hooks, and components for any React framework |
| **Backend Adapters**          | Optional Express and Next.js middleware                 |
| **Wildcard Support**          | Grant access with `*` (all) or `namespace.*` patterns   |
| **TypeScript First**          | Full type safety with strict mode                       |
| **Zero Dependencies**         | Core has zero runtime dependencies                      |
| **Framework Agnostic**        | Works with Next.js, Remix, Gatsby, Astro, Vite, CRA     |

---

## What This Package Does NOT Do ❌

> **CRITICAL:** This package handles **AUTHORIZATION** only, **NOT AUTHENTICATION**.

| This Package Does NOT | You Must Handle This                   |
| --------------------- | -------------------------------------- |
| Parse JWT tokens      | Use a JWT library (jsonwebtoken, jose) |
| Verify authentication | Use Auth.js, Clerk, NextAuth, Passport |
| Read cookies          | Use your framework's cookie API        |
| Manage sessions       | Use express-session, iron-session      |
| Make network requests | Fetch user data yourself               |
| Access databases      | Query your DB to get user roles        |
| Store global state    | Pass user context explicitly           |

### Why?

Authorization and authentication are **separate concerns**. Mixing them creates security vulnerabilities. This package focuses on **one job** and does it correctly.

---

## Security Guarantees

| Guarantee                | Implementation                                     |
| ------------------------ | -------------------------------------------------- |
| ✅ **Deny by default**   | Undefined permissions return `false`               |
| ✅ **Immutable configs** | Role definitions are frozen with `Object.freeze()` |
| ✅ **Pure functions**    | No side effects, no state mutations                |
| ✅ **No eval/regex**     | Only strict string matching                        |
| ✅ **Zero dependencies** | Core has zero runtime dependencies                 |
| ✅ **TypeScript strict** | Full strict mode compilation                       |
| ✅ **No global state**   | All state is passed explicitly                     |
| ✅ **No network calls**  | Never makes HTTP requests                          |
| ✅ **No file system**    | Never reads or writes files                        |

---

## Installation

```bash
npm install secure-role-guard
# or
pnpm add secure-role-guard
# or
yarn add secure-role-guard
```

**Peer Dependencies:**

- React ≥16.8.0 (optional, only needed for React features)

---

## Quick Start

### 1. Define Your Roles

```typescript
// roles.ts
import { defineRoles } from "secure-role-guard";

export const roleRegistry = defineRoles({
  superadmin: ["*"], // Full access
  admin: ["user.read", "user.update", "user.delete", "report.view"],
  manager: ["user.read", "report.*"], // Namespace wildcard
  support: ["ticket.read", "ticket.reply"],
  viewer: ["user.read"],
});
```

### 2. Check Permissions (Core - No React)

```typescript
import { canUser } from "secure-role-guard";
import { roleRegistry } from "./roles";

// Your user context (from your auth system)
const user = {
  userId: "user-123",
  roles: ["admin"],
  permissions: ["custom.feature"], // Direct permissions
};

// Simple checks
canUser(user, "user.update", roleRegistry); // true
canUser(user, "user.delete", roleRegistry); // true
canUser(user, "billing.access", roleRegistry); // false (deny by default)
```

### 3. React Integration

```tsx
import { PermissionProvider, Can, useCan } from "secure-role-guard";
import { roleRegistry } from "./roles";

// Wrap your app with the provider
function App() {
  const user = useAuth(); // YOUR auth hook (not from this package)

  return (
    <PermissionProvider user={user} registry={roleRegistry}>
      <Dashboard />
    </PermissionProvider>
  );
}

// Use the Can component for declarative rendering
function Dashboard() {
  return (
    <div>
      <Can permission="user.update">
        <EditUserButton />
      </Can>

      <Can permission="admin.access" fallback={<UpgradePrompt />}>
        <AdminPanel />
      </Can>

      <Can permissions={["report.view", "report.export"]} anyOf>
        <ReportSection />
      </Can>
    </div>
  );
}

// Or use hooks for programmatic checks
function UserActions() {
  const canEdit = useCan("user.update");
  const canDelete = useCan("user.delete");

  return (
    <div>
      {canEdit && <button>Edit</button>}
      {canDelete && <button>Delete</button>}
    </div>
  );
}
```

---

## API Reference

### Core Functions

#### `defineRoles(definitions)`

Creates an immutable role registry.

```typescript
const registry = defineRoles({
  admin: ["user.read", "user.update"],
  viewer: ["user.read"],
});
```

#### `canUser(user, permission, registry)`

Checks if a user has a specific permission. Returns `boolean`.

```typescript
const allowed = canUser(user, "user.update", registry);
```

#### `canUserAll(user, permissions, registry)`

Checks if a user has ALL specified permissions.

```typescript
const allowed = canUserAll(user, ["user.read", "user.update"], registry);
```

#### `canUserAny(user, permissions, registry)`

Checks if a user has ANY of the specified permissions.

```typescript
const allowed = canUserAny(
  user,
  ["admin.access", "moderator.access"],
  registry
);
```

### React Components

#### `<PermissionProvider>`

Provides permission context to child components.

```tsx
<PermissionProvider user={user} registry={registry}>
  {children}
</PermissionProvider>
```

#### `<Can>`

Conditionally renders children based on permissions.

| Prop          | Type        | Description                           |
| ------------- | ----------- | ------------------------------------- |
| `permission`  | `string`    | Single permission to check            |
| `permissions` | `string[]`  | Multiple permissions to check         |
| `anyOf`       | `boolean`   | If true, ANY permission grants access |
| `fallback`    | `ReactNode` | Content to show if denied             |
| `children`    | `ReactNode` | Content to show if allowed            |

#### `<Cannot>`

Inverse of `<Can>` - renders when permission is NOT granted.

### React Hooks

| Hook                     | Returns                  | Description             |
| ------------------------ | ------------------------ | ----------------------- |
| `useCan(permission)`     | `boolean`                | Check single permission |
| `useCanAll(permissions)` | `boolean`                | Check ALL permissions   |
| `useCanAny(permissions)` | `boolean`                | Check ANY permission    |
| `usePermissions()`       | `PermissionContextValue` | Full context access     |
| `useUser()`              | `UserContext \| null`    | Current user            |

### User Context Shape

```typescript
type UserContext = {
  userId?: string; // Optional user identifier
  roles?: string[]; // Array of role names
  permissions?: string[]; // Direct permissions (bypass roles)
  meta?: Record<string, unknown>; // Custom metadata (tenant, org, etc.)
};
```

### Wildcard Permissions

| Pattern          | Grants Access To                                 |
| ---------------- | ------------------------------------------------ |
| `*`              | Everything                                       |
| `user.*`         | `user.read`, `user.update`, `user.delete`, etc.  |
| `report.admin.*` | `report.admin.view`, `report.admin.export`, etc. |

---

## Real-World Examples

### Example 1: Next.js App with Express Backend

**Frontend (Next.js App Router):**

```tsx
// app/providers.tsx
"use client";

import { PermissionProvider } from "secure-role-guard/react";
import { roleRegistry } from "@/lib/roles";

export function Providers({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserContext;
}) {
  return (
    <PermissionProvider user={user} registry={roleRegistry}>
      {children}
    </PermissionProvider>
  );
}

// app/layout.tsx
import { Providers } from "./providers";
import { getUser } from "@/lib/auth"; // YOUR auth function

export default async function RootLayout({ children }) {
  const user = await getUser(); // Fetch from session/JWT

  return (
    <html>
      <body>
        <Providers user={user}>{children}</Providers>
      </body>
    </html>
  );
}

// app/admin/page.tsx
import { Can } from "secure-role-guard/react";

export default function AdminPage() {
  return (
    <Can permission="admin.access" fallback={<p>Access Denied</p>}>
      <h1>Admin Dashboard</h1>
    </Can>
  );
}
```

**Backend (Express.js):**

```typescript
// server.ts
import express from "express";
import { defineRoles } from "secure-role-guard/core";
import { requirePermission } from "secure-role-guard/adapters/express";

const app = express();

// Define roles (same as frontend)
const roleRegistry = defineRoles({
  admin: ["user.read", "user.update", "user.delete"],
  viewer: ["user.read"],
});

// YOUR auth middleware (not from this package)
app.use(authMiddleware); // Sets req.user

// Protected routes
app.get(
  "/api/users",
  requirePermission("user.read", roleRegistry),
  (req, res) => {
    res.json({ users: [] });
  }
);

app.put(
  "/api/users/:id",
  requirePermission("user.update", roleRegistry),
  (req, res) => {
    res.json({ success: true });
  }
);

app.delete(
  "/api/users/:id",
  requirePermission("user.delete", roleRegistry),
  (req, res) => {
    res.json({ deleted: true });
  }
);

app.listen(3000);
```

---

### Example 2: React-Only App (Vite/CRA)

```tsx
// src/roles.ts
import { defineRoles } from "secure-role-guard";

export const roleRegistry = defineRoles({
  admin: ["*"],
  editor: ["post.read", "post.create", "post.update"],
  viewer: ["post.read"],
});

// src/App.tsx
import { PermissionProvider } from "secure-role-guard";
import { roleRegistry } from "./roles";
import { useAuth } from "./auth"; // YOUR auth hook

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <PermissionProvider user={user} registry={roleRegistry}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<PostList />} />
          <Route path="/admin" element={<AdminRoute />} />
        </Routes>
      </Router>
    </PermissionProvider>
  );
}

// src/components/AdminRoute.tsx
import { useCan } from "secure-role-guard";
import { Navigate } from "react-router-dom";

function AdminRoute() {
  const canAccess = useCan("admin.access");

  if (!canAccess) {
    return <Navigate to="/" replace />;
  }

  return <AdminPanel />;
}

// src/components/PostActions.tsx
import { Can, Cannot } from "secure-role-guard";

function PostActions({ postId }: { postId: string }) {
  return (
    <div>
      <Can permission="post.update">
        <button onClick={() => editPost(postId)}>Edit</button>
      </Can>

      <Can permission="post.delete">
        <button onClick={() => deletePost(postId)}>Delete</button>
      </Can>

      <Cannot permission="post.update">
        <span>View Only</span>
      </Cannot>
    </div>
  );
}
```

---

### Example 3: Astro with React

```typescript
// src/lib/roles.ts
import { defineRoles } from 'secure-role-guard';

export const roleRegistry = defineRoles({
  admin: ['page.edit', 'page.publish', 'settings.manage'],
  editor: ['page.edit'],
  viewer: [],
});

// src/components/AdminPanel.tsx (React component)
import { PermissionProvider, Can, useCan } from 'secure-role-guard';
import { roleRegistry } from '../lib/roles';

interface Props {
  user: { roles: string[] } | null;
}

export default function AdminPanel({ user }: Props) {
  return (
    <PermissionProvider user={user} registry={roleRegistry}>
      <div className="admin-panel">
        <Can permission="page.edit">
          <PageEditor />
        </Can>

        <Can permission="settings.manage">
          <SettingsPanel />
        </Can>

        <Can permission="page.publish" fallback={<p>Publishing not available</p>}>
          <PublishButton />
        </Can>
      </div>
    </PermissionProvider>
  );
}

// src/pages/admin.astro
---
import AdminPanel from '../components/AdminPanel';
import { getUser } from '../lib/auth';

const user = await getUser(Astro.request);
---

<AdminPanel client:load user={user} />
```

---

### Example 4: Next.js API Routes (App Router)

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { defineRoles, canUser } from "secure-role-guard/core";
import { withPermission } from "secure-role-guard/adapters/nextjs";
import { getUser } from "@/lib/auth";

const roleRegistry = defineRoles({
  admin: ["user.read", "user.update", "user.delete"],
  viewer: ["user.read"],
});

// Option 1: Manual check
export async function GET(request: NextRequest) {
  const user = await getUser(request);

  if (!canUser(user, "user.read", roleRegistry)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await fetchUsers();
  return NextResponse.json(users);
}

// Option 2: Using wrapper
export const PUT = withPermission(
  "user.update",
  roleRegistry,
  { getUser: async (req) => getUser(req) },
  async (request, user) => {
    const body = await request.json();
    const updated = await updateUser(body);
    return NextResponse.json(updated);
  }
);
```

---

### Example 5: Multi-Tenant SaaS

```typescript
import { defineRoles, canUser } from "secure-role-guard";

// Define roles for your multi-tenant application
const roleRegistry = defineRoles({
  org_owner: ["*"],
  org_admin: ["user.*", "billing.view", "settings.update"],
  org_member: ["user.read", "project.*"],
  org_viewer: ["user.read", "project.read"],
});

// User context with tenant metadata
const currentUser = {
  userId: "usr_abc123",
  roles: ["org_admin"],
  permissions: ["beta.feature"], // Direct permission for beta access
  meta: {
    tenantId: "tenant_xyz",
    orgId: "org_456",
    plan: "enterprise",
  },
};

// Authorization check
if (canUser(currentUser, "billing.view", roleRegistry)) {
  // Show billing dashboard
}

// Access tenant metadata for additional business logic
const tenantId = currentUser.meta?.tenantId;
if (tenantId) {
  // Filter data by tenant
}
```

---

## Framework Compatibility

| Framework              | Status           | Import                               |
| ---------------------- | ---------------- | ------------------------------------ |
| Next.js (App Router)   | ✅ Full support  | `secure-role-guard`                  |
| Next.js (Pages Router) | ✅ Full support  | `secure-role-guard`                  |
| Remix                  | ✅ Full support  | `secure-role-guard`                  |
| Gatsby                 | ✅ Full support  | `secure-role-guard`                  |
| Astro (React)          | ✅ Full support  | `secure-role-guard`                  |
| Vite + React           | ✅ Full support  | `secure-role-guard`                  |
| Create React App       | ✅ Full support  | `secure-role-guard`                  |
| Express.js             | ✅ Full support  | `secure-role-guard/adapters/express` |
| Fastify                | 🔧 Adapter-ready | Use core directly                    |
| Node HTTP              | ✅ Full support  | `secure-role-guard/core`             |

---

## Common Mistakes to Avoid

### ❌ DON'T: Parse JWT in this package

```typescript
// WRONG - This package doesn't handle authentication
import { canUser } from "secure-role-guard";

const token = req.headers.authorization;
const decoded = jwt.verify(token, secret); // NOT our job
```

### ✅ DO: Pass already-authenticated user context

```typescript
// CORRECT - You handle auth, we handle authorization
import { canUser } from "secure-role-guard";

// Your auth middleware already verified and decoded the token
const user = req.user; // Set by YOUR auth middleware
const allowed = canUser(user, "admin.access", roleRegistry);
```

---

### ❌ DON'T: Store user in global state

```typescript
// WRONG - Global state is a security smell
let currentUser = null; // Anti-pattern
```

### ✅ DO: Pass user context explicitly

```typescript
// CORRECT - Explicit is better than implicit
<PermissionProvider user={user} registry={roleRegistry}>
  {children}
</PermissionProvider>
```

---

### ❌ DON'T: Use for authentication checks

```typescript
// WRONG - This is authentication, not authorization
if (canUser(user, "logged-in", registry)) {
  // ...
}
```

### ✅ DO: Check actual permissions

```typescript
// CORRECT - This is authorization
if (canUser(user, "user.update", registry)) {
  // ...
}
```

---

### ❌ DON'T: Assume permissions exist

```typescript
// WRONG - May throw or behave unexpectedly
if (user.permissions.includes("admin")) {
  // ...
}
```

### ✅ DO: Use the provided functions

```typescript
// CORRECT - Handles null/undefined safely (deny by default)
if (canUser(user, "admin.access", registry)) {
  // ...
}
```

---

## Backend Adapters

### Express Middleware

```typescript
import {
  requirePermission,
  requireAllPermissions,
  requireAnyPermission,
} from "secure-role-guard/adapters/express";

// Single permission
app.get("/api/users", requirePermission("user.read", registry), handler);

// All permissions required
app.delete(
  "/api/admin",
  requireAllPermissions(["admin.access", "data.delete"], registry),
  handler
);

// Any permission
app.get(
  "/api/reports",
  requireAnyPermission(["report.view", "report.admin"], registry),
  handler
);

// Custom options
app.put(
  "/api/settings",
  requirePermission("settings.update", registry, {
    statusCode: 401,
    message: "Unauthorized",
    getUser: (req) => req.session?.user,
  }),
  handler
);
```

### Next.js Route Handlers

```typescript
import {
  withPermission,
  checkNextPermission,
} from "secure-role-guard/adapters/nextjs";

// Using wrapper
export const POST = withPermission(
  "post.create",
  registry,
  { getUser: async (req) => getUserFromSession(req) },
  async (request, user) => {
    return Response.json({ created: true });
  }
);

// Manual check
export async function GET(request: NextRequest) {
  const user = await getUser(request);
  const result = checkNextPermission(user, "data.read", registry);

  if (!result.allowed) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  return Response.json({ data: [] });
}
```

---

## TypeScript Support

This package is written in TypeScript with strict mode enabled:

```typescript
// tsconfig.json (package configuration)
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "exactOptionalPropertyTypes": true
  }
}
```

All types are exported:

```typescript
import type {
  UserContext,
  RoleDefinition,
  RoleRegistry,
  PermissionCheckResult,
} from "secure-role-guard";
```

---

## License

MIT © [Sohel Rahaman](https://github.com/sohelrahaman)

---

## Security Note

This package is designed to be **boring, predictable, and auditable**. It intentionally avoids:

- Magic behavior
- Clever hacks
- Hidden side effects
- Runtime code generation

If you find a security issue, please report it via [GitHub Issues](https://github.com/sohelrahaman/secure-role-guard/issues).
