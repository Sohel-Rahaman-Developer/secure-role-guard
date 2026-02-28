import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ReactNode } from "react";
import { PermissionProvider } from "../provider";
import { Can, Cannot } from "../components";
import { defineRoles } from "../../core/role-registry";

const registry = defineRoles({
  admin: ["*"],
  user: ["post.read", "post.write"],
});

const TestProvider = ({
  children,
  roles = ["user"],
}: {
  children: ReactNode;
  roles?: string[];
}) => (
  <PermissionProvider user={{ userId: "1", roles }} registry={registry}>
    {children}
  </PermissionProvider>
);

describe("React Components", () => {
  describe("<Can />", () => {
    it("should render children if user has single permission", () => {
      const { getByTestId } = render(
        <TestProvider>
          <Can permission="post.read">
            <div data-testid="content">Allowed Content</div>
          </Can>
        </TestProvider>,
      );
      expect(getByTestId("content")).toBeInTheDocument();
    });

    it("should not render children if user lacks permission", () => {
      const { queryByTestId } = render(
        <TestProvider>
          <Can permission="admin.access">
            <div data-testid="content">Secret Content</div>
          </Can>
        </TestProvider>,
      );
      expect(queryByTestId("content")).toBeNull();
    });

    it("should render fallback if user lacks permission", () => {
      const { queryByTestId, getByTestId } = render(
        <TestProvider>
          <Can
            permission="admin.access"
            fallback={<div data-testid="fallback">Denied!</div>}
          >
            <div data-testid="content">Secret Content</div>
          </Can>
        </TestProvider>,
      );
      expect(queryByTestId("content")).toBeNull();
      expect(getByTestId("fallback")).toBeInTheDocument();
    });

    it("should handle multiple permissions (ALL)", () => {
      const { getByTestId } = render(
        <TestProvider>
          <Can permissions={["post.read", "post.write"]}>
            <div data-testid="content">Allowed Content</div>
          </Can>
        </TestProvider>,
      );
      expect(getByTestId("content")).toBeInTheDocument();
    });

    it("should handle multiple permissions (ANY)", () => {
      const { getByTestId } = render(
        <TestProvider>
          <Can permissions={["admin.access", "post.read"]} anyOf>
            <div data-testid="content">Allowed Content</div>
          </Can>
        </TestProvider>,
      );
      expect(getByTestId("content")).toBeInTheDocument();
    });
  });

  describe("<Cannot />", () => {
    it("should not render children if user has permission", () => {
      const { queryByTestId } = render(
        <TestProvider>
          <Cannot permission="post.read">
            <div data-testid="upgrade">Upgrade Now!</div>
          </Cannot>
        </TestProvider>,
      );
      expect(queryByTestId("upgrade")).toBeNull();
    });

    it("should render children if user lacks permission", () => {
      const { getByTestId } = render(
        <TestProvider>
          <Cannot permission="admin.access">
            <div data-testid="upgrade">Upgrade Now!</div>
          </Cannot>
        </TestProvider>,
      );
      expect(getByTestId("upgrade")).toBeInTheDocument();
    });
  });
});
