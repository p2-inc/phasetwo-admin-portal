import { emptySplitApi as api } from "./empty";
export const addTagTypes = [
  "Organizations",
  "Organization Memberships",
  "Organization Domains",
  "Organization Invitation",
  "Organization Roles",
  "Identity Providers",
  "Users",
  "Events",
  "Attributes",
] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
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
            q: queryArg.q,
          },
        }),
        providesTags: ["Organizations"],
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
        invalidatesTags: ["Organizations"],
      }),
      getOrganizationsCount: build.query<
        GetOrganizationsCountApiResponse,
        GetOrganizationsCountApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/count`,
          params: { search: queryArg.search },
        }),
        providesTags: ["Organizations"],
      }),
      getMe: build.query<GetMeApiResponse, GetMeApiArg>({
        query: (queryArg) => ({ url: `/${queryArg.realm}/orgs/me` }),
        providesTags: ["Organizations"],
      }),
      getOrganizationById: build.query<
        GetOrganizationByIdApiResponse,
        GetOrganizationByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}`,
        }),
        providesTags: ["Organizations"],
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
        invalidatesTags: ["Organizations"],
      }),
      deleteOrganization: build.mutation<
        DeleteOrganizationApiResponse,
        DeleteOrganizationApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Organizations"],
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
        invalidatesTags: ["Organizations"],
      }),
      getOrganizationMemberships: build.query<
        GetOrganizationMembershipsApiResponse,
        GetOrganizationMembershipsApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/members`,
          params: {
            search: queryArg.search,
            first: queryArg.first,
            max: queryArg.max,
          },
        }),
        providesTags: ["Organization Memberships"],
      }),
      getOrganizationMembershipsCount: build.query<
        GetOrganizationMembershipsCountApiResponse,
        GetOrganizationMembershipsCountApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/members/count`,
        }),
        providesTags: ["Organization Memberships"],
      }),
      getOrganizationDomains: build.query<
        GetOrganizationDomainsApiResponse,
        GetOrganizationDomainsApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/domains`,
        }),
        providesTags: ["Organization Domains"],
      }),
      getOrganizationDomain: build.query<
        GetOrganizationDomainApiResponse,
        GetOrganizationDomainApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/domains/${queryArg.domainName}`,
        }),
        providesTags: ["Organization Domains"],
      }),
      verifyDomain: build.mutation<VerifyDomainApiResponse, VerifyDomainApiArg>(
        {
          query: (queryArg) => ({
            url: `/${queryArg.realm}/orgs/${queryArg.orgId}/domains/${queryArg.domainName}/verify`,
            method: "POST",
          }),
          invalidatesTags: ["Organization Domains"],
        }
      ),
      checkOrganizationMembership: build.query<
        CheckOrganizationMembershipApiResponse,
        CheckOrganizationMembershipApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/members/${queryArg.userId}`,
        }),
        providesTags: ["Organization Memberships"],
      }),
      addOrganizationMember: build.mutation<
        AddOrganizationMemberApiResponse,
        AddOrganizationMemberApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/members/${queryArg.userId}`,
          method: "PUT",
        }),
        invalidatesTags: ["Organization Memberships"],
      }),
      removeOrganizationMember: build.mutation<
        RemoveOrganizationMemberApiResponse,
        RemoveOrganizationMemberApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/members/${queryArg.userId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Organization Memberships"],
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
        invalidatesTags: ["Organization Invitation"],
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
        providesTags: ["Organization Invitation"],
      }),
      getOrganizationInvitationCount: build.query<
        GetOrganizationInvitationCountApiResponse,
        GetOrganizationInvitationCountApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/invitations/count`,
        }),
        providesTags: ["Organization Invitation"],
      }),
      getOrganizationInvitationById: build.query<
        GetOrganizationInvitationByIdApiResponse,
        GetOrganizationInvitationByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/invitations/${queryArg.invitationId}`,
        }),
        providesTags: ["Organization Invitation"],
      }),
      removeOrganizationInvitation: build.mutation<
        RemoveOrganizationInvitationApiResponse,
        RemoveOrganizationInvitationApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/invitations/${queryArg.invitationId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Organization Invitation"],
      }),
      resendOrganizationInvitation: build.mutation<
        ResendOrganizationInvitationApiResponse,
        ResendOrganizationInvitationApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/invitations/${queryArg.invitationId}/resend-email`,
          method: "PUT",
        }),
        invalidatesTags: ["Organization Invitation"],
      }),
      getOrganizationRoles: build.query<
        GetOrganizationRolesApiResponse,
        GetOrganizationRolesApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/roles`,
        }),
        providesTags: ["Organization Roles"],
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
        invalidatesTags: ["Organization Roles"],
      }),
      createOrganizationRoles: build.mutation<
        CreateOrganizationRolesApiResponse,
        CreateOrganizationRolesApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/roles`,
          method: "PUT",
          body: queryArg.body,
        }),
        invalidatesTags: ["Organization Roles"],
      }),
      deleteOrganizationRoles: build.mutation<
        DeleteOrganizationRolesApiResponse,
        DeleteOrganizationRolesApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/roles`,
          method: "PATCH",
          body: queryArg.body,
        }),
        invalidatesTags: ["Organization Roles"],
      }),
      getOrganizationRole: build.query<
        GetOrganizationRoleApiResponse,
        GetOrganizationRoleApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/roles/${queryArg.name}`,
        }),
        providesTags: ["Organization Roles"],
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
        invalidatesTags: ["Organization Roles"],
      }),
      deleteOrganizationRole: build.mutation<
        DeleteOrganizationRoleApiResponse,
        DeleteOrganizationRoleApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/roles/${queryArg.name}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Organization Roles"],
      }),
      getUserOrganizationRoles: build.query<
        GetUserOrganizationRolesApiResponse,
        GetUserOrganizationRolesApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/roles/${queryArg.name}/users`,
        }),
        providesTags: ["Organization Roles"],
      }),
      checkUserOrganizationRole: build.query<
        CheckUserOrganizationRoleApiResponse,
        CheckUserOrganizationRoleApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/roles/${queryArg.name}/users/${queryArg.userId}`,
        }),
        providesTags: ["Organization Roles"],
      }),
      grantUserOrganizationRole: build.mutation<
        GrantUserOrganizationRoleApiResponse,
        GrantUserOrganizationRoleApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/roles/${queryArg.name}/users/${queryArg.userId}`,
          method: "PUT",
        }),
        invalidatesTags: ["Organization Roles"],
      }),
      revokeUserOrganizationRole: build.mutation<
        RevokeUserOrganizationRoleApiResponse,
        RevokeUserOrganizationRoleApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/roles/${queryArg.name}/users/${queryArg.userId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Organization Roles"],
      }),
      importIdpJson: build.mutation<
        ImportIdpJsonApiResponse,
        ImportIdpJsonApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps/import-config`,
          method: "POST",
        }),
        invalidatesTags: ["Identity Providers"],
      }),
      getIdps: build.query<GetIdpsApiResponse, GetIdpsApiArg>({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps`,
        }),
        providesTags: ["Identity Providers"],
      }),
      createIdp: build.mutation<CreateIdpApiResponse, CreateIdpApiArg>({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps`,
          method: "POST",
          body: queryArg.identityProviderRepresentation,
        }),
        invalidatesTags: ["Identity Providers"],
      }),
      linkIdp: build.mutation<LinkIdpApiResponse, LinkIdpApiArg>({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps/link`,
          method: "POST",
          body: queryArg.linkIdentityProviderRepresentation,
        }),
        invalidatesTags: ["Identity Providers"],
      }),
      unlinkIdp: build.mutation<UnlinkIdpApiResponse, UnlinkIdpApiArg>({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps/${queryArg.alias}/unlink`,
          method: "POST",
        }),
        invalidatesTags: ["Identity Providers"],
      }),
      getIdp: build.query<GetIdpApiResponse, GetIdpApiArg>({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps/${queryArg.alias}`,
        }),
        providesTags: ["Identity Providers"],
      }),
      updateIdp: build.mutation<UpdateIdpApiResponse, UpdateIdpApiArg>({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps/${queryArg.alias}`,
          method: "PUT",
          body: queryArg.identityProviderRepresentation,
        }),
        invalidatesTags: ["Identity Providers"],
      }),
      deleteIdp: build.mutation<DeleteIdpApiResponse, DeleteIdpApiArg>({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps/${queryArg.alias}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Identity Providers"],
      }),
      getIdpMappers: build.query<GetIdpMappersApiResponse, GetIdpMappersApiArg>(
        {
          query: (queryArg) => ({
            url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps/${queryArg.alias}/mappers`,
          }),
          providesTags: ["Identity Providers"],
        }
      ),
      addIdpMapper: build.mutation<AddIdpMapperApiResponse, AddIdpMapperApiArg>(
        {
          query: (queryArg) => ({
            url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps/${queryArg.alias}/mappers`,
            method: "POST",
            body: queryArg.identityProviderMapperRepresentation,
          }),
          invalidatesTags: ["Identity Providers"],
        }
      ),
      getIdpMapper: build.query<GetIdpMapperApiResponse, GetIdpMapperApiArg>({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps/${queryArg.alias}/mappers/${queryArg.id}`,
        }),
        providesTags: ["Identity Providers"],
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
        invalidatesTags: ["Identity Providers"],
      }),
      deleteIdpMapper: build.mutation<
        DeleteIdpMapperApiResponse,
        DeleteIdpMapperApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/orgs/${queryArg.orgId}/idps/${queryArg.alias}/mappers/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Identity Providers"],
      }),
      getByRealmUsersAndUserIdOrgs: build.query<
        GetByRealmUsersAndUserIdOrgsApiResponse,
        GetByRealmUsersAndUserIdOrgsApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/users/${queryArg.userId}/orgs`,
        }),
        providesTags: ["Users"],
      }),
      getByRealmUsersAndUserIdOrgsOrgIdRoles: build.query<
        GetByRealmUsersAndUserIdOrgsOrgIdRolesApiResponse,
        GetByRealmUsersAndUserIdOrgsOrgIdRolesApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/users/${queryArg.userId}/orgs/${queryArg.orgId}/roles`,
        }),
        providesTags: ["Users"],
      }),
      putByRealmUsersAndUserIdOrgsOrgIdRoles: build.mutation<
        PutByRealmUsersAndUserIdOrgsOrgIdRolesApiResponse,
        PutByRealmUsersAndUserIdOrgsOrgIdRolesApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/users/${queryArg.userId}/orgs/${queryArg.orgId}/roles`,
          method: "PUT",
          body: queryArg.body,
        }),
        invalidatesTags: ["Users"],
      }),
      patchByRealmUsersAndUserIdOrgsOrgIdRoles: build.mutation<
        PatchByRealmUsersAndUserIdOrgsOrgIdRolesApiResponse,
        PatchByRealmUsersAndUserIdOrgsOrgIdRolesApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/users/${queryArg.userId}/orgs/${queryArg.orgId}/roles`,
          method: "PATCH",
          body: queryArg.body,
        }),
        invalidatesTags: ["Users"],
      }),
      createEvent: build.mutation<CreateEventApiResponse, CreateEventApiArg>({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/events`,
          method: "POST",
          body: queryArg.eventRepresentation,
        }),
        invalidatesTags: ["Events"],
      }),
      getRealmAttributes: build.query<
        GetRealmAttributesApiResponse,
        GetRealmAttributesApiArg
      >({
        query: (queryArg) => ({ url: `/${queryArg.realm}/attributes` }),
        providesTags: ["Attributes"],
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
        invalidatesTags: ["Attributes"],
      }),
      getRealmAttributeByKey: build.query<
        GetRealmAttributeByKeyApiResponse,
        GetRealmAttributeByKeyApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/attributes/${queryArg.attributeKey}`,
        }),
        providesTags: ["Attributes"],
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
        invalidatesTags: ["Attributes"],
      }),
      deleteRealmAttribute: build.mutation<
        DeleteRealmAttributeApiResponse,
        DeleteRealmAttributeApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/attributes/${queryArg.attributeKey}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Attributes"],
      }),
      getWebhooks: build.query<GetWebhooksApiResponse, GetWebhooksApiArg>({
        query: (queryArg) => ({ url: `/${queryArg.realm}/webhooks` }),
        providesTags: ["Events"],
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
        invalidatesTags: ["Events"],
      }),
      getWebhookById: build.query<
        GetWebhookByIdApiResponse,
        GetWebhookByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/webhooks/${queryArg.webhookId}`,
        }),
        providesTags: ["Events"],
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
        invalidatesTags: ["Events"],
      }),
      deleteWebhook: build.mutation<
        DeleteWebhookApiResponse,
        DeleteWebhookApiArg
      >({
        query: (queryArg) => ({
          url: `/${queryArg.realm}/webhooks/${queryArg.webhookId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Events"],
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
        invalidatesTags: ["Users"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as orgsApi };
export type GetOrganizationsApiResponse =
  /** status 200 success */ OrganizationRepresentation[];
export type GetOrganizationsApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** search by name */
  search?: string;
  first?: number;
  max?: number;
  /** search by attributes using the format `k1:v1,k2:v2` */
  q?: string;
};
export type CreateOrganizationApiResponse = unknown;
export type CreateOrganizationApiArg = {
  /** realm name (not id!) */
  realm: string;
  organizationRepresentation: OrganizationRepresentation;
};
export type GetOrganizationsCountApiResponse = /** status 200 success */ number;
export type GetOrganizationsCountApiArg = {
  /** realm name (not id!) */
  realm: string;
  search?: string;
};
export type GetMeApiResponse =
  /** status 200 success */ MyOrganizationsRepresentation;
