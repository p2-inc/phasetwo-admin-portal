import { useEffect, useState } from "react";
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
import Dropdown from "components/elements/forms/dropdown/hui-dropdown";

const { realm, supportedLocales } = config.env;
const localeOptions = Object.keys(supportedLocales).map((key) => ({
  id: key,
  name: supportedLocales[key],
}));

const Internationalization = () => {
  const { t } = useTranslation();
  const { data: account, isLoading: isLoadingAccount } = useGetAccountQuery({
    userProfileMetadata: true,
    realm,
  });

  const [selectedLocale, setSelectedLocale] = useState(localeOptions[0]);

  const [updateAccount, { isLoading: isUpdatingAccount }] =
    useUpdateAccountMutation();

  const onSubmit = async (e) => {
    e.preventDefault();

    // const updatedAccount = {
    //   ...account,
    //   ...formData,
    // };
    // updateAccount({
    //   accountRepresentation: updatedAccount,
    //   realm,
    // })
    //   .unwrap()
    //   .then(() => {
    //     P2Toast({
    //       success: true,
    //       title: `Locale updated successfully.`,
    //     });
    //   })
    //   .catch((err) => {
    //     return P2Toast({
    //       error: true,
    //       title: `Error during Locale update. ${err.data.error}`,
    //     });
    //   });
  };

  return (
    <>
      <div className="mb-6 mt-12">
        <SectionHeader
          title="Localization"
          description="Manage your user profile information."
        />
      </div>
      <form className="mb-6 max-w-xl space-y-4" onSubmit={onSubmit}>
        <>
          <Dropdown
            items={localeOptions}
            selectedItem={selectedLocale}
            name="locale"
            onChange={setSelectedLocale}
          />

          <div className="space-x-2">
            <Button
              isBlackButton
              type="submit"
              disabled={isUpdatingAccount || isLoadingAccount}
            >
              Update Locale
            </Button>
            <Button
              type="button"
              onClick={
                () => null
                // reset({
                //   email: account?.username,
                //   firstName: account?.firstName,
                //   lastName: account?.lastName,
                // })
              }
              disabled={isUpdatingAccount}
            >
              Reset
            </Button>
          </div>
        </>
      </form>
    </>
  );
};

export default Internationalization;
