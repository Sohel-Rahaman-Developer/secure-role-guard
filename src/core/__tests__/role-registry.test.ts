import { describe, it, expect } from "vitest";
import { defineRoles, createEmptyRegistry } from "../role-registry";

describe("Role Registry", () => {
  it("should create a registry with defined roles", () => {
    const definitions = {
      admin: ["user.read", "user.write"],
      user: ["user.read"],
    };

    const registry = defineRoles(definitions);

    expect(registry.hasRole("admin")).toBe(true);
    expect(registry.hasRole("user")).toBe(true);
    expect(registry.hasRole("guest")).toBe(false);

    expect(registry.getPermissions("admin")).toEqual([
      "user.read",
      "user.write",
    ]);
    expect(registry.getPermissions("user")).toEqual(["user.read"]);
  });

  it("should safely handle unknown roles", () => {
    const registry = defineRoles({});
    expect(registry.getPermissions("unknown")).toEqual([]);
  });

  it("should return an empty registry from createEmptyRegistry", () => {
    const registry = createEmptyRegistry();
    expect(registry.getRoleNames()).toEqual([]);
  });

  it("should freeze the returned permissions array to prevent mutation", () => {
    const registry = defineRoles({ user: ["read"] });
    const permissions = registry.getPermissions("user") as string[];

    expect(() => {
      permissions.push("write");
    }).toThrow();
  });
});
