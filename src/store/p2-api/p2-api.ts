import { emptySplitApi as api } from "../empty-api";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getOrganizations: build.query<
      GetOrganizationsApiResponse,
      GetOrganizationsApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs`,
        params: {
          search: queryArg.search,
          first: queryArg.first,
          max: queryArg.max,
        },
      }),
    }),
    createOrganization: build.mutation<
      CreateOrganizationApiResponse,
      CreateOrganizationApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs`,
        method: "POST",
        body: queryArg.organizationRepresentation,
      }),
    }),
    getOrganizationById: build.query<
      GetOrganizationByIdApiResponse,
      GetOrganizationByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}`,
      }),
    }),
    updateOrganization: build.mutation<
      UpdateOrganizationApiResponse,
      UpdateOrganizationApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}`,
        method: "PUT",
        body: queryArg.organizationRepresentation,
      }),
    }),
    deleteOrganization: build.mutation<
      DeleteOrganizationApiResponse,
      DeleteOrganizationApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}`,
        method: "DELETE",
      }),
    }),
    createPortalLink: build.mutation<
      CreatePortalLinkApiResponse,
      CreatePortalLinkApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/portal-link`,
        method: "POST",
        body: queryArg.body,
      }),
    }),
    getOrganizationMemberships: build.query<
      GetOrganizationMembershipsApiResponse,
      GetOrganizationMembershipsApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/members`,
        params: { first: queryArg.first, max: queryArg.max },
      }),
    }),
    getOrganizationDomains: build.query<
      GetOrganizationDomainsApiResponse,
      GetOrganizationDomainsApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/domains`,
      }),
    }),
    getOrganizationDomain: build.query<
      GetOrganizationDomainApiResponse,
      GetOrganizationDomainApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/domains/${queryArg.domainName}`,
      }),
    }),
    verifyDomain: build.mutation<VerifyDomainApiResponse, VerifyDomainApiArg>({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/domains/${queryArg.domainName}/verify`,
        method: "POST",
      }),
    }),
    checkOrganizationMembership: build.query<
      CheckOrganizationMembershipApiResponse,
      CheckOrganizationMembershipApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/members/${queryArg.userId}`,
      }),
    }),
    addOrganizationMember: build.mutation<
      AddOrganizationMemberApiResponse,
      AddOrganizationMemberApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/members/${queryArg.userId}`,
        method: "PUT",
      }),
    }),
    removeOrganizationMember: build.mutation<
      RemoveOrganizationMemberApiResponse,
      RemoveOrganizationMemberApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/members/${queryArg.userId}`,
        method: "DELETE",
      }),
    }),
    addOrganizationInvitation: build.mutation<
      AddOrganizationInvitationApiResponse,
      AddOrganizationInvitationApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/invitations`,
        method: "POST",
        body: queryArg.invitationRequestRepresentation,
      }),
    }),
    getOrganizationInvitations: build.query<
      GetOrganizationInvitationsApiResponse,
      GetOrganizationInvitationsApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/invitations`,
        params: {
          search: queryArg.search,
          first: queryArg.first,
          max: queryArg.max,
        },
      }),
    }),
    removeOrganizationInvitation: build.mutation<
      RemoveOrganizationInvitationApiResponse,
      RemoveOrganizationInvitationApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/invitations/${queryArg.invitationId}`,
        method: "DELETE",
      }),
    }),
    getOrganizationRoles: build.query<
      GetOrganizationRolesApiResponse,
      GetOrganizationRolesApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/roles`,
      }),
    }),
    createOrganizationRole: build.mutation<
      CreateOrganizationRoleApiResponse,
      CreateOrganizationRoleApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/roles`,
        method: "POST",
        body: queryArg.organizationRoleRepresentation,
      }),
    }),
    getOrganizationRole: build.query<
      GetOrganizationRoleApiResponse,
      GetOrganizationRoleApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/roles/${queryArg.name}`,
      }),
    }),
    updateOrganizationRole: build.mutation<
      UpdateOrganizationRoleApiResponse,
      UpdateOrganizationRoleApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/roles/${queryArg.name}`,
        method: "PUT",
        body: queryArg.organizationRoleRepresentation,
      }),
    }),
    deleteOrganizationRole: build.mutation<
      DeleteOrganizationRoleApiResponse,
      DeleteOrganizationRoleApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/roles/${queryArg.name}`,
        method: "DELETE",
      }),
    }),
    getUserOrganizationRoles: build.query<
      GetUserOrganizationRolesApiResponse,
      GetUserOrganizationRolesApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/roles/${queryArg.name}/users`,
      }),
    }),
    checkUserOrganizationRole: build.query<
      CheckUserOrganizationRoleApiResponse,
      CheckUserOrganizationRoleApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/roles/${queryArg.name}/users/${queryArg.userId}`,
      }),
    }),
    grantUserOrganizationRole: build.mutation<
      GrantUserOrganizationRoleApiResponse,
      GrantUserOrganizationRoleApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/roles/${queryArg.name}/users/${queryArg.userId}`,
        method: "PUT",
      }),
    }),
    revokeUserOrganizationRole: build.mutation<
      RevokeUserOrganizationRoleApiResponse,
      RevokeUserOrganizationRoleApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/roles/${queryArg.name}/users/${queryArg.userId}`,
        method: "DELETE",
      }),
    }),
    importIdpJson: build.mutation<
      ImportIdpJsonApiResponse,
      ImportIdpJsonApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps/import-config`,
        method: "POST",
      }),
    }),
    getIdps: build.query<GetIdpsApiResponse, GetIdpsApiArg>({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps`,
      }),
    }),
    createIdp: build.mutation<CreateIdpApiResponse, CreateIdpApiArg>({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps`,
        method: "POST",
        body: queryArg.identityProviderRepresentation,
      }),
    }),
    getIdp: build.query<GetIdpApiResponse, GetIdpApiArg>({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps/${queryArg.alias}`,
      }),
    }),
    updateIdp: build.mutation<UpdateIdpApiResponse, UpdateIdpApiArg>({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps/${queryArg.alias}`,
        method: "PUT",
        body: queryArg.identityProviderRepresentation,
      }),
    }),
    deleteIdp: build.mutation<DeleteIdpApiResponse, DeleteIdpApiArg>({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps/${queryArg.alias}`,
        method: "DELETE",
      }),
    }),
    getIdpMappers: build.query<GetIdpMappersApiResponse, GetIdpMappersApiArg>({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps/${queryArg.alias}/mappers`,
      }),
    }),
    addIdpMapper: build.mutation<AddIdpMapperApiResponse, AddIdpMapperApiArg>({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps/${queryArg.alias}/mappers`,
        method: "POST",
        body: queryArg.identityProviderMapperRepresentation,
      }),
    }),
    getIdpMapper: build.query<GetIdpMapperApiResponse, GetIdpMapperApiArg>({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps/${queryArg.alias}/mappers/${queryArg.id}`,
      }),
    }),
    updateIdpMapper: build.mutation<
      UpdateIdpMapperApiResponse,
      UpdateIdpMapperApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps/${queryArg.alias}/mappers/${queryArg.id}`,
        method: "PUT",
        body: queryArg.identityProviderMapperRepresentation,
      }),
    }),
    deleteIdpMapper: build.mutation<
      DeleteIdpMapperApiResponse,
      DeleteIdpMapperApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps/${queryArg.alias}/mappers/${queryArg.id}`,
        method: "DELETE",
      }),
    }),
    getByRealmUsersAndUserIdOrgs: build.query<
      GetByRealmUsersAndUserIdOrgsApiResponse,
      GetByRealmUsersAndUserIdOrgsApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/users/${queryArg.userId}/orgs`,
      }),
    }),
    getByRealmUsersAndUserIdOrgsOrgIdRoles: build.query<
      GetByRealmUsersAndUserIdOrgsOrgIdRolesApiResponse,
      GetByRealmUsersAndUserIdOrgsOrgIdRolesApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/users/${queryArg.userId}/orgs/${queryArg.orgId}/roles`,
      }),
    }),
    createEvent: build.mutation<CreateEventApiResponse, CreateEventApiArg>({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/events`,
        method: "POST",
        body: queryArg.eventRepresentation,
      }),
    }),
    getRealmAttributes: build.query<
      GetRealmAttributesApiResponse,
      GetRealmAttributesApiArg
    >({
      query: (queryArg) => ({ url: `/${queryArg.realm}/attributes` }),
    }),
    createRealmAttribute: build.mutation<
      CreateRealmAttributeApiResponse,
      CreateRealmAttributeApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/attributes`,
        method: "POST",
        body: queryArg.realmAttributeRepresentation,
      }),
    }),
    getRealmAttributeByKey: build.query<
      GetRealmAttributeByKeyApiResponse,
      GetRealmAttributeByKeyApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/attributes/${queryArg.attributeKey}`,
      }),
    }),
    updateRealmAttributeByKey: build.mutation<
      UpdateRealmAttributeByKeyApiResponse,
      UpdateRealmAttributeByKeyApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/attributes/${queryArg.attributeKey}`,
        method: "PUT",
        body: queryArg.realmAttributeRepresentation,
      }),
    }),
    deleteRealmAttribute: build.mutation<
      DeleteRealmAttributeApiResponse,
      DeleteRealmAttributeApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/attributes/${queryArg.attributeKey}`,
        method: "DELETE",
      }),
    }),
    getWebhooks: build.query<GetWebhooksApiResponse, GetWebhooksApiArg>({
      query: (queryArg) => ({ url: `/${queryArg.realm}/webhooks` }),
    }),
    createWebhook: build.mutation<
      CreateWebhookApiResponse,
      CreateWebhookApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/webhooks`,
        method: "POST",
        body: queryArg.webhookRepresentation,
      }),
    }),
    getWebhookById: build.query<
      GetWebhookByIdApiResponse,
      GetWebhookByIdApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/webhooks/${queryArg.webhookId}`,
      }),
    }),
    updateWebhook: build.mutation<
      UpdateWebhookApiResponse,
      UpdateWebhookApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/webhooks/${queryArg.webhookId}`,
        method: "PUT",
        body: queryArg.webhookRepresentation,
      }),
    }),
    deleteWebhook: build.mutation<
      DeleteWebhookApiResponse,
      DeleteWebhookApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/webhooks/${queryArg.webhookId}`,
        method: "DELETE",
      }),
    }),
    createMagicLink: build.mutation<
      CreateMagicLinkApiResponse,
      CreateMagicLinkApiArg
    >({
      query: (queryArg) => ({
        url: `/${queryArg.realm}/magic-link`,
        method: "POST",
        body: queryArg.magicLinkRepresentation,
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as p2Api };
export type GetOrganizationsApiResponse =
  /** status 200 success */ OrganizationRepresentation[];
export type GetOrganizationsApiArg = {
  /** realm name (not id!) */
  realm: string;
  search?: string;
  first?: number;
  max?: number;
};
export type CreateOrganizationApiResponse = unknown;
export type CreateOrganizationApiArg = {
  /** realm name (not id!) */
  realm: string;
  organizationRepresentation: OrganizationRepresentation;
};
export type GetOrganizationByIdApiResponse =
  /** status 200 success */ OrganizationRepresentation;
export type GetOrganizationByIdApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
};
export type UpdateOrganizationApiResponse = unknown;
export type UpdateOrganizationApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  organizationRepresentation: OrganizationRepresentation;
};
export type DeleteOrganizationApiResponse = unknown;
export type DeleteOrganizationApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
};
export type CreatePortalLinkApiResponse =
  /** status 200 success */ PortalLinkRepresentation;
export type CreatePortalLinkApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  body: {
    userId?: string;
  };
};
export type GetOrganizationMembershipsApiResponse =
  /** status 200 success */ UserRepresentation[];
export type GetOrganizationMembershipsApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  first?: number;
  max?: number;
};
export type GetOrganizationDomainsApiResponse =
  /** status 200 success */ OrganizationDomainRepresentation[];
export type GetOrganizationDomainsApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
};
export type GetOrganizationDomainApiResponse =
  /** status 200 success */ OrganizationDomainRepresentation;
export type GetOrganizationDomainApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  /** domain name */
  domainName: string;
};
export type VerifyDomainApiResponse = unknown;
export type VerifyDomainApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  /** domain name */
  domainName: string;
};
export type CheckOrganizationMembershipApiResponse = unknown;
export type CheckOrganizationMembershipApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  /** user id */
  userId: string;
};
export type AddOrganizationMemberApiResponse = unknown;
export type AddOrganizationMemberApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  /** user id */
  userId: string;
};
export type RemoveOrganizationMemberApiResponse = unknown;
export type RemoveOrganizationMemberApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  /** user id */
  userId: string;
};
export type AddOrganizationInvitationApiResponse = unknown;
export type AddOrganizationInvitationApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  invitationRequestRepresentation: InvitationRequestRepresentation;
};
export type GetOrganizationInvitationsApiResponse =
  /** status 200 success */ InvitationRepresentation[];
export type GetOrganizationInvitationsApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  search?: string;
  first?: number;
  max?: number;
};
export type RemoveOrganizationInvitationApiResponse = unknown;
export type RemoveOrganizationInvitationApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  /** invitation id */
  invitationId: string;
};
export type GetOrganizationRolesApiResponse =
  /** status 200 success */ OrganizationRoleRepresentation[];
export type GetOrganizationRolesApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
};
export type CreateOrganizationRoleApiResponse = unknown;
export type CreateOrganizationRoleApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  organizationRoleRepresentation: OrganizationRoleRepresentation;
};
export type GetOrganizationRoleApiResponse =
  /** status 200 success */ OrganizationRoleRepresentation;
export type GetOrganizationRoleApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  /** organization role name */
  name: string;
};
export type UpdateOrganizationRoleApiResponse = unknown;
export type UpdateOrganizationRoleApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  /** organization role name */
  name: string;
  organizationRoleRepresentation: OrganizationRoleRepresentation;
};
export type DeleteOrganizationRoleApiResponse = unknown;
export type DeleteOrganizationRoleApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  /** organization role name */
  name: string;
};
export type GetUserOrganizationRolesApiResponse =
  /** status 200 success */ UserRepresentation[];
export type GetUserOrganizationRolesApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  /** organization role name */
  name: string;
};
export type CheckUserOrganizationRoleApiResponse = unknown;
export type CheckUserOrganizationRoleApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  /** organization role name */
  name: string;
  /** user id */
  userId: string;
};
export type GrantUserOrganizationRoleApiResponse = unknown;
export type GrantUserOrganizationRoleApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  /** organization role name */
  name: string;
  /** user id */
  userId: string;
};
export type RevokeUserOrganizationRoleApiResponse = unknown;
export type RevokeUserOrganizationRoleApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  /** organization role name */
  name: string;
  /** user id */
  userId: string;
};
export type ImportIdpJsonApiResponse = unknown;
export type ImportIdpJsonApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
};
export type GetIdpsApiResponse =
  /** status 200 success */ IdentityProviderRepresentation[];
export type GetIdpsApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
};
export type CreateIdpApiResponse = unknown;
export type CreateIdpApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  /** JSON body */
  identityProviderRepresentation: IdentityProviderRepresentation;
};
export type GetIdpApiResponse =
  /** status 200 success */ IdentityProviderRepresentation;
export type GetIdpApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  /** Identity Provider alias */
  alias: string;
};
export type UpdateIdpApiResponse = unknown;
export type UpdateIdpApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  /** Identity Provider alias */
  alias: string;
  identityProviderRepresentation: IdentityProviderRepresentation;
};
export type DeleteIdpApiResponse = unknown;
export type DeleteIdpApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  /** Identity Provider alias */
  alias: string;
};
export type GetIdpMappersApiResponse =
  /** status 200 success */ IdentityProviderMapperRepresentation[];
export type GetIdpMappersApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  alias: string;
};
export type AddIdpMapperApiResponse = unknown;
export type AddIdpMapperApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  alias: string;
  identityProviderMapperRepresentation: IdentityProviderMapperRepresentation;
};
export type GetIdpMapperApiResponse =
  /** status 200 success */ IdentityProviderMapperRepresentation;
export type GetIdpMapperApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  alias: string;
  /** Mapper id */
  id: string;
};
export type UpdateIdpMapperApiResponse = unknown;
export type UpdateIdpMapperApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  alias: string;
  /** Mapper id */
  id: string;
  identityProviderMapperRepresentation: IdentityProviderMapperRepresentation;
};
export type DeleteIdpMapperApiResponse = unknown;
export type DeleteIdpMapperApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  alias: string;
  /** Mapper id */
  id: string;
};
export type GetByRealmUsersAndUserIdOrgsApiResponse =
  /** status 200 success */ OrganizationRepresentation[];
export type GetByRealmUsersAndUserIdOrgsApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** user id */
  userId: string;
};
export type GetByRealmUsersAndUserIdOrgsOrgIdRolesApiResponse =
  /** status 200 success */ OrganizationRoleRepresentation[];
export type GetByRealmUsersAndUserIdOrgsOrgIdRolesApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** user id */
  userId: string;
  /** organization id */
  orgId: string;
};
export type CreateEventApiResponse = unknown;
export type CreateEventApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** JSON body */
  eventRepresentation: EventRepresentation;
};
export type GetRealmAttributesApiResponse =
  /** status 200 success */ KeyedRealmAttributeRepresentation[];
export type GetRealmAttributesApiArg = {
  /** realm name (not id!) */
  realm: string;
};
export type CreateRealmAttributeApiResponse = unknown;
export type CreateRealmAttributeApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** JSON body */
  realmAttributeRepresentation: RealmAttributeRepresentation;
};
export type GetRealmAttributeByKeyApiResponse =
  /** status 200 success */ RealmAttributeRepresentation;
export type GetRealmAttributeByKeyApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** attribute key */
  attributeKey: string;
};
export type UpdateRealmAttributeByKeyApiResponse = unknown;
export type UpdateRealmAttributeByKeyApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** attribute key */
  attributeKey: string;
  realmAttributeRepresentation: RealmAttributeRepresentation;
};
export type DeleteRealmAttributeApiResponse = unknown;
export type DeleteRealmAttributeApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** attribute key */
  attributeKey: string;
};
export type GetWebhooksApiResponse =
  /** status 200 success */ WebhookRepresentation[];
export type GetWebhooksApiArg = {
  /** realm name (not id!) */
  realm: string;
};
export type CreateWebhookApiResponse = unknown;
export type CreateWebhookApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** JSON body */
  webhookRepresentation: WebhookRepresentation;
};
export type GetWebhookByIdApiResponse =
  /** status 200 success */ WebhookRepresentation;
export type GetWebhookByIdApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** webhook id */
  webhookId: string;
};
export type UpdateWebhookApiResponse = unknown;
export type UpdateWebhookApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** webhook id */
  webhookId: string;
  webhookRepresentation: WebhookRepresentation;
};
export type DeleteWebhookApiResponse = unknown;
export type DeleteWebhookApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** webhook id */
  webhookId: string;
};
export type CreateMagicLinkApiResponse = unknown;
export type CreateMagicLinkApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** JSON body */
  magicLinkRepresentation: MagicLinkRepresentation;
};
export type OrganizationRepresentation = {
  id?: string;
  name?: string;
  displayName?: string;
  url?: string;
  realm?: string;
  domains?: string[];
  attributes?: {
    [key: string]: string[];
  };
};
export type PortalLinkRepresentation = {
  user?: string;
  link?: string;
  redirect?: string;
};
export type UserRepresentation = {
  attributes?: {
    [key: string]: any;
  };
  createdTimestamp?: number;
  email?: string;
  emailVerified?: boolean;
  enabled?: boolean;
  firstName?: string;
  groups?: string[];
  id?: string;
  lastName?: string;
  username?: string;
};
export type OrganizationDomainRepresentation = {
  domain_name?: string;
  verified?: boolean;
  record_key?: string;
  record_value?: string;
  type?: string;
};
export type InvitationRequestRepresentation = {
  email?: string;
  send?: boolean;
  inviterId?: string;
  redirectUri?: string;
  roles?: string[];
};
export type InvitationRepresentation = {
  id?: string;
  email?: string;
  inviterId?: string;
  organizationId?: string;
  roles?: string[];
};
export type OrganizationRoleRepresentation = {
  id?: string;
  name?: string;
  description?: string;
};
export type IdentityProviderRepresentation = {
  addReadTokenRoleOnCreate?: boolean;
  alias?: string;
  config?: {
    [key: string]: any;
  };
  displayName?: string;
  enabled?: boolean;
  firstBrokerLoginFlowAlias?: string;
  internalId?: string;
  linkOnly?: boolean;
  postBrokerLoginFlowAlias?: string;
  providerId?: string;
  storeToken?: boolean;
  trustEmail?: boolean;
};
export type IdentityProviderMapperRepresentation = {
  config?: {
    [key: string]: any;
  };
  id?: string;
  identityProviderAlias?: string;
  identityProviderMapper?: string;
  name?: string;
};
export type AuthDetailsRepresentation = {
  realmId?: string;
  clientId?: string;
  userId?: string;
  ipAddress?: string;
  username?: string;
  sessionId?: string;
};
export type EventRepresentation = {
  uid?: string;
  time?: number;
  realmId?: string;
  organizationId?: string;
  type?: string;
  representation?: string;
  operationType?: string;
  resourcePath?: string;
  resourceType?: string;
  error?: string;
  authDetails?: AuthDetailsRepresentation;
  details?: {
    [key: string]: any;
  };
};
export type RealmAttributeRepresentation = {
  name?: string;
  value?: string;
  realm?: string;
};
export type KeyedRealmAttributeRepresentation = {
  [key: string]: RealmAttributeRepresentation;
};
export type WebhookRepresentation = {
  attributes?: object;
  id?: string;
  enabled?: boolean;
  url?: string;
  secret?: string;
  created_by?: string;
  created_at?: string;
  realm?: string;
  event_types?: string[];
};
export type MagicLinkRepresentation = {
  email: string;
  client_id: string;
  redirect_uri: string;
  expiration_seconds?: number;
  force_create?: boolean;
  send_email?: boolean;
};
export const {
  useGetOrganizationsQuery,
  useCreateOrganizationMutation,
  useGetOrganizationByIdQuery,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useCreatePortalLinkMutation,
  useGetOrganizationMembershipsQuery,
  useGetOrganizationDomainsQuery,
  useGetOrganizationDomainQuery,
  useVerifyDomainMutation,
  useCheckOrganizationMembershipQuery,
  useAddOrganizationMemberMutation,
  useRemoveOrganizationMemberMutation,
  useAddOrganizationInvitationMutation,
  useGetOrganizationInvitationsQuery,
  useRemoveOrganizationInvitationMutation,
  useGetOrganizationRolesQuery,
  useCreateOrganizationRoleMutation,
  useGetOrganizationRoleQuery,
  useUpdateOrganizationRoleMutation,
  useDeleteOrganizationRoleMutation,
  useGetUserOrganizationRolesQuery,
  useCheckUserOrganizationRoleQuery,
  useGrantUserOrganizationRoleMutation,
  useRevokeUserOrganizationRoleMutation,
  useImportIdpJsonMutation,
  useGetIdpsQuery,
  useCreateIdpMutation,
  useGetIdpQuery,
  useUpdateIdpMutation,
  useDeleteIdpMutation,
  useGetIdpMappersQuery,
  useAddIdpMapperMutation,
  useGetIdpMapperQuery,
  useUpdateIdpMapperMutation,
  useDeleteIdpMapperMutation,
  useGetByRealmUsersAndUserIdOrgsQuery,
  useGetByRealmUsersAndUserIdOrgsOrgIdRolesQuery,
  useCreateEventMutation,
  useGetRealmAttributesQuery,
  useCreateRealmAttributeMutation,
  useGetRealmAttributeByKeyQuery,
  useUpdateRealmAttributeByKeyMutation,
  useDeleteRealmAttributeMutation,
  useGetWebhooksQuery,
  useCreateWebhookMutation,
  useGetWebhookByIdQuery,
  useUpdateWebhookMutation,
  useDeleteWebhookMutation,
  useCreateMagicLinkMutation,
} = injectedRtkApi;
