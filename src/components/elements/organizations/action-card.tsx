import { FC } from "react";
import { Card } from "@/components/ui/card";

type Props = {
  children: React.ReactNode;
};

export const OACTopRow: FC<Props> = ({ children }) => (
  <div className="flex-wrap gap-4 space-y-3 md:flex md:space-y-1 md:space-x-1">
    {children}
  </div>
);

const OrganizationActionCard: FC<Props> = ({ children }) => {
  return (
    <Card className="h-full justify-between px-6">{children}</Card>
  );
};

export default OrganizationActionCard;
