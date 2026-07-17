import React from "react";
import { cn } from "@/lib/utils";

const MainContentArea: React.FC<{
  children: React.ReactElement | React.ReactElement[];
  className?: string;
}> = ({ children, className }) => (
  <div className={cn("flex grow pb-4", className)}>{children}</div>
);

export default MainContentArea;
