import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { BasicFormClasses } from "./text-input";
import cs from "classnames";

const FormTextInputWithIcon = () => {
  return (
    <div className="relative rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon
          className="h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </div>
      <input
        type="email"
        name="email"
        id="email"
        className={cs(BasicFormClasses, "pl-10")}
        placeholder="you@example.com"
      />
    </div>
  );
};

export default FormTextInputWithIcon;
