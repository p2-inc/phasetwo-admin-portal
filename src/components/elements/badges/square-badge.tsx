import { FC } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const SquareBadge: FC<Props> = ({ children, className }) => {
  return (
    <span
      className={cn(
        "rounded-sm border border-border px-1 py-px font-mono text-xs font-medium text-foreground",
        className
      )}
    >
      {children}
    </span>
  );
};

export default SquareBadge;
