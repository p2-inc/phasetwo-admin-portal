import { DetailedHTMLProps, FC, InputHTMLAttributes } from "react";
import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  UseFormRegister,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  slug: string;
  label: string;
  register: UseFormRegister<FieldValues>;
  registerArgs?: {
    [key: string]: any;
  };
  inputArgs?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  helpText?: string;
};

const RHFFormTextInputWithLabel: FC<Props> = ({
  slug = "",
  label = "",
  inputArgs = {},
  register,
  registerArgs = {},
  error,
  helpText,
}) => {
  return (
    <div className="sm:col-span-3">
      <Label htmlFor={slug}>{label}</Label>
      <div className="mt-1">
        <Input
          type="text"
          id={slug}
          className="w-full"
          placeholder="placeholder"
          aria-invalid={error ? true : undefined}
          {...register(slug, registerArgs)}
          {...inputArgs}
        />
      </div>
      {error?.message && (
        <p className="mt-2 text-sm text-destructive" id={`${slug}__error`}>
          {String(error.message)}
        </p>
      )}
      {helpText && (
        <p
          className="mt-2 text-sm text-muted-foreground"
          id={`${slug}__help_text`}
        >
          {helpText}
        </p>
      )}
    </div>
  );
};

export default RHFFormTextInputWithLabel;
