import FormTextInputWithIcon from "@/components/elements/forms/inputs/text-input-with-icon";
import MainContentArea from "@/components/layouts/main-content-area";
import TopHeader from "@/components/navs/top-header";
import PrimaryContentArea from "@/components/layouts/primary-content-area";
import { useGetByRealmUsersAndUserIdOrgsQuery } from "@/store/apis/orgs";
import { config } from "@/config";
import OrganizationsLoader from "@/components/loaders/organizations";
import OrganizationItem from "@/components/elements/organizations/item";
import ViewSwitch, {
  ViewLayoutOptions,
} from "@/components/elements/forms/switches/view-switch";
import { useState } from "react";
import { cn } from "@/lib/utils";
import DomainStat from "./components/domain-stat";
import MembersStat from "./components/members-stat";
import useUser from "@/components/utils/useUser";
import { useTranslation } from "react-i18next";
import SsoConnections from "./components/sso-connections-stat";

const { realm } = config.env;

export default function Organizations() {
  const { t } = useTranslation();
  const { user } = useUser();
  const [viewType, setViewType] = useState<ViewLayoutOptions>(
    ViewLayoutOptions.GRID
  );
  const [searchString, setSearchString] = useState("");
  const { data: userOrgs = [], isFetching } =
    useGetByRealmUsersAndUserIdOrgsQuery(
      {
        realm,
        userId: user?.id!,
      },
      { skip: !user?.id }
    );

  const lowerSearch = searchString.toLowerCase();
  const searchOrgs =
    searchString === ""
      ? userOrgs
      : userOrgs.filter(
          (org) =>
            org.name?.toLowerCase().includes(lowerSearch) ||
            org.displayName?.toLowerCase().includes(lowerSearch)
        );

  return (
    <>
      <TopHeader
        header={t("organizations")}
        badgeVal={userOrgs.length}
        rightAreaItems={
          <>
            <FormTextInputWithIcon
              inputArgs={{
                placeholder: t("searchOrganizations"),
                onChange: (e) => setSearchString(e.target.value),
              }}
              className="w-full md:w-auto"
            />
            <ViewSwitch onChange={(value) => setViewType(value)} />
          </>
        }
      />
      <MainContentArea>
        {/* Primary content */}
        <PrimaryContentArea>
          <div>
            {isFetching && (
              <div className="grid grid-cols-1 justify-items-stretch gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <OrganizationsLoader />
                <OrganizationsLoader />
                <OrganizationsLoader />
                <OrganizationsLoader />
                <OrganizationsLoader />
                <OrganizationsLoader />
              </div>
            )}
            {!isFetching && (
              <div
                className={cn({
                  "grid grid-cols-1 justify-items-stretch gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3":
                    viewType === ViewLayoutOptions.GRID,
                  "divide-y divide-border rounded-md border border-border bg-muted":
                    viewType === ViewLayoutOptions.LIST,
                })}
              >
                {searchOrgs.map((org) => {
                  return (
                    <OrganizationItem
                      key={org.id}
                      org={org}
                      viewType={viewType}
                    >
                      <MembersStat org={org} realm={realm} />
                      <DomainStat org={org} realm={realm} />
                      <SsoConnections org={org} realm={realm} />
                    </OrganizationItem>
                  );
                })}
              </div>
            )}
          </div>
        </PrimaryContentArea>
      </MainContentArea>
    </>
  );
}
