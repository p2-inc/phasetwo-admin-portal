import { Roles } from "@/services/role";

/**
 * Client that holds the realm-level `manage-organizations` role checked by
 * keycloak-orgs. In the master realm this is the `master-realm` client,
 * otherwise `realm-management`.
 */
export const realmManagementClientId = (realm: string) =>
  realm === "master" ? "master-realm" : "realm-management";

export const REALM_MANAGE_ORGANIZATIONS = "manage-organizations";

type TokenWithResourceAccess = {
  resource_access?: Record<string, { roles?: string[] } | undefined>;
};

/** Whether the parsed access token grants realm `manage-organizations`. */
export const tokenHasRealmManageOrganizations = (
  tokenParsed: TokenWithResourceAccess | undefined,
  realm: string
): boolean =>
  !!tokenParsed?.resource_access?.[
    realmManagementClientId(realm)
  ]?.roles?.includes(REALM_MANAGE_ORGANIZATIONS);

export type InviteRoleAccess =
  /** Realm admin: every org role may be attached. */
  | { canAssignRoles: true; allowedRoles: undefined }
  /** Org `manage-roles` holder: only roles they hold. */
  | { canAssignRoles: true; allowedRoles: string[] }
  /** Anyone else: no roles may be attached. */
  | { canAssignRoles: false; allowedRoles: [] };

/**
 * Mirrors keycloak-orgs `InvitationsResource.canGrantRoles`:
 * - realm `manage-organizations` may attach any role;
 * - otherwise org `manage-roles` is required, and only held roles may be attached;
 * - an invitation without roles needs neither.
 */
export const getInviteRoleAccess = ({
  isRealmOrgAdmin,
  heldOrgRoles,
}: {
  isRealmOrgAdmin: boolean;
  heldOrgRoles: string[] | undefined;
}): InviteRoleAccess => {
  if (isRealmOrgAdmin) return { canAssignRoles: true, allowedRoles: undefined };
  const held = heldOrgRoles ?? [];
  if (!held.includes(Roles.ManageRoles))
    return { canAssignRoles: false, allowedRoles: [] };
  return { canAssignRoles: true, allowedRoles: [...held] };
};

/** Filters org roles down to those the inviter may attach. */
export const filterAssignableRoles = <T extends { name?: string }>(
  orgRoles: T[],
  allowedRoles: string[] | undefined
): T[] =>
  allowedRoles === undefined
    ? orgRoles
    : orgRoles.filter((r) => !!r.name && allowedRoles.includes(r.name));
