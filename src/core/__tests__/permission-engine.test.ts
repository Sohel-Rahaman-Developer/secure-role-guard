import { describe, it, expect } from "vitest";
import { defineRoles } from "../role-registry";
import {
  canUser,
  canUserAll,
  canUserAny,
  checkPermission,
} from "../permission-engine";
import type { UserContext } from "../types";

describe("Permission Engine", () => {
  const registry = defineRoles({
    admin: ["*", "specific.thing"],
    manager: ["users.*", "reports.view"],
    user: ["profile.view"],
  });

  describe("canUser", () => {
    it("should deny access if user is null or undefined", () => {
      expect(canUser(null, "profile.view", registry)).toBe(false);
      expect(canUser(undefined, "profile.view", registry)).toBe(false);
    });

    it("should grant access based on direct permissions", () => {
      const user: UserContext = {
        userId: "1",
        permissions: ["custom.permission"],
      };
      expect(canUser(user, "custom.permission", registry)).toBe(true);
      expect(canUser(user, "other.permission", registry)).toBe(false);
    });

    it("should grant access based on role permissions", () => {
      const user: UserContext = { userId: "1", roles: ["user"] };
      expect(canUser(user, "profile.view", registry)).toBe(true);
    });

    it("should handle global wildcards (*)", () => {
      const admin: UserContext = { userId: "1", roles: ["admin"] };
      expect(canUser(admin, "anything.really", registry)).toBe(true);
    });

    it("should handle namespace wildcards (e.g., users.*)", () => {
      const manager: UserContext = { userId: "1", roles: ["manager"] };
      expect(canUser(manager, "users.edit", registry)).toBe(true);
      expect(canUser(manager, "users.delete", registry)).toBe(true);
      expect(canUser(manager, "reports.edit", registry)).toBe(false);
    });
  });

  describe("canUserAll", () => {
    it("should correctly check all permissions", () => {
      const manager: UserContext = { userId: "1", roles: ["manager"] };
      expect(canUserAll(manager, ["users.read", "users.write"], registry)).toBe(
        true,
      );
      expect(
        canUserAll(manager, ["reports.view", "reports.edit"], registry),
      ).toBe(false);
    });

    it("should deny if permissions list is empty", () => {
      expect(canUserAll({ userId: "1" }, [], registry)).toBe(false);
    });
  });

  describe("canUserAny", () => {
    it("should correctly check any permissions", () => {
      const user: UserContext = { userId: "1", roles: ["user"] };
      expect(canUserAny(user, ["profile.view", "admin.access"], registry)).toBe(
        true,
      );
      expect(
        canUserAny(user, ["admin.access", "manager.access"], registry),
      ).toBe(false);
    });

    it("should deny if permissions list is empty", () => {
      expect(canUserAny({ userId: "1" }, [], registry)).toBe(false);
    });
  });

  describe("checkPermission", () => {
    it("should return detailed result", () => {
      const user: UserContext = { userId: "1", roles: ["user"] };
      const success = checkPermission(user, "profile.view", registry);
      expect(success.allowed).toBe(true);

      const failed = checkPermission(user, "admin.access", registry);
      expect(failed.allowed).toBe(false);
      expect(failed.reason).toBe('Permission "admin.access" denied');
    });
  });
});
