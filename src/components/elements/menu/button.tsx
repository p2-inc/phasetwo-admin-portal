import { cn } from "@/lib/utils";

type Props = {
  active?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
};

const MenuItemButton: React.FC<Props> = ({
  active,
  disabled,
  onClick,
  children,
  ...rest
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground",
        "block w-full px-4 py-2 text-left text-sm",
        {
          "opacity-50 hover:cursor-not-allowed": disabled,
        }
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default MenuItemButton;
