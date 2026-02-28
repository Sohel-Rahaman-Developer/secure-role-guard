import { describe, it, expect } from "vitest";
import {
  checkNextPermission,
  checkNextPermissionAll,
  checkNextPermissionAny,
  withPermission,
  NextRequest,
} from "../nextjs";
import { defineRoles } from "../../core/role-registry";

const registry = defineRoles({
  admin: ["*"],
  user: ["post.read", "post.write"],
});

describe("Next.js Adapter", () => {
  const user = { userId: "1", roles: ["user"] };

  describe("Pure check functions", () => {
    it("checkNextPermission", () => {
      const res = checkNextPermission(user, "post.read", registry);
      expect(res.allowed).toBe(true);
      expect(res.user?.userId).toBe("1");
    });

    it("checkNextPermissionAll", () => {
      const res = checkNextPermissionAll(
        user,
        ["post.read", "admin.access"],
        registry,
      );
      expect(res.allowed).toBe(false);
    });

    it("checkNextPermissionAny", () => {
      const res = checkNextPermissionAny(
        user,
        ["post.read", "admin.access"],
        registry,
      );
      expect(res.allowed).toBe(true);
    });
  });

  describe("withPermission HOC", () => {
    it("should execute handler when permitted", async () => {
      const handler = async () =>
        new Response(JSON.stringify({ success: true }));
      const wrapped = withPermission(
        "post.read",
        registry,
        {
          getUser: () => user,
        },
        handler,
      );

      const req = { headers: new Headers() } as unknown as NextRequest;
      const response = await wrapped(req);

      expect(response).toBeInstanceOf(Response);
      const data = await response.json();
      expect(data.success).toBe(true);
    });

    it("should return 403 response when denied", async () => {
      const handler = async () =>
        new Response(JSON.stringify({ success: true }));
      const wrapped = withPermission(
        "admin.access",
        registry,
        {
          getUser: () => user,
        },
        handler,
      );

      const req = { headers: new Headers() } as unknown as NextRequest;
      const response = await wrapped(req);

      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe("Forbidden");
    });
  });
});
