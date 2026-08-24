import { useId } from "react";
import RoleBadge from "@/components/elements/badges/role-badge";
import SquareBadge from "@/components/elements/badges/square-badge";
import { Switch } from "@/components/ui/switch";

export const SwitchItem = ({
  name,
  isChecked,
  onChange,
  isDisabled,
  roleType,
}: {
  name: string;
  isChecked: boolean;
  onChange: (roleName: string, checked: boolean) => void;
  isDisabled?: boolean;
  roleType: "organization" | "application";
}) => {
  const switchId = useId();

  return (
    <div className="flex items-center justify-between py-2">
      <label htmlFor={switchId} className="mr-4 flex-1">
        <div className="flex items-center justify-between">
          <RoleBadge name={name} />
          <SquareBadge className="ml-2">{roleType.toLowerCase()}</SquareBadge>
        </div>
      </label>
      <Switch
        id={switchId}
        checked={isChecked}
        disabled={isDisabled}
        onCheckedChange={(checked: boolean) => onChange(name, checked)}
      />
    </div>
  );
};
