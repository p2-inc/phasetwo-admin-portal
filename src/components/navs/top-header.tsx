import { FC } from "react";
import Badge from "../elements/badge";
import FormTextInput from "../elements/forms/text-input";
import FormTextInputWithIcon from "../elements/forms/text-input-with-icon";

type Props = {
  header: string;
  badgeVal?: string;
};

const TopHeader: FC<Props> = ({ header, badgeVal }) => {
  return (
    <div className="flex px-4 pt-6">
      <div className="flex items-center">
        <h1 className="text-2xl">{header}</h1>
        {badgeVal && (
          <div className="ml-2">
            <Badge>{badgeVal}</Badge>
          </div>
        )}
      </div>
      <div className="flex flex-grow items-center justify-end">
        <FormTextInput />
        <FormTextInputWithIcon />
      </div>
    </div>
  );
};

export default TopHeader;
