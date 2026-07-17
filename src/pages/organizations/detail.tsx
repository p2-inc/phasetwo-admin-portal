import Button from "@/components/elements/forms/buttons/button";
import MainContentArea from "@/components/layouts/main-content-area";
import TopHeader from "@/components/navs/top-header";
import SectionHeader from "@/components/navs/section-header";
import { Link, useParams } from "react-router-dom";
import { config } from "@/config";
import {
  useGetIdpsQuery,
  useGetOrganizationByIdQuery,
  useGetOrganizationDomainsQuery,
  useGetOrganizationInvitationCountQuery,
  useGetOrganizationMembershipsCountQuery,
  useGetOrganizationMembershipsQuery,
} from "@/store/apis/orgs";
import RoundBadge from "@/components/elements/badges/round-badge";
import FormTextInputWithIcon from "@/components/elements/forms/inputs/text-input-with-icon";
import HeaderLayout from "@/components/navs/components/header-layout";
import { TableRows } from "@/components/elements/table/table";
import OrganizationActionCard, {
  OACTopRow,
} from "@/components/elements/organizations/action-card";
import PrimaryContentArea from "@/components/layouts/primary-content-area";
import Stat from "@/components/elements/cards/stat";
import RoundedIcon from "@/components/elements/rounded-icon";
import MemberRoles from "./components/member-roles";
import MembersActionMenu from "./components/member-action-menu";
import Breadcrumbs from "@/components/navs/breadcrumbs";
import OpenSSOLink from "@/components/utils/ssoLink";
import MembersTable from "@/components/elements/table/members-table";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Network,
  Plus,
  User,
} from "lucide-react";
import useUser from "@/components/utils/useUser";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { toNumber } from "lodash";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useOrgDisplayName from "@/components/utils/org-display-name";

