import { cn } from "@/lib/utils";
import { FC } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ViewLayoutOptions } from "../forms/switches/view-switch";
import { config } from "@/config";
import { OrganizationRepresentation } from "@/store/apis/orgs";
import useUser from "@/components/utils/useUser";
import { useTranslation } from "react-i18next";
const { features: featureFlags } = config.env;

type Props = {
  children: React.ReactNode;
  viewType: ViewLayoutOptions;
  org: OrganizationRepresentation;
};

const Title = ({ children }: { children: React.ReactNode }) => (
  <div className="font-semibold text-foreground">{children}</div>
);
const SubTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="text-[14px] text-muted-foreground">{children}</div>
);

const InnerItem = ({
  children,
  title,
  subTitle,
  viewType,
  isViewCard,
}: {
  children: React.ReactNode;
  title?: string;
  subTitle?: string;
  viewType: ViewLayoutOptions;
  isViewCard?: boolean;
}) => {
  return (
    <div className="relative h-full">
      <div className="relative z-20 h-full">
        <Card
          className={cn(
            "h-full shadow-none",
            "group-hover:border-primary group-hover:bg-card",
            {
              "flex-col gap-5 rounded-md border bg-muted px-10 py-9":
                viewType === ViewLayoutOptions.GRID,
              "flex-row justify-between gap-0 rounded-none border-0 bg-transparent px-5 py-4":
                viewType === ViewLayoutOptions.LIST,
              "border-border": viewType === ViewLayoutOptions.GRID && isViewCard,
              "border-primary":
                viewType === ViewLayoutOptions.GRID && !isViewCard,
            }
          )}
        >
          <div>
            <Title>{title}</Title>
            <SubTitle>{subTitle}</SubTitle>
          </div>
          <div className="flex flex-row flex-wrap gap-4">{children}</div>
        </Card>
      </div>
      {viewType === ViewLayoutOptions.GRID && (
        <div
          className={cn(
            "absolute inset-x-3 bottom-0 z-10 h-1/2 rounded-full bg-card opacity-0",
            "transition-opacity duration-200",
            "group-hover:opacity-100",
            "drop-shadow-btn-light group-active:hidden"
          )}
        ></div>
      )}
    </div>
  );
};

const OrganizationItem: FC<Props> = ({ children, org, viewType }) => {
  const { t } = useTranslation();
  let { displayName: title, name: subTitle } = org;
  if (!title) {
    title = subTitle;
  }
  const link = `/organizations/${org.id}/details`;
  const { hasViewOrganizationRole: hasViewOrganizationRoleCheck } = useUser();
  const hasViewOrganizationRole = hasViewOrganizationRoleCheck(org.id);

  const ViewCard = () => (
    <div
      className={cn(
        "block",
        "focus:outline-hidden focus:ring-1 focus:ring-neutral-50 focus:ring-offset-1",
        "hover:cursor-not-allowed",
        {
          "md:pb-3": viewType === ViewLayoutOptions.GRID,
        }
      )}
      title={t("insufficientPermissionsToViewOrganization")}
    >
      <InnerItem
        title={title}
        subTitle={subTitle}
        viewType={viewType}
        isViewCard
      >
        {children}
      </InnerItem>
    </div>
  );

  const LinkCard = () => (
    <Link
      to={link}
      className={cn("group block", "focus:outline-hidden focus:ring-0", {
        "md:pb-3": viewType === ViewLayoutOptions.GRID,
      })}
    >
      <InnerItem title={title} subTitle={subTitle} viewType={viewType}>
        {children}
      </InnerItem>
    </Link>
  );

  if (hasViewOrganizationRole && featureFlags.orgDetailsEnabled) {
    return <LinkCard />;
  } else {
    return <ViewCard />;
  }
};

export default OrganizationItem;
