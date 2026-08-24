import React from "react";
import { cn } from "@/lib/utils";

const FixedWidthMainContent: React.FC<{
  children: React.ReactElement | React.ReactElement[];
  className?: string;
}> = ({ children, className }) => (
  <div className={cn("md:flex", className)}>{children}</div>
);

export default FixedWidthMainContent;
