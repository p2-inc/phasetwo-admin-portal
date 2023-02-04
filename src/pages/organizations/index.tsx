import MainContentArea from "@/components/layouts/main-content-area";
import SecondaryMainContentMenu from "@/components/navs/secondary-main-content-menu";
import TopHeader from "@/components/navs/top-header";
import Head from "next/head";

export default function Organizations() {
  return (
    <>
      <Head>
        <title>Organizations | Phase Two</title>
      </Head>
      <TopHeader header="Organizations" badgeVal="2" />
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
