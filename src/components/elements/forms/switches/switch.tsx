import { FC } from "react";
import { Switch as UISwitch } from "@/components/ui/switch";

type SwitchProps = {} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Switch: FC<SwitchProps> = ({ children }) => {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <div>{children}</div>
      <UISwitch />
    </label>
  );
};

export default Switch;
