import { useTranslation } from "react-i18next";
import { TableRows } from "./table";
import { Lock } from "lucide-react";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  rows: TableRows;
  isLoading?: boolean;
};

const loading = (
  <div className="space-y-2 p-4">
    <Skeleton className="h-4 w-20" />
    <Skeleton className="h-4 w-40" />
  </div>
);

const MembersTable: React.FC<Props> = ({ rows, isLoading }) => {
  const { t } = useTranslation();

  const disabledInfo = (
    <span className="inline-flex text-sm text-primary" title={t("disabled")}>
      <Lock className="ml-2 h-5 w-5" />
    </span>
  );

  function getNameOrUsername(item: {
    name?: string;
    username?: string;
  }): string {
    return item.name || item.username || "";
  }

  return (
    <div className="rounded-sm border border-border">
      {isLoading && loading}
      {!isLoading && (
        <>
          <div className="divide-y divide-border md:hidden">
            {rows.map((item) => (
              <div className="p-4" key={item["email"]}>
                <div className="text-sm font-semibold text-foreground">
                  {getNameOrUsername(item)}
                </div>
                <div className="flex align-middle text-sm text-muted-foreground">
                  {item["email"]}
                  {item["enabled"] === false && disabledInfo}
                </div>
                <div className="space-y-1 py-2">{item["roles"]}</div>
                <div>{item["action"]}</div>
              </div>
            ))}
          </div>
          <table className="w-full table-auto text-sm sm:hidden md:table">
            <TableBody>
              {rows.map((item) => (
                <TableRow key={item["email"]}>
                  <TableCell className="whitespace-normal px-5 py-4 align-middle">
                    <div className="text-sm font-semibold text-foreground">
                      {getNameOrUsername(item)}
                    </div>
                    <div className="flex align-middle text-sm text-muted-foreground">
                      {item["email"]}
                      {item["enabled"] === false && disabledInfo}
                    </div>
                  </TableCell>
                  <TableCell className="space-x-2 whitespace-normal px-5 py-4 text-right align-middle">
                    {item["roles"]}
                  </TableCell>
                  <TableCell className="whitespace-normal px-1 py-4 text-right align-middle">
                    {item["action"]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </table>
        </>
      )}
    </div>
  );
};

export default MembersTable;
