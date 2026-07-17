import { cn } from "@/lib/utils";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const firstThClasses =
  "whitespace-normal py-3.5 pl-4 pr-3 text-left font-semibold text-foreground sm:pl-6";
export const thClasses =
  "whitespace-normal px-3 py-3.5 text-left font-semibold text-foreground";
export const firstTdClasses =
  "whitespace-normal py-4 pl-4 pr-3 font-medium text-foreground sm:pl-6";
export const tdClasses = "whitespace-normal px-3 py-4";

export type TableColumns = {
  key: string;
  data: string | React.ReactElement;
  columnClasses?: string;
}[];

export type TableRows = {
  [key: string]: any;
}[];

type Props = {
  columns: TableColumns;
  rows: TableRows;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
};

const loadingState = (columns: TableColumns) => {
  return (
    <div className="overflow-auto rounded-md border border-border">
      <UITable className="min-w-full bg-muted text-sm font-medium">
        <TableHeader>
          <TableRow>
            {columns.map((c, i) => (
              <TableHead className="p-4" key={i}>
                <Skeleton className="h-4 w-1/4" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {columns.map((c, i) => (
              <TableCell className="p-4" key={i}>
                <Skeleton className="h-4 w-1/2" />
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </UITable>
    </div>
  );
};

const Table: React.FC<Props> = ({ columns, rows, isLoading, emptyState }) => {
  if (isLoading) {
    return loadingState(columns);
  }
  if (rows.length === 0 && emptyState) {
    return (
      <div className="rounded-md border border-border bg-muted p-4 text-foreground">
        {emptyState}
      </div>
    );
  }
  return (
    <div className="overflow-auto rounded-md border border-border md:overflow-visible">
      <UITable className="min-w-full rounded-md bg-muted text-sm font-medium text-foreground">
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead
                className={cn(index === 0 ? firstThClasses : thClasses)}
                key={column.key}
              >
                {column.data}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column, index) => (
                <TableCell
                  className={cn(
                    index === 0 ? firstTdClasses : tdClasses,
                    column.columnClasses
                  )}
                  key={column.key}
                >
                  {row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </UITable>
    </div>
  );
};

export default Table;
