import { KeycloakProfile } from "keycloak-js";
import { useState, useEffect } from "react";
import { keycloak } from "keycloak";
import {
  injectedRtkApi,
  OrganizationRepresentation,
  OrganizationRoleRepresentation,
  useGetByRealmUsersAndUserIdOrgsOrgIdRolesQuery,
  useGetByRealmUsersAndUserIdOrgsQuery,
} from "store/apis/orgs";
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

  // async function hasSpecifiedRole(
  //   orgId: OrganizationRepresentation["id"],
  //   role: Roles
  // ) {
  //   // const { data } = useGetByRealmUsersAndUserIdOrgsOrgIdRolesQuery({
  //   //   orgId: orgId!,
  //   //   realm,
  //   //   userId: user?.id!,
  //   // });
  //   // await dispatch(
  //   //   injectedRtkApi.endpoints.getUserOrganizationRoles.initiate({
  //   //     name: "view-organization",
  //   //     orgId: orgId!,
  //   //     realm: realm,
  //   //   })
  //   // );
  //   const checkRole = await dispatch(
  //     injectedRtkApi.endpoints.getByRealmUsersAndUserIdOrgsOrgIdRoles.initiate({
  //       orgId: orgId!,
  //       realm,
  //       userId: user?.id!,
  //     })
  //   )
  //     .unwrap()
  //     .then((userOrgRoles) => {
  //       return userOrgRoles.find((uor) => uor.name === role);
  //     })
  //     .catch((e) => {
  //       return false;
  //     });
  //   // console.log("🚀 ~ file: useUser.tsx:38 ~ hasRole ~ checkRole:", checkRole);
  //   return isObject(checkRole);
  // }

  function checkOrgForRole(
    orgRoles: OrganizationRoleRepresentation[],
    roleName: Roles
  ) {
    return isObject(orgRoles.find((uor) => uor.name === roleName));
  }

  function fullName() {
    if (!user) return "member";
    return user.firstName || user.lastName
      ? `${user.firstName} ${user.lastName}`.trim()
      : user.username || user.email || "member";
  }

  return { user, fullName, checkOrgForRole };
}
