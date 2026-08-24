import Stat from "@/components/elements/cards/stat";
import {
  OrganizationRepresentation,
  useGetOrganizationMembershipsCountQuery,
} from "@/store/apis/orgs";
import { useTranslation } from "react-i18next";

type Props = {
  org: OrganizationRepresentation;
  realm: string;
};

const MembersStat: React.FC<Props> = ({ org, realm }) => {
  const { t } = useTranslation();
  const { data: membersCount = 0 } = useGetOrganizationMembershipsCountQuery({
    realm: realm,
    orgId: org.id!,
    excludeAdminAccounts: true,
  });

  return <Stat value={membersCount} label={t("members")} />;
};

export default MembersStat;
