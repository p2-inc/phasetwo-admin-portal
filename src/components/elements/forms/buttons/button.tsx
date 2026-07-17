import { FC } from "react";
import { Button as UIButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonProps = {
  isBlackButton?: boolean;
  isCompact?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const ButtonIconLeftClasses = "-ml-1 mr-2 h-5 w-5 fill-current";

const Button: FC<ButtonProps> = ({
  children,
  isBlackButton,
  isCompact,
  className,
  ...args
}) => {
  return (
    <UIButton
      variant={isBlackButton ? "cta" : "secondary"}
      size={isCompact ? "sm" : "default"}
      className={cn(className)}
      {...args}
    >
      {children}
    </UIButton>
  );
};

export default Button;
