import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { PermissionProvider } from "../provider";
import {
  useCan,
  useCanAll,
  useCanAny,
  usePermissions,
  useUser,
} from "../hooks";
import { defineRoles } from "../../core/role-registry";

const registry = defineRoles({
  admin: ["*"],
  user: ["profile.view", "profile.edit"],
});

const wrapper = ({ children }: { children: ReactNode }): ReactNode => (
  <PermissionProvider
    user={{ userId: "1", roles: ["user"] }}
    registry={registry}
  >
    {children}
  </PermissionProvider>
);

describe("React Hooks", () => {
  it("useCan should return true if user has permission", () => {
    const { result } = renderHook(() => useCan("profile.view"), { wrapper });
    expect(result.current).toBe(true);
  });

  it("useCan should return false if user lacks permission", () => {
    const { result } = renderHook(() => useCan("admin.access"), { wrapper });
    expect(result.current).toBe(false);
  });

  it("useCanAll should check all permissions", () => {
    const { result } = renderHook(
      () => useCanAll(["profile.view", "profile.edit"]),
      { wrapper },
    );
    expect(result.current).toBe(true);
  });

  it("useCanAll should return false if one is missing", () => {
    const { result } = renderHook(
      () => useCanAll(["profile.view", "admin.access"]),
      { wrapper },
    );
    expect(result.current).toBe(false);
  });

  it("useCanAny should return true if user has at least one", () => {
    const { result } = renderHook(
      () => useCanAny(["admin.access", "profile.view"]),
      { wrapper },
    );
    expect(result.current).toBe(true);
  });

  it("usePermissions should return the full context", () => {
    const { result } = renderHook(() => usePermissions(), { wrapper });
    expect(result.current.can("profile.view")).toBe(true);
    expect(result.current.can("admin.access")).toBe(false);
    expect(result.current.user?.roles).toContain("user");
  });

  it("useUser should return the current user", () => {
    const { result } = renderHook(() => useUser(), { wrapper });
    expect(result.current?.userId).toBe("1");
    expect(result.current?.roles).toContain("user");
  });
});
