import { cn } from "@/lib/utils";
import { FC, ReactElement } from "react";

type Props = {
  leftAreaItems?: ReactElement | ReactElement[];
  rightAreaItems?: ReactElement | ReactElement[];
  collapseOnMobile?: boolean;
  className?: string;
};

const HeaderLayout: FC<Props> = ({
  leftAreaItems,
  rightAreaItems,
  collapseOnMobile,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col space-y-4 px-4 py-4 md:flex-row md:space-y-0 md:px-10 md:py-6",
        className
      )}
    >
      <div
        className={cn("items-center justify-between md:justify-start", {
          flex: !collapseOnMobile,
          "md:flex": collapseOnMobile,
        })}
      >
        {leftAreaItems}
      </div>
      <div className="grow flex-col-reverse items-center justify-end gap-2 md:flex md:flex-row">
        {rightAreaItems}
      </div>
    </div>
  );
};

export default HeaderLayout;
