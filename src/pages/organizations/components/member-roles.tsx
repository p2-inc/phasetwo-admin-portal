import SquareBadge from "components/elements/badges/square-badge";
import RolesLoader from "components/loaders/roles";
import {
  useGetByRealmUsersAndUserIdOrgsOrgIdRolesQuery,
  UserRepresentation,
} from "store/apis/orgs";

type Props = {
  member: UserRepresentation;
  orgId: string;
  realm: string;
};

const MemberRoles: React.FC<Props> = ({ member, orgId, realm }) => {
  const { data: roles = [], isLoading } =
    useGetByRealmUsersAndUserIdOrgsOrgIdRolesQuery({
      orgId,
      realm,
      userId: member.id!,
    });

  return (
    <div className="space-x-2 space-y-2">
      {isLoading && <RolesLoader />}
      {roles.map((role) => (
        <SquareBadge key={role.name}>{role.name}</SquareBadge>
      ))}
    </div>
  );
};

export default MemberRoles;