export type GetMeApiArg = {
  /** realm name (not id!) */
  realm: string;
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
  search?: string;
  first?: number;
  max?: number;
};
export type GetOrganizationMembershipsCountApiResponse =
  /** status 200 success */ number;
export type GetOrganizationMembershipsCountApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
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
export type GetOrganizationInvitationCountApiResponse =
  /** status 200 success */ number;
export type GetOrganizationInvitationCountApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
};
export type GetOrganizationInvitationByIdApiResponse =
  /** status 200 success */ InvitationRepresentation;
export type GetOrganizationInvitationByIdApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  /** invitation id */
  invitationId: string;
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
export type ResendOrganizationInvitationApiResponse = unknown;
export type ResendOrganizationInvitationApiArg = {
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
export type CreateOrganizationRolesApiResponse =
  /** status 207 Multi Status */ BulkResponseItem[];
export type CreateOrganizationRolesApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  body: OrganizationRoleRepresentation[];
};
export type DeleteOrganizationRolesApiResponse =
  /** status 207 Multi Status */ BulkResponseItem[];
export type DeleteOrganizationRolesApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  body: OrganizationRoleRepresentation[];
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
export type ImportIdpJsonApiResponse = /** status 200 success */ {
  [key: string]: any;
};
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
export type LinkIdpApiResponse = unknown;
export type LinkIdpApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  /** JSON body */
  linkIdentityProviderRepresentation: LinkIdentityProviderRepresentation;
};
export type UnlinkIdpApiResponse = unknown;
export type UnlinkIdpApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** organization id */
  orgId: string;
  /** idp alias */
  alias: string;
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
export type PutByRealmUsersAndUserIdOrgsOrgIdRolesApiResponse =
  /** status 207 Multi Status */ BulkResponseItem[];
