import { FC } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const RoundedIcon: FC<Props> = ({ children, className }) => {
  return (
    <div className={className}>
      <div className="relative h-12 w-12 overflow-hidden rounded-md">
        <div className="absolute -inset-10 z-10 bg-linear-to-r from-primary/20 to-primary"></div>
        <div className="absolute inset-[2px] z-20 flex items-center justify-center rounded-sm bg-card text-foreground">
          {children}
        </div>
      </div>
    </div>
  );
};

export default RoundedIcon;
