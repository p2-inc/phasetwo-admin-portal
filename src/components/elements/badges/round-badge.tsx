import { FC } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const RoundBadge: FC<Props> = ({ children, className }) => {
  return (
    <Badge
      variant="outline"
      className={cn("border-2 bg-card px-2.5 font-semibold", className)}
    >
      {children}
    </Badge>
  );
};

export default RoundBadge;
