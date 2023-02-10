import { apiConfig, apiRealm } from './helpers';
import { IdentityProvidersApi, OrganizationsApi, OrganizationDomainsApi, OrganizationInvitationsApi, OrganizationMembershipsApi, OrganizationRolesApi, UsersApi,
    AuthDetailsRepresentation, EventRepresentation, IdentityProviderMapperRepresentation, IdentityProviderRepresentation, InvitationRepresentation, InvitationRequestRepresentation, MagicLinkRepresentation, OrganizationDomainRepresentation, OrganizationRepresentation, OrganizationRoleRepresentation, PortalLinkRepresentation, RealmAttributeRepresentation, UserRepresentation, WebhookRepresentation } from '@p2-inc/js-sdk';

const identityProvidersApi = new IdentityProvidersApi(apiConfig);                                    
const organizationsApi = new OrganizationsApi(apiConfig);                                            
const domainsApi = new OrganizationDomainsApi(apiConfig);                                
const invitationsApi = new OrganizationInvitationsApi(apiConfig);                        
const membershipsApi = new OrganizationMembershipsApi(apiConfig);                        
const rolesApi = new OrganizationRolesApi(apiConfig);                                    
const usersApi = new UsersApi(apiConfig);                                                            

export type InviteDetails = {
    email: string;
    inviterId: string;
    roles: {
        [roleName: string]: string;
    };
};

export const Orgs = {

    getOrgs: async function(): Promise<Array<OrganizationRepresentation>> {
        return organizationsApi.getOrganizations({ realm: apiRealm });
    },

    getOrg: async function(orgId: string): Promise<OrganizationRepresentation> {
        return organizationsApi.getOrganizationById({ realm: apiRealm, orgId: orgId });
    },

    createOrg: async function(name: string, displayName: string): Promise<void> {
        return organizationsApi.createOrganization({ realm: apiRealm, organizationRepresentation: { name: name, displayName: displayName }});
    },

    editOrg: async function(org: OrganizationRepresentation): Promise<void> {
        return organizationsApi.updateOrganization({ realm: apiRealm, orgId: org.id ?? "", organizationRepresentation: org })
    }

    /** MORE TO DO
    getRolesForMemberInOrg: async function(userId: string, orgId: string): Promise<Array<OrganizationRoleRepresentation>> {}

    checkMemberRoleInOrg: async function(userId: string, orgId: string): Promise<OrganizationRoleRepresentation> {}

    inviteUserToOrg: async function(orgId: string, inviteDetails: InviteDetails): Promise<void> {}
    
    verifyDomain: async function(orgId: string, domain: OrganizationDomainRepresentation): Promise<OrganizationDomainRepresentation> {}
    */
}
