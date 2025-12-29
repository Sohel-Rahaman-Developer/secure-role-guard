# Advanced Documentation

> Detailed examples and advanced usage patterns for secure-role-guard.

For basic usage, see [README.md](./README.md).

---

## Table of Contents

- [Fixed Roles vs Dynamic Roles](#fixed-roles-vs-dynamic-roles)
- [Database Schema Examples](#database-schema-examples)
- [Framework-Specific Examples](#framework-specific-examples)
- [Express Middleware Options](#express-middleware-options)
- [Next.js Integration](#nextjs-integration)
- [Multi-Tenant Setup](#multi-tenant-setup)
- [Common Patterns](#common-patterns)

---

## Fixed Roles vs Dynamic Roles

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        YOUR APPLICATION                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   OPTION A: Fixed Roles              OPTION B: Dynamic Roles            │
│   ┌───────────────────┐              ┌───────────────────┐              │
│   │  roles.ts file    │              │  Database         │              │
│   │  (hardcoded)      │              │  (MongoDB/PG/SQL) │              │
│   └─────────┬─────────┘              └─────────┬─────────┘              │
│             │                                  │                         │
│             ▼                                  ▼                         │
│   ┌───────────────────┐              ┌───────────────────┐              │
│   │  defineRoles()    │              │  loadRolesFromDB()│              │
│   │  (at build time)  │              │  (at runtime)     │              │
│   └─────────┬─────────┘              └─────────┬─────────┘              │
│             │                                  │                         │
│             └──────────────┬───────────────────┘                         │
│                            ▼                                             │
│             ┌───────────────────────────────────┐                        │
│             │       secure-role-guard           │                        │
│             │  (same API for both approaches)   │                        │
│             └───────────────────────────────────┘                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### When to Use Fixed Roles

- ✅ Small to medium applications
- ✅ Roles rarely change
- ✅ Simple admin/user/viewer hierarchy
- ✅ Faster startup (no DB query)

### When to Use Dynamic Roles

- ✅ Enterprise SaaS applications
- ✅ Admin creates custom roles (e.g., "HR Manager")
- ✅ Roles change frequently
- ✅ Multi-tenant with different roles per tenant

---

## Database Schema Examples

### MongoDB

```javascript
// roles collection
{
  _id: ObjectId("..."),
  name: "hr_manager",
  display_name: "HR Manager",
  permissions: ["employee.read", "employee.create", "leave.approve"],
  is_active: true,
  tenant_id: ObjectId("..."),
  created_at: ISODate("...")
}

// users collection
{
  _id: ObjectId("..."),
  email: "john@example.com",
  roles: [ObjectId("role1"), ObjectId("role2")],
  direct_permissions: ["special.feature"],
  tenant_id: ObjectId("...")
}
```

### PostgreSQL

```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  tenant_id INTEGER REFERENCES tenants(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE role_permissions (
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);
```

### MySQL

```sql
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  is_active TINYINT(1) DEFAULT 1,
  tenant_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE role_permissions (
  role_id INT,
  permission_id INT,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);
```

---

## Framework-Specific Examples

### Next.js App Router

```tsx
// app/providers.tsx
"use client";

import { PermissionProvider } from "secure-role-guard/react";
import { roleRegistry } from "@/lib/roles";

export function Providers({ children, user }) {
  return (
    <PermissionProvider user={user} registry={roleRegistry}>
      {children}
    </PermissionProvider>
  );
}

// app/layout.tsx
import { Providers } from "./providers";
import { getUser } from "@/lib/auth";

export default async function RootLayout({ children }) {
  const user = await getUser();

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

### Vite/CRA

```tsx
// src/App.tsx
import { PermissionProvider } from "secure-role-guard";
import { roleRegistry } from "./roles";
import { useAuth } from "./auth";

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <PermissionProvider user={user} registry={roleRegistry}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<ProtectedAdmin />} />
        </Routes>
      </Router>
    </PermissionProvider>
  );
}

// src/components/ProtectedAdmin.tsx
import { useCan } from "secure-role-guard";
import { Navigate } from "react-router-dom";

function ProtectedAdmin() {
  const canAccess = useCan("admin.access");

  if (!canAccess) {
    return <Navigate to="/" replace />;
  }

  return <AdminPanel />;
}
```

### Remix

```tsx
// app/root.tsx
import { PermissionProvider } from "secure-role-guard/react";
import { roleRegistry } from "~/lib/roles";

export default function App() {
  const { user } = useLoaderData();

  return (
    <PermissionProvider user={user} registry={roleRegistry}>
      <Outlet />
    </PermissionProvider>
  );
}
```

---

## Express Middleware Options

### Basic Usage

```typescript
import { requirePermission } from "secure-role-guard/adapters/express";

app.get("/api/users", requirePermission("user.read", registry), handler);
```

### Multiple Permissions

```typescript
import {
  requireAllPermissions,
  requireAnyPermission,
} from "secure-role-guard/adapters/express";

// All required
app.delete(
  "/api/admin",
  requireAllPermissions(["admin.access", "data.delete"], registry),
  handler
);

// Any one is enough
app.get(
  "/api/reports",
  requireAnyPermission(["report.view", "report.admin"], registry),
  handler
);
```

### Custom Options

```typescript
app.put(
  "/api/settings",
  requirePermission("settings.update", registry, {
    statusCode: 401,
    message: "Unauthorized",
    getUser: (req) => req.session?.user, // Custom user extraction
  }),
  handler
);
```

---

## Next.js Integration

### API Routes (App Router)

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { canUser } from "secure-role-guard/core";
import { withPermission } from "secure-role-guard/adapters/nextjs";

const registry = defineRoles({
  admin: ["user.read", "user.update"],
  viewer: ["user.read"],
});

// Option 1: Manual check
export async function GET(request: NextRequest) {
  const user = await getUser(request);

  if (!canUser(user, "user.read", registry)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ users: [] });
}

// Option 2: Using wrapper
export const PUT = withPermission(
  "user.update",
  registry,
  { getUser: async (req) => getUser(req) },
  async (request, user) => {
    const body = await request.json();
    return NextResponse.json({ updated: true });
  }
);
```

---

## Multi-Tenant Setup

```typescript
// User context with tenant
const user = {
  userId: "usr_123",
  roles: ["org_admin"],
  permissions: [],
  meta: {
    tenantId: "tenant_xyz",
    orgId: "org_456",
    plan: "enterprise",
  },
};

// Check permission
if (canUser(user, "billing.view", registry)) {
  // Access tenant from meta
  const data = await fetchBillingData(user.meta.tenantId);
}
```

---

## Common Patterns

### Protected Route Component

```tsx
import { useCan } from "secure-role-guard";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ permission, children, redirectTo = "/" }) {
  const allowed = useCan(permission);

  if (!allowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

// Usage
<Route
  path="/admin"
  element={
    <ProtectedRoute permission="admin.access">
      <AdminPanel />
    </ProtectedRoute>
  }
/>;
```

### Permission-Based Navigation

```tsx
import { useCan } from "secure-role-guard";

function Sidebar() {
  const canViewUsers = useCan("user.read");
  const canViewReports = useCan("report.view");
  const canViewSettings = useCan("settings.view");

  return (
    <nav>
      <Link to="/">Home</Link>
      {canViewUsers && <Link to="/users">Users</Link>}
      {canViewReports && <Link to="/reports">Reports</Link>}
      {canViewSettings && <Link to="/settings">Settings</Link>}
    </nav>
  );
}
```

### Dynamic Role Loading with Cache

```typescript
let cachedRegistry = null;
let cacheExpiry = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getRoleRegistry(db) {
  const now = Date.now();

  if (cachedRegistry && now < cacheExpiry) {
    return cachedRegistry;
  }

  const roles = await db.roles.find({ is_active: true });
  const roleDefinition = {};

  for (const role of roles) {
    roleDefinition[role.name] = role.permissions;
  }

  cachedRegistry = defineRoles(roleDefinition);
  cacheExpiry = now + CACHE_TTL;

  return cachedRegistry;
}

// Invalidate when admin updates roles
function invalidateRoleCache() {
  cachedRegistry = null;
  cacheExpiry = 0;
}
```

---

## Additional Resources

- [README.md](./README.md) - Quick start guide
- [ROADMAP.md](./ROADMAP.md) - Future plans
- [CHANGELOG.md](./CHANGELOG.md) - Version history
