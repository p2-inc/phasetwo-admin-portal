import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useRemoveOrganizationMemberMutation,
  UserRepresentation,
} from "@/store/apis/orgs";
import { KeycloakProfile } from "keycloak-js";
import MemberRemovalConfirmationDialog from "./member-removal-confirmation-dialog";
import P2Toast from "@/components/utils/toast";
import useUser from "@/components/utils/useUser";
import fullName from "@/components/utils/fullName";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Props = {
  member: UserRepresentation;
  user?: KeycloakProfile;
  orgId: string;
  realm: string;
};

export default function MembersActionMenu({ member, orgId, realm }: Props) {
  const { t } = useTranslation();
  const {
    user,
    hasManageMembersRole: hasManageMembersRoleCheck,
    hasManageRolesRole: hasManageRolesRoleCheck,
  } = useUser();
  const isSameUserAndMember = member.id === user?.id;
  const isRemoveDisabled = !user || isSameUserAndMember;

  const [isRemoveConfOpen, setRemoveConfOpen] = useState(false);

  const [removeOrganizationMember, { isLoading }] =
    useRemoveOrganizationMemberMutation();

  function confirmRemoveOrganizationMember() {
    removeOrganizationMember({
      orgId,
      realm,
      userId: member.id!,
    })
      .then(() => {
        P2Toast({
          success: true,
          title: t("member-toast-remove-success", { 0: fullName(member) }),
        });
        setRemoveConfOpen(false);
      })
      .catch((e) => {
        P2Toast({
          error: true,
          title: t("member-toast-remove-error"),
        });
        console.error(e);
      });
  }

  const hasManageMembersRole = hasManageMembersRoleCheck(orgId);
  const hasManageRolesRole = hasManageRolesRoleCheck(orgId);

  const isEditRolesDisabled = isSameUserAndMember || !hasManageRolesRole;

  return (
    <>
      <MemberRemovalConfirmationDialog
        open={isRemoveConfOpen}
        setOpen={setRemoveConfOpen}
        confirmSelection={confirmRemoveOrganizationMember}
        member={member}
        isLoading={isLoading}
      />

      <DropdownMenu>
        <div className="relative inline-block w-full text-left md:w-auto">
          <div className="flex h-[40px] items-center">
            <DropdownMenuTrigger className="w-full">
              <div className="flex w-full items-center justify-center space-x-2 rounded-sm border border-border py-1 px-4 text-sm transition hover:border-foreground md:border-transparent md:px-1">
                <EllipsisVertical
                  className="h-5 w-5 max-md:hidden"
                  aria-hidden="true"
                />
                <span className="md:hidden">{t("options")}</span>
              </div>
            </DropdownMenuTrigger>
          </div>
        </div>

        <DropdownMenuContent align="end" className="w-56">
          {isEditRolesDisabled ? (
            <DropdownMenuItem disabled>{t("editRoles")}</DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild>
              <Link
                to={`/organizations/${orgId}/members/${member.id}/roles`}
                state={{ member }}
              >
                {t("editRoles")}
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            disabled={isRemoveDisabled || !hasManageMembersRole}
            onSelect={() => setRemoveConfOpen(true)}
          >
            {t("remove")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
