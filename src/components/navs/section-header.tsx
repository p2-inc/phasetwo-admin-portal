import { FC, ReactElement } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  variant?: "large" | "medium" | "small";
  icon?: ReactElement;
  rightContent?: ReactElement;
  breadCrumbs?: ReactElement;
};

const SectionHeader: FC<Props> = ({
  title,
  description,
  variant = "large",
  icon,
  rightContent,
  breadCrumbs,
}) => {
  return (
    <div
      className={cn({
        "space-y-1": variant === "large" || variant === "medium",
        "space-y-0": variant === "small",
      })}
    >
      {breadCrumbs && <>{breadCrumbs}</>}
      {(icon || rightContent) && (
        <div className="mb-8 flex items-center justify-between">
          {icon && <>{icon}</>}
          {rightContent && <>{rightContent}</>}
        </div>
      )}

      <h2
        className={cn("font-semibold text-foreground", {
          "text-2xl": variant === "large",
          "text-xl": variant === "medium",
          "text-l": variant === "small",
        })}
      >
        {title}
      </h2>
      {description && (
        <p className="max-w-prose text-base text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
