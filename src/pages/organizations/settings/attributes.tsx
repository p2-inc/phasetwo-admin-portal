import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { P2Params } from "index";
import SectionHeader from "@/components/navs/section-header";
import P2Toast from "@/components/utils/toast";
import useUser from "@/components/utils/useUser";
import { config } from "@/config";
import AttributesEditor, {
  AttributeRow,
} from "@/components/elements/forms/attributes-editor";
import {
  OrganizationRepresentation,
  useGetOrganizationByIdQuery,
  useUpdateOrganizationMutation,
} from "@/store/apis/orgs";
import { SettingsProps } from ".";

type OrgAttributes = NonNullable<OrganizationRepresentation["attributes"]>;

const isInternalKey = (key: string) => key.startsWith("_");

export const flattenAttributes = (
  attributes: OrgAttributes = {},
): AttributeRow[] =>
  Object.entries(attributes)
    .filter(([key]) => !isInternalKey(key))
    .flatMap(([key, values]) =>
      (values ?? []).map((value) => ({ key, value })),
    );

export const groupAttributes = (
  rows: AttributeRow[],
  original: OrgAttributes = {},
): OrgAttributes => {
  const grouped: OrgAttributes = {};

  // Preserve row order; repeated keys become additional array entries.
  for (const { key, value } of rows) {
    if (isInternalKey(key)) continue;
    grouped[key] = [...(grouped[key] ?? []), value];
  }

  // Re-merge the hidden internal keys unchanged.
  for (const [key, values] of Object.entries(original)) {
    if (isInternalKey(key)) grouped[key] = values;
  }

  return grouped;
};

const SettingsAttributes = ({
  hasManageOrganizationRole: hasManageOrganizationRoleProp,
}: SettingsProps) => {
  const { t } = useTranslation();
  const { orgId } = useParams<keyof P2Params>() as P2Params;
  const { realm } = config.env;
  const { hasViewOrganizationRole, hasManageOrganizationRole } = useUser();

  const {
    data: org,
    isLoading: isLoadingOrganization,
    refetch,
  } = useGetOrganizationByIdQuery({
    orgId: orgId!,
    realm,
  });

  const [updateOrg, { isLoading: isUpdating }] = useUpdateOrganizationMutation();

  const rows = useMemo(() => flattenAttributes(org?.attributes), [org]);

  const canView = hasViewOrganizationRole(orgId);
  const canManage = hasManageOrganizationRoleProp ?? hasManageOrganizationRole(orgId);

  if (!canView) return null;

  const onSave = async (updatedRows: AttributeRow[]) => {
    const attributes = groupAttributes(updatedRows, org?.attributes);

    // Spread the full fetched org first so name/displayName/domains/url survive.
    await updateOrg({
      orgId,
      realm,
      organizationRepresentation: { ...org, attributes },
    })
      .unwrap()
      .then(() => {
        P2Toast({ success: true, title: t("attributesSaveSuccess") });
        refetch();
      })
      .catch(() => {
        P2Toast({ error: true, title: t("attributesSaveError") });
      });
  };

  return (
    <div className="space-y-4">
      <div>
        <SectionHeader
          title={t("attributes")}
          description={t("attributesDescription")}
        />
      </div>
      <div className="max-w-xl">
        <AttributesEditor
          defaultRows={rows}
          onSave={onSave}
          readOnly={!canManage}
          isSaving={isUpdating || isLoadingOrganization}
        />
      </div>
    </div>
  );
};

export default SettingsAttributes;
