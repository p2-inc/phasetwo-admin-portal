import SectionHeader from "@/components/navs/section-header";
import Button from "@/components/elements/forms/buttons/button";
import {
  useAddOrganizationInvitationMutation,
  useGetOrganizationByIdQuery,
} from "@/store/apis/orgs";
import { useState } from "react";
import RHFFormTextInputWithLabel from "@/components/elements/forms/inputs/rhf-text-input-with-label";
import { FieldValues, useForm } from "react-hook-form";
import { config } from "@/config";
import { Link, useNavigate, useParams } from "react-router-dom";
import { keycloak } from "@/keycloak";
import P2Toast from "@/components/utils/toast";
import { User } from "lucide-react";
import useUser from "@/components/utils/useUser";
import Alert from "@/components/elements/alerts/alert";
import { useTranslation } from "react-i18next";
import { DecoratedRole, RolesList } from "@/pages/member/components";
import useOrgDisplayName from "@/components/utils/org-display-name";

const { realm } = config.env;

const loadingIcon = (
  <div>
    <div className="relative h-12 w-12 overflow-hidden rounded-md">
      <div className="absolute -inset-10 z-10 bg-linear-to-r from-primary/20 to-primary"></div>
      <div className="absolute inset-[2px] z-20 flex items-center justify-center rounded-sm bg-card text-card-foreground">
        <User />
      </div>
    </div>
  </div>
);

const NewInvitation = () => {
  const navigate = useNavigate();
  let { orgId } = useParams();
  const { t } = useTranslation();

  const { hasManageInvitationsRole: hasManageInvitationsRoleCheck } = useUser();

  const { data: org } = useGetOrganizationByIdQuery({
    orgId: orgId!,
    realm: config.env.realm,
  });

  const { orgName } = useOrgDisplayName(org);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const [addOrganizationInvitation] = useAddOrganizationInvitationMutation();
  const [selectedRoles, setSelectedRoles] = useState<DecoratedRole[]>();

  const onSubmit = async (data: FieldValues) => {
    if (data.email) {
      P2Toast({
        title: t("invitation-toast-submit", { data }),
        information: true,
      });
      await addOrganizationInvitation({
        orgId: orgId!,
        realm,
        invitationRequestRepresentation: {
          email: data.email,
          inviterId: keycloak.tokenParsed?.sub,
          roles: selectedRoles?.filter((r) => r.isChecked).map((r) => r.name),
          send: true,
        },
      })
        .unwrap()
        .then(() => {
          P2Toast({
            success: true,
            title: t("invitation-toast-submit-success", { data }),
          });
          reset();
          return navigate(`/organizations/${orgId}/invitation/pending`);
        })
        .catch((e) => {
          return P2Toast({
            error: true,
            title:
              e.status === 401 ? t("insufficient-permissions") : e.data.error,
          });
        });
    }
  };

  const hasManageInvitationsRole = hasManageInvitationsRoleCheck(orgId!);

  const isSendButtonDisabled = !hasManageInvitationsRole || isSubmitting;

  return (
    <div className="mt-4 md:mt-16">
      <SectionHeader
        title={t("invitation-title", { 0: orgName })}
        description={t("invitation-instructions-description")}
        icon={loadingIcon}
        rightContent={
          <Link
            to={`/organizations/${orgId}/details`}
            className="inline-block rounded-lg px-4 py-2 font-medium text-foreground opacity-60 transition hover:bg-muted hover:opacity-100"
          >
            {t("organization")}
          </Link>
        }
      />
      {!hasManageInvitationsRole && (
        <div className="mt-4">
          <Alert
            title={t("invitation-missing-permission-title")}
            body={t("invitation-missing-permission-body")}
            type="info"
          />
        </div>
      )}
      <RolesList orgId={orgId!} setSelectedRoles={setSelectedRoles} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-8 space-y-4">
          <RHFFormTextInputWithLabel
            slug="email"
            label="Email"
            register={register}
            registerArgs={{
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            }}
            error={errors.email}
            inputArgs={{
              type: "email",
              placeholder: t("invitation-email-placeholder"),
              required: true,
              disabled: !hasManageInvitationsRole,
            }}
          />

          <div className="mt-4">
            <Button isBlackButton disabled={isSendButtonDisabled} type="submit">
              {t("sendInvitation")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewInvitation;
