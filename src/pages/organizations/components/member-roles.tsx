import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetByRealmUsersAndUserIdOrgsOrgIdRolesQuery,
  UserRepresentation,
} from "@/store/apis/orgs";
import { Roles, roleSettings } from "@/services/role";
import RoleBadge from "@/components/elements/badges/role-badge";
import { Link } from "react-router-dom";
import Button from "@/components/elements/forms/buttons/button";
import { checkOrgForRole } from "@/components/utils/check-org-for-role";
import useUser from "@/components/utils/useUser";
import { useTranslation } from "react-i18next";

type Props = {
  member: UserRepresentation;
  orgId: string;
  realm: string;
};

type FilteredRoleProp = {
  regexp: RegExp;
  regexpName: string;
  regexpClassName: string;
  roles: Array<any>;
  member: UserRepresentation;
  orgId: string;
};

const FilteredRole: React.FC<FilteredRoleProp> = ({
  regexp,
  regexpName,
  regexpClassName,
  roles,
  member,
  orgId,
}) => {
  const { hasManageRolesRole: hasManageRolesRoleCheck, user } = useUser();
  const filtered = roles.filter((f) => regexp.test(f.name));
  const hasManageRolesRole = hasManageRolesRoleCheck(orgId);
  const isSameUserAndMember = member.id === user?.id;
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative inline-block w-full text-left md:w-auto">
        <div className="flex w-full items-center justify-center space-x-2 rounded-sm border border-border py-1 px-4 text-sm transition hover:border-foreground">
          <span
            className={`inline-block h-2 w-2 rounded-full ${regexpClassName}`}
          ></span>
          <span className="inline-block">
            {filtered.length} {regexpName}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 p-4">
        {filtered.map((filteredRole) => (
          <DropdownMenuItem key={filteredRole.name} className="p-0">
            <RoleBadge name={filteredRole.name} />
          </DropdownMenuItem>
        ))}
        {!isSameUserAndMember && hasManageRolesRole && (
          <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
            <Link to={`/organizations/${orgId}/members/${member.id}/roles`}>
              <Button isCompact className="mt-4 w-full">
                {t("editRoles")}
              </Button>
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const MemberRoles: React.FC<Props> = ({ member, orgId, realm }) => {
  const { data: roles = [], isLoading } =
    useGetByRealmUsersAndUserIdOrgsOrgIdRolesQuery({
      orgId,
      realm,
      userId: member.id!,
    });

  const hasViewRolesRole = checkOrgForRole(roles, Roles.ViewRoles);

  return (
    <>
      {isLoading ? (
        <div className="inline-block h-[30px] w-32 animate-pulse rounded-sm bg-muted"></div>
      ) : (
        hasViewRolesRole &&
        roleSettings.map((f) => (
          <FilteredRole
            regexp={f.regexp}
            regexpName={f.name}
            roles={roles}
            regexpClassName={f.className}
            key={f.name}
            member={member}
            orgId={orgId}
          />
        ))
      )}
    </>
  );
};

export default MemberRoles;
