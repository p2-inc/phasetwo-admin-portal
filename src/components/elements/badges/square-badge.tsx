import { FC } from "react";
import cs from "classnames";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const SquareBadge: FC<Props> = ({ children, className }) => {
  return (
    <span
      className={cs(
        "rounded border border-secondary-900 px-1 py-px font-mono text-xs font-medium",
        "dark:border-primary-500 dark:text-zinc-200",
        className
      )}
    >
      {children}
    </span>
  );
};

export default SquareBadge;
