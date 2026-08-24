import { FC, useState } from "react";
import { cn } from "@/lib/utils";
import { Grid, List } from "lucide-react";

type ViewSwitchProps = {
  onChange?: (name: ViewLayoutOptions) => void;
};

const ViewSwitchBtn = ({
  children,
  isActive,
  onClick,
}: {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) => (
  <div
    className={cn(
      "flex h-8 w-full cursor-pointer items-center justify-center rounded-sm transition md:w-10",
      {
        "bg-background shadow-sm": isActive,
        "opacity-60 hover:opacity-100": !isActive,
      }
    )}
    onClick={onClick}
  >
    {children}
  </div>
);

export enum ViewLayoutOptions {
  GRID = "grid",
  LIST = "list",
}

const ViewSwitch: FC<ViewSwitchProps> = ({ onChange }) => {
  const [selectValue, setSelectValue] = useState<ViewLayoutOptions>(
    ViewLayoutOptions.GRID
  );

  const handleSelect = (name: ViewLayoutOptions) => {
    setSelectValue(name);
    if (onChange) {
      onChange(name);
    }
  };

  return (
    <div className="flex w-full rounded-md border border-border bg-muted p-[2px] transition md:w-auto">
      <ViewSwitchBtn
        isActive={selectValue === ViewLayoutOptions.GRID}
        onClick={() => handleSelect(ViewLayoutOptions.GRID)}
      >
        <Grid className="h-5 w-5 text-foreground" />
      </ViewSwitchBtn>
      <ViewSwitchBtn
        isActive={selectValue === ViewLayoutOptions.LIST}
        onClick={() => handleSelect(ViewLayoutOptions.LIST)}
      >
        <List className="h-5 w-5 text-foreground" />
      </ViewSwitchBtn>
    </div>
  );
};

export default ViewSwitch;
