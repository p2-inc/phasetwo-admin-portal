import { User } from "lucide-react";

export const LoadingIcon = (
  <div>
    <div className="relative h-12 w-12 overflow-hidden rounded-md">
      <div className="absolute -inset-10 z-10 bg-linear-to-r from-primary/20 to-primary"></div>
      <div className="absolute inset-[2px] z-20 flex items-center justify-center rounded-sm bg-card text-card-foreground">
        <User />
      </div>
    </div>
  </div>
);
