import { useEffect } from "react";
import Button from "components/elements/forms/buttons/button";
import SectionHeader from "components/navs/section-header";
import { config } from "config";
import {
  useGetAccountQuery,
  useUpdateAccountMutation,
} from "store/apis/profile";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import RHFFormTextInputWithLabel from "components/elements/forms/inputs/rhf-text-input-with-label";
import P2Toast from "components/utils/toast";

const ProfileData = () => {
  const { t } = useTranslation();
  const { features: featureFlags, realm } = config.env;
  const { data: account, isLoading: isLoadingAccount } = useGetAccountQuery({
    userProfileMetadata: true,
    realm,
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
  }, [account, setValue]);

  const onSubmit = async (formData) => {
    const updatedAccount = {
      ...account,
      ...formData,
    };

    updateAccount({
      accountRepresentation: updatedAccount,
      realm,
    })
      .unwrap()
      .then(() => {
        P2Toast({
          success: true,
          title: `Profile updated successfully.`,
        });
      })
      .catch((err) => {
        return P2Toast({
          error: true,
          title: `Error during Profile update. ${err.data.error}`,
        });
      });
  };
  return (
    <>
      <div className="mb-12">
        <SectionHeader
          title="Personal information"
          description="Manage your user profile information."
        />
      </div>
      <form className="max-w-xl space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <>
          {!featureFlags.registrationEmailAsUsername && (
            <RHFFormTextInputWithLabel
              slug="username"
              label={t("username")}
              register={register}
              registerArgs={{
                required: true,
                pattern: /\S+@\S+\.\S+/,
              }}
              inputArgs={{
                disabled: isLoadingAccount || !featureFlags.editUsernameAllowed,
                placeholder: "you",
                type: "username",
              }}
              error={errors.username}
            />
          )}
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
            inputArgs={{
              disabled: isLoadingAccount,
              placeholder: "First name",
            }}
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
        </>
      </form>
    </>
  );
};

export default ProfileData;