export type PutByRealmUsersAndUserIdOrgsOrgIdRolesApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** user id */
  userId: string;
  /** organization id */
  orgId: string;
  body: OrganizationRoleRepresentation[];
};
export type PatchByRealmUsersAndUserIdOrgsOrgIdRolesApiResponse =
  /** status 207 Multi Status */ BulkResponseItem[];
export type PatchByRealmUsersAndUserIdOrgsOrgIdRolesApiArg = {
  /** realm name (not id!) */
  realm: string;
  /** user id */
  userId: string;
  /** organization id */
  orgId: string;
  body: OrganizationRoleRepresentation[];
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
export type MyOrganizationRepresentation = {
  name?: string;
  displayName?: string;
  url?: string;
  attributes?: {
    [key: string]: string[];
  };
  roles?: string[];
};
export type MyOrganizationsRepresentation = {
  [key: string]: MyOrganizationRepresentation;
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
  attributes?: {
    [key: string]: string[];
  };
};
export type InvitationRepresentation = {
  id?: string;
  createdAt?: string;
  email?: string;
  inviterId?: string;
  invitationUrl?: string;
  organizationId?: string;
  roles?: string[];
  attributes?: {
    [key: string]: string[];
  };
};
export type OrganizationRoleRepresentation = {
  id?: string;
  name?: string;
  description?: string;
};
export type BulkResponseItem = {
  status?: number;
  error?: string;
  item?: object;
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
export type LinkIdentityProviderRepresentation = {
  alias?: string;
  post_broker_flow?: string;
  sync_mode?: string;
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
  createdBy?: string;
  createdAt?: string;
  realm?: string;
  eventTypes?: string[];
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
  useGetOrganizationsCountQuery,
  useGetMeQuery,
  useGetOrganizationByIdQuery,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useCreatePortalLinkMutation,
  useGetOrganizationMembershipsQuery,
  useGetOrganizationMembershipsCountQuery,
  useGetOrganizationDomainsQuery,
  useGetOrganizationDomainQuery,
  useVerifyDomainMutation,
  useCheckOrganizationMembershipQuery,
  useAddOrganizationMemberMutation,
  useRemoveOrganizationMemberMutation,
  useAddOrganizationInvitationMutation,
  useGetOrganizationInvitationsQuery,
  useGetOrganizationInvitationCountQuery,
  useGetOrganizationInvitationByIdQuery,
  useRemoveOrganizationInvitationMutation,
  useResendOrganizationInvitationMutation,
  useGetOrganizationRolesQuery,
  useCreateOrganizationRoleMutation,
  useCreateOrganizationRolesMutation,
  useDeleteOrganizationRolesMutation,
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
  useLinkIdpMutation,
  useUnlinkIdpMutation,
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
  usePutByRealmUsersAndUserIdOrgsOrgIdRolesMutation,
  usePatchByRealmUsersAndUserIdOrgsOrgIdRolesMutation,
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
