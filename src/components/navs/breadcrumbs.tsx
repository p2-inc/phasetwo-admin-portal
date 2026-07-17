import { FC, Fragment } from "react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BreadcrumbItemType = {
  title: string;
  link: string;
};

type Props = {
  items: Array<BreadcrumbItemType>;
  dropLastSlash?: boolean;
};

const Breadcrumbs: FC<Props> = ({ items, dropLastSlash }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList className="gap-x-3 text-base sm:gap-x-3">
        {items.map((item, index) => (
          <Fragment key={item.title}>
            <BreadcrumbItem className="mr-1">
              <BreadcrumbLink asChild>
                <Link
                  to={item.link}
                  className="-mx-3 rounded-lg px-3 py-1 font-medium text-foreground transition hover:bg-muted md:text-xl"
                >
                  {item.title}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {dropLastSlash && index === items.length - 1 ? null : (
              <BreadcrumbSeparator className="mr-1 text-xl text-muted-foreground/50">
                /
              </BreadcrumbSeparator>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
