import { describe, it, expect, vi } from "vitest";
import {
  requirePermission,
  requireAllPermissions,
  requireAnyPermission,
  ExpressRequest,
  ExpressResponse,
  ExpressNextFunction,
} from "../express";
import { defineRoles } from "../../core/role-registry";

const registry = defineRoles({
  admin: ["*"],
  user: ["post.read", "post.write"],
});

describe("Express Adapter", () => {
  const mockResponse = () => {
    const res: any = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res as ExpressResponse;
  };

  describe("requirePermission", () => {
    it("should call next() if user has permission", () => {
      const req: ExpressRequest = { user: { userId: "1", roles: ["user"] } };
      const res = mockResponse();
      const next: ExpressNextFunction = vi.fn();

      const middleware = requirePermission("post.read", registry);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should return 403 if user lacks permission", () => {
      const req: ExpressRequest = { user: { userId: "1", roles: ["user"] } };
      const res = mockResponse();
      const next: ExpressNextFunction = vi.fn();

      const middleware = requirePermission("admin.access", registry);
      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: "Forbidden" });
    });

    it("should allow custom options", () => {
      const req: ExpressRequest = { user: { userId: "1", roles: ["user"] } };
      const res = mockResponse();
      const next: ExpressNextFunction = vi.fn();

      const middleware = requirePermission("admin.access", registry, {
        statusCode: 401,
        message: "Unauthorized custom",
      });
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized custom" });
    });
  });

  describe("requireAllPermissions", () => {
    it("should restrict access correctly", () => {
      const middleware = requireAllPermissions(
        ["post.read", "post.write"],
        registry,
      );
      const req: ExpressRequest = { user: { userId: "1", roles: ["user"] } };
      const res = mockResponse();
      const next: ExpressNextFunction = vi.fn();

      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("requireAnyPermission", () => {
    it("should allow access correctly", () => {
      const middleware = requireAnyPermission(
        ["admin.access", "post.read"],
        registry,
      );
      const req: ExpressRequest = { user: { userId: "1", roles: ["user"] } };
      const res = mockResponse();
      const next: ExpressNextFunction = vi.fn();

      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
