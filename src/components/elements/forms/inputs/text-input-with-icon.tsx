import { Search } from "lucide-react";
import { DetailedHTMLProps, FC, InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  inputArgs?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  className?: string;
};

const FormTextInputWithIcon: FC<Props> = ({ inputArgs = {}, className }) => {
  return (
    <div className={cn("relative rounded-md", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </div>
      <Input
        type="email"
        name="email"
        id="email"
        className="w-full pl-10"
        placeholder="you@example.com"
        {...inputArgs}
      />
    </div>
  );
};

export default FormTextInputWithIcon;
