import { KeycloakProfile } from "keycloak-js";
import { useState, useEffect } from "react";
import { keycloak } from "keycloak";
import { injectedRtkApi, OrganizationRepresentation } from "store/apis/orgs";
import { useAppDispatch } from "store/hooks";
import { config } from "config";
import { Roles } from "services/role";
import { isObject } from "lodash";

const { realm } = config.env;

export default function useUser() {
  const [user, setUser] = useState<KeycloakProfile>();
  const dispatch = useAppDispatch();

  async function loadUser() {
    const u = await keycloak.loadUserProfile();
    setUser(u);
  }

  useEffect(() => {
    loadUser();
  }, []);

  async function hasRole(orgId: OrganizationRepresentation["id"], role: Roles) {
    // injectedRtkApi.endpoints.getRole
    const checkRole = await dispatch(
      injectedRtkApi.endpoints.getByRealmUsersAndUserIdOrgsOrgIdRoles.initiate({
        orgId: orgId!,
        realm,
        userId: user?.id!,
      })
    )
      .unwrap()
      .then((userOrgRoles) => {
        return userOrgRoles.find((uor) => uor.name === role);
      });
    return isObject(checkRole);
  }

  function fullName() {
    if (!user) return "member";
    return user.firstName || user.lastName
      ? `${user.firstName} ${user.lastName}`.trim()
      : user.username || user.email || "member";
  }

  return { user, fullName, hasRole };
}