export default function OrganizationDetail() {
  const { t } = useTranslation();
  let { orgId } = useParams();
  const [first, setFirst] = useState(0);
  const [max, setMax] = useState(10);
  const [search, setSearch] = useState("");
  const { features: featureFlags, realm } = config.env;
  const {
    hasManageInvitationsRole: hasManageInvitationsRoleCheck,
    hasViewInvitationsRole: hasViewInvitationsRoleCheck,
    hasManageOrganizationRole: hasManageOrganizationRoleCheck,
    hasManageIdentityProvidersRole,
    hasViewIdentityProvidersRole,
  } = useUser();
  const { data: org } = useGetOrganizationByIdQuery({
    orgId: orgId!,
    realm,
  });
  const { orgName } = useOrgDisplayName(org);

  const {
    data: members = [],
    isLoading,
    isFetching,
  } = useGetOrganizationMembershipsQuery({
    orgId: orgId!,
    realm,
    first,
    max,
    search,
    excludeAdminAccounts: true,
  });
  const { data: membersCount = 0 } = useGetOrganizationMembershipsCountQuery({
    orgId: orgId!,
    realm,
    excludeAdminAccounts: true,
  });
  const { data: inviteCount = 0 } = useGetOrganizationInvitationCountQuery({
    orgId: orgId!,
    realm,
  });
  const { data: domains = [] } = useGetOrganizationDomainsQuery({
    orgId: orgId!,
    realm,
  });
  const unverifiedDomains =
    domains.length > 0 ? domains.filter((d) => !d.verified).length : 0;
  const { data: idps = [] } = useGetIdpsQuery({
    orgId: orgId!,
    realm,
  });

  useEffect(() => {
    if (first !== 0) setFirst(0);
  }, [search]);

  const hasManageInvitationsRole = hasManageInvitationsRoleCheck(orgId);
  const hasViewInvitationsRole = hasViewInvitationsRoleCheck(orgId);
  const hasManageOrganizationRole = hasManageOrganizationRoleCheck(orgId);
  const hasManageIDPRole = hasManageIdentityProvidersRole(orgId);
  const hasViewIDPRole = hasViewIdentityProvidersRole(orgId);
  // const [createPortalLink, { isSuccess }] = useCreatePortalLinkMutation();

  const totalMembers = members.length;

  const rows: TableRows = members.map((member) => ({
    ...member,
    name: `${member.firstName || ""} ${member.lastName || ""}`.trim(),
    roles: <MemberRoles member={member} orgId={orgId!} realm={realm} />,
    action: <MembersActionMenu member={member} orgId={orgId!} realm={realm} />,
  }));

  // The count endpoint is not search-aware, so the exact total only applies
  // to the unfiltered list; searches fall back to page-fullness.
  const forwardDisabled =
    isFetching ||
    (search === "" ? first + max >= membersCount : totalMembers < max);
  const backwardDisabled = isFetching || first === 0;
  const lowEnd = first + 1;
  const highEnd = first + totalMembers;
  const forward = () => setFirst(first + max);
  const backward = () => setFirst(first - max);
  const adjustMax = (value: string) => {
    setFirst(0);
    setMax(toNumber(value));
  };

  return (
    <>
      <TopHeader
        header={orgName}
        collapseOnMobile={true}
        leftAreaItems={
          <Breadcrumbs
            items={[{ title: t("organizations"), link: "/organizations" }]}
          />
        }
        rightAreaItems={
          <>
            {hasManageOrganizationRole && (
              <Link to={`/organizations/${org?.id}/settings`}>
                <Button>{t("settings")}</Button>
              </Link>
            )}
          </>
        }
      />
      {/* Action Cards */}
      <MainContentArea>
        <PrimaryContentArea>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {/* Invite new members */}
            {featureFlags.orgInvitationsEnabled && (
              <OrganizationActionCard>
                <OACTopRow>
                  <RoundedIcon>
                    <User className="h-5 w-5" />
                  </RoundedIcon>
                  <Stat label={t("members")} value={membersCount}></Stat>
                  {hasViewInvitationsRole ? (
                    <Link to={`/organizations/${orgId}/invitation/pending`}>
                      <Stat label={t("invited")} value={inviteCount}></Stat>
                    </Link>
                  ) : (
                    <Stat label={t("invited")} value={inviteCount}></Stat>
                  )}
                </OACTopRow>
                <div>
                  <SectionHeader title={t("members")} variant="small" />
                  <div className="text-sm leading-relaxed text-muted-foreground">
                    {t("inviteNewMembersOrRemoveMembersFromTheOrganization")}
                  </div>
                </div>
                <div>
                  {hasManageInvitationsRole ? (
                    <div className="flex items-center gap-2">
                      <Link to={`/organizations/${orgId}/invitation/new`}>
                        <Button
                          isBlackButton
                          disabled={!hasManageInvitationsRole}
                        >
                          <Plus className="mr-2 h-auto w-4" />
                          {t("invite")}
                        </Button>
                      </Link>

                      <Link to={`/organizations/${orgId}/invitation/pending`}>
                        <Button className="capitalize">
                          {t("manageInvites")}
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Button isBlackButton disabled={!hasManageInvitationsRole}>
                      <Plus className="mr-2 w-3" />
                      {t("invite")}
                    </Button>
                  )}
                </div>
              </OrganizationActionCard>
            )}

            {/* Setup SSO */}
            {featureFlags.orgSsoEnabled && (
              <OrganizationActionCard>
                <OACTopRow>
                  <RoundedIcon>
                    <Network className="h-5 w-5" />
                  </RoundedIcon>
                  <Stat
                    label={t("active")}
                    value={idps.filter((idp) => idp.enabled).length}
                  ></Stat>
                  <Stat
                    label={t("disabled")}
                    value={idps.filter((idp) => idp.enabled === false).length}
                  ></Stat>
                </OACTopRow>
                <div>
                  <SectionHeader title={t("ssoConnections")} variant="small" />
                  <div className="text-sm leading-relaxed text-muted-foreground">
                    {t("setupSsoConnectionsAsNecessaryForThisOrganization")}
                  </div>
                </div>
                <div>
                  {hasManageOrganizationRole ? (
                    <div className="space-x-2">
                      <Button
                        isBlackButton
                        onClick={() => OpenSSOLink({ orgId: orgId! })}
                        disabled={!hasManageIDPRole || !hasViewIDPRole}
                      >
                        {t("setupSso")}
                      </Button>
                      <Link to={`/organizations/${org?.id}/settings`}>
                        <Button className="capitalize">{t("manage")}</Button>
                      </Link>
                    </div>
                  ) : (
                    <Button isBlackButton disabled>
                      {t("setupSso")}
                    </Button>
                  )}
                </div>
              </OrganizationActionCard>
            )}

            {/* Setup domains */}
            {featureFlags.orgDomainsEnabled && (
              <OrganizationActionCard>
                <OACTopRow>
                  <RoundedIcon>
                    <Globe className="h-5 w-5" />
                  </RoundedIcon>
                  <Stat label={t("domains")} value={domains.length}></Stat>
                  <Stat
                    label={t("pendingVerification")}
                    value={unverifiedDomains}
                  ></Stat>
                </OACTopRow>
                <div>
                  <SectionHeader title={t("domains")} variant="small" />
                  <div className="text-sm leading-relaxed text-muted-foreground">
                    {t(
                      "setupAssociatedDomainsAndVerifyThemToEnsureFullSecurity"
                    )}
                  </div>
                </div>
                <div>
                  {hasManageOrganizationRole ? (
                    <div className="space-x-2">
                      <Link to={`/organizations/${org?.id}/domains/add`}>
                        <Button isBlackButton>{t("setupDomains")}</Button>
                      </Link>
                      <Link to={`/organizations/${org?.id}/settings`}>
                        <Button className="capitalize">{t("manage")}</Button>
                      </Link>
                    </div>
                  ) : (
                    <Button isBlackButton disabled>
                      {t("setupDomains")}
                    </Button>
                  )}
                </div>
              </OrganizationActionCard>
            )}
          </div>
        </PrimaryContentArea>
      </MainContentArea>

      {/* Members table */}
      <MainContentArea>
        <section
          aria-labelledby="members-area"
          className="flex h-full min-w-0 flex-1 flex-col"
        >
          <HeaderLayout
            leftAreaItems={
              <>
                <SectionHeader title={t("members")} variant="small" />
                <div className="ml-2">
                  <RoundBadge>{membersCount}</RoundBadge>
                </div>
              </>
            }
          />
          <div className="space-y-2 px-4 pb-4 md:px-10 md:pb-40">
            <div className="flex ">
              <div className="relative flex-1 md:flex-auto">
                <FormTextInputWithIcon
                  inputArgs={{
                    placeholder: t("searchMembers"),
                    onChange: (e) => setSearch(e.target.value),
                  }}
                  className="w-full md:w-auto"
                />
                {isFetching && (
                  <div className="absolute left-[-5px] top-[-5px]">
                    <span className="relative flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
                    </span>
                  </div>
                )}
              </div>
              <div className="px-4 text-foreground">
                <div className="flex h-full items-center">
                  <button
                    onClick={backward}
                    disabled={backwardDisabled}
                    className="disabled:opacity-30"
                  >
                    <ChevronLeft className="w-5" />
                  </button>
                  <div className="px-2">
                    {lowEnd}-{highEnd}
                  </div>
                  <button
                    onClick={forward}
                    disabled={forwardDisabled}
                    className="disabled:opacity-30"
                  >
                    <ChevronRight className="w-5" />
                  </button>
                </div>
              </div>
              <div>
                <Select
                  name="location"
                  defaultValue="10"
                  onValueChange={adjustMax}
                >
                  <SelectTrigger id="location" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {featureFlags.orgMembersEnabled && (
              <div>
                <MembersTable rows={rows} isLoading={isLoading} />
              </div>
            )}
          </div>
        </section>
      </MainContentArea>
    </>
  );
}
