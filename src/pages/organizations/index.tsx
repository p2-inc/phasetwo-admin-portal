import Button, {
  ButtonIconLeftClasses,
} from "@/components/elements/forms/buttons/button";
import FormTextInputWithIcon from "@/components/elements/forms/inputs/text-input-with-icon";
import MainContentArea from "@/components/layouts/main-content-area";
import SecondaryMainContentMenu from "@/components/navs/secondary-main-content-menu";
import TopHeader from "@/components/navs/top-header";
import Head from "next/head";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { PlusIcon } from "@/components/icons";

export default function Organizations() {
  return (
    <>
      <Head>
        <title>Organizations | Phase Two</title>
      </Head>
      <TopHeader
        header="Organizations"
        badgeVal="2"
        rightAreaItems={
          <>
            <FormTextInputWithIcon
              inputArgs={{ placeholder: "Search Organizations" }}
            />
            <Button isBlackButton>
              <PlusIcon className={ButtonIconLeftClasses} aria-hidden="true" />
              Create Organization
            </Button>
          </>
        }
      />
      <MainContentArea>
        {/* Secondary menu */}
        <SecondaryMainContentMenu>
          <div>Secondary Menu</div>
        </SecondaryMainContentMenu>

        {/* Primary content */}
        <section
          aria-labelledby="primary-heading"
          className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto px-4"
        >
          Main Content
        </section>
      </MainContentArea>
    </>
  );
}
