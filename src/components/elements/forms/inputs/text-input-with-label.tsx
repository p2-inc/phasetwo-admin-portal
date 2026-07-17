import { DetailedHTMLProps, FC, InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  slug: string;
  label: string;
  inputArgs?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
};

const FormTextInputWithLabel: FC<Props> = ({
  slug = "",
  label = "",
  inputArgs = {},
}) => {
  return (
    <div className="sm:col-span-3">
      <Label htmlFor={slug}>{label}</Label>
      <div className="mt-1">
        <Input
          type="text"
          name={slug}
          id={slug}
          placeholder="placeholder"
          {...inputArgs}
        />
      </div>
    </div>
  );
};

export default FormTextInputWithLabel;
