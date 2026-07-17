import { Skeleton } from "@/components/ui/skeleton";

export const Loader = () => {
  return (
    <div className="flex justify-between space-x-2 py-3">
      <div className="flex space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-4 w-10" />
    </div>
  );
};
