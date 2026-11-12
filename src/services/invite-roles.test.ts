import { describe, expect, it } from "vitest";
import {
  filterAssignableRoles,
  getInviteRoleAccess,
  realmManagementClientId,
  tokenHasRealmManageOrganizations,
} from "./invite-roles";

describe("tokenHasRealmManageOrganizations", () => {
  it("is true when realm-management grants manage-organizations", () => {
    const token = {
      resource_access: {
        "realm-management": { roles: ["view-users", "manage-organizations"] },
      },
    };
    expect(tokenHasRealmManageOrganizations(token, "acme")).toBe(true);
  });

  it("is false without the role, the client, or a token", () => {
    expect(
      tokenHasRealmManageOrganizations(
        { resource_access: { "realm-management": { roles: ["view-users"] } } },
        "acme",
      ),
    ).toBe(false);
    expect(
      tokenHasRealmManageOrganizations(
        { resource_access: { account: { roles: ["manage-organizations"] } } },
        "acme",
      ),
    ).toBe(false);
    expect(tokenHasRealmManageOrganizations({}, "acme")).toBe(false);
    expect(tokenHasRealmManageOrganizations(undefined, "acme")).toBe(false);
  });

  it("uses the master-realm client in the master realm", () => {
    expect(realmManagementClientId("master")).toBe("master-realm");
    const token = {
      resource_access: {
        "master-realm": { roles: ["manage-organizations"] },
      },
    };
    expect(tokenHasRealmManageOrganizations(token, "master")).toBe(true);
    expect(tokenHasRealmManageOrganizations(token, "acme")).toBe(false);
  });
});

describe("getInviteRoleAccess", () => {
  it("lets realm admins attach every role", () => {
    expect(
      getInviteRoleAccess({ isRealmOrgAdmin: true, heldOrgRoles: [] }),
    ).toEqual({ canAssignRoles: true, allowedRoles: undefined });
  });

  it("blocks role assignment without org manage-roles", () => {
    expect(
      getInviteRoleAccess({
        isRealmOrgAdmin: false,
        heldOrgRoles: ["manage-invitations", "view-organization"],
      }),
    ).toEqual({ canAssignRoles: false, allowedRoles: [] });
    expect(
      getInviteRoleAccess({ isRealmOrgAdmin: false, heldOrgRoles: undefined }),
    ).toEqual({ canAssignRoles: false, allowedRoles: [] });
  });

  it("limits manage-roles holders to the roles they hold", () => {
    expect(
      getInviteRoleAccess({
        isRealmOrgAdmin: false,
        heldOrgRoles: ["manage-roles", "manage-invitations", "billing"],
      }),
    ).toEqual({
      canAssignRoles: true,
      allowedRoles: ["manage-roles", "manage-invitations", "billing"],
    });
  });
});

describe("filterAssignableRoles", () => {
  const orgRoles = [
    { name: "view-organization" },
    { name: "manage-roles" },
    { name: "billing" },
  ];

  it("keeps all roles when unrestricted", () => {
    expect(filterAssignableRoles(orgRoles, undefined)).toEqual(orgRoles);
  });

  it("keeps only allowed roles", () => {
    expect(
      filterAssignableRoles(orgRoles, ["manage-roles", "billing"]),
    ).toEqual([{ name: "manage-roles" }, { name: "billing" }]);
    expect(filterAssignableRoles(orgRoles, [])).toEqual([]);
  });
});
