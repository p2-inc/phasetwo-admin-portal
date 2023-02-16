import { apiRealm } from "api/helpers";
import Button from "components/elements/forms/buttons/button";
import MainContentArea from "components/layouts/main-content-area";
import TopHeader from "components/navs/top-header";
import { useParams } from "react-router-dom";
import { useGetOrganizationByIdQuery } from "store/p2-api/p2-api";

export default function OrganizationDetail() {
  let { orgId } = useParams();
  const { data } = useGetOrganizationByIdQuery({
    orgId: orgId!,
    realm: apiRealm,
  });
  console.log("🚀 ~ file: detail.tsx:14 ~ OrganizationDetail ~ data", data);
  return (
    <>
      <TopHeader
        header="Organization Detail"
        rightAreaItems={
          <>
            <Button>Settings</Button>
          </>
        }
      />
      <MainContentArea>
        {/* Primary content */}
        <section
          aria-labelledby="primary-heading"
          className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto px-4"
        >
          <div>{data?.displayName}</div>
          <div>{data?.name}</div>
          <div>{data?.id}</div>
          <div>{data?.url}</div>
        </section>
      </MainContentArea>
    </>
  );
}
