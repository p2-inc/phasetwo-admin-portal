import React, { useEffect, useState } from "react";
import Button from "components/elements/forms/buttons/button";
import FormTextInputWithLabel from "components/elements/forms/inputs/text-input-with-label";
import SectionHeader from "components/navs/section-header";
import { AIACommand } from "services/aia-command";
import { KeycloakService } from "services/keycloak.service";
import { apiRealm } from "store/apis/helpers";
import { useKeycloak } from "@react-keycloak/web";
import { useFeatureFlags } from "store/feature-flags/hooks";
import {
  useGetAccountQuery,
  useUpdateAccountMutation,
} from "store/apis/profile";
import { useTranslation } from "react-i18next";
import GeneralLoader from "components/loaders/general";
import { useForm } from "react-hook-form";
import RHFFormTextInputWithLabel from "components/elements/forms/inputs/rhf-text-input-with-label";
import P2Toast from "components/utils/toast";

interface FormFields {
  readonly username?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email?: string;
  attributes?: { locale?: [string] };
}

interface AccountPageState {
  readonly errors: FormFields;
  readonly formFields: FormFields;
}

const GeneralProfile = () => {
  const { t } = useTranslation();
  const { featureFlags } = useFeatureFlags();
  const { data: account, isLoading: isLoadingAccount } = useGetAccountQuery({
    userProfileMetadata: true,
    realm: apiRealm,
  });

  const [updateAccount, { isLoading: isUpdatingAccount }] =
    useUpdateAccountMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    reset,
  } = useForm();

  useEffect(() => {
    setValue("firstName", account?.firstName);
    setValue("lastName", account?.lastName);
    setValue("email", account?.email);
  }, [account]);

  const onSubmit = async (formData) => {
    const updatedAccount = {
      ...account,
      ...formData,
    };

    updateAccount({
      accountRepresentation: updatedAccount,
      realm: apiRealm,
    })
      .unwrap()
      .then(() => {
        P2Toast({
          success: true,
          title: `Profile updated successfully.`,
        });
      })
      .catch((err) => {
        console.log("🚀 ~ file: general.tsx:97 ~ onSubmit ~ err:", err);

        return P2Toast({
          error: true,
          title: `Error during Profile update. ${err.data.error}`,
        });
      });
  };

  return (
    <div>
      <div className="mb-12">
        <SectionHeader
          title="Personal information"
          description="Manage your user profile information."
        />
      </div>

      <form className="max-w-xl space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {featureFlags.updateEmailFeatureEnabled && (
          <RHFFormTextInputWithLabel
            slug="email"
            label={t("email")}
            register={register}
            registerArgs={{
              required: true,
              pattern: /\S+@\S+\.\S+/,
            }}
            inputArgs={{
              disabled: isLoadingAccount,
              placeholder: "your@email.com",
              type: "email",
            }}
            error={errors.email}
          />
        )}
        <RHFFormTextInputWithLabel
          slug="firstName"
          label="First Name"
          register={register}
          inputArgs={{ disabled: isLoadingAccount, placeholder: "First name" }}
          error={errors.firstName}
        />
        <RHFFormTextInputWithLabel
          slug="lastName"
          label="Last Name"
          register={register}
          inputArgs={{ disabled: isLoadingAccount, placeholder: "Last name" }}
          error={errors.lastName}
        />
        <div className="space-x-2">
          <Button
            isBlackButton
            type="submit"
            disabled={isUpdatingAccount || isLoadingAccount || !isDirty}
          >
            Save
          </Button>
          <Button
            type="button"
            onClick={() =>
              reset({
                email: account?.username,
                firstName: account?.firstName,
                lastName: account?.lastName,
              })
            }
            disabled={isUpdatingAccount || !isDirty}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GeneralProfile;
