import { KeycloakProfile } from "keycloak-js";
import { useState, useEffect } from "react";
import { keycloak } from "keycloak";
import { OrganizationRepresentation, useGetMeQuery } from "store/apis/orgs";
import { config } from "config";
import { get, find, chain } from "lodash";
import { Roles } from "services/role";

export default function useUser() {
  const { realm } = config.env;
  const [user, setUser] = useState<KeycloakProfile>();

  const { data: userOrgs = {}, isFetching: isFetchingUserOrgs } = useGetMeQuery(
    { realm }
  );

  async function loadUser() {
    const u = await keycloak.loadUserProfile();
    setUser(u);
  }

  useEffect(() => {
    loadUser();
  }, []);

  function fullName() {
    if (!user) return "member";
    return user.firstName || user.lastName
      ? `${user.firstName} ${user.lastName}`.trim()
      : user.username || user.email || "member";
  }

  const checkOrgForRole = (orgId: string | undefined, role: Roles) => {
    const getRoles = get(userOrgs, [orgId, "roles"]);
    return getRoles ? getRoles.includes(role) : false;
  };

  const hasViewOrganizationRole = (orgId: OrganizationRepresentation["id"]) =>
    checkOrgForRole(orgId, Roles.ViewOrganization);
  const hasViewMembersRole = (orgId: OrganizationRepresentation["id"]) =>
    checkOrgForRole(orgId, Roles.ViewMembers);
  const hasViewInvitationsRole = (orgId: OrganizationRepresentation["id"]) =>
    checkOrgForRole(orgId, Roles.ViewInvitations);
  const hasViewRolesRole = (orgId: OrganizationRepresentation["id"]) =>
    checkOrgForRole(orgId, Roles.ViewRoles);
  const hasViewIdentityProvidersRole = (
    orgId: OrganizationRepresentation["id"]
  ) => checkOrgForRole(orgId, Roles.ViewIdentityProviders);
  const hasManageOrganizationRole = (orgId: OrganizationRepresentation["id"]) =>
    checkOrgForRole(orgId, Roles.ManageOrganization);
  const hasManageMembersRole = (orgId: OrganizationRepresentation["id"]) =>
    checkOrgForRole(orgId, Roles.ManageMembers);
  const hasManageInvitationsRole = (orgId: OrganizationRepresentation["id"]) =>
    checkOrgForRole(orgId, Roles.ManageInvitations);
  const hasManageRolesRole = (orgId: OrganizationRepresentation["id"]) =>
    checkOrgForRole(orgId, Roles.ManageRoles);
  const hasManageIdentityProvidersRole = (
    orgId: OrganizationRepresentation["id"]
  ) => checkOrgForRole(orgId, Roles.ManageIdentityProviders);

  return {
    user,
    fullName,
    userOrgs,
    isFetchingUserOrgs,
    checkOrgForRole,
    hasViewOrganizationRole,
    hasViewMembersRole,
    hasViewInvitationsRole,
    hasViewRolesRole,
    hasViewIdentityProvidersRole,
    hasManageOrganizationRole,
    hasManageMembersRole,
    hasManageInvitationsRole,
    hasManageRolesRole,
    hasManageIdentityProvidersRole,
  };
}
