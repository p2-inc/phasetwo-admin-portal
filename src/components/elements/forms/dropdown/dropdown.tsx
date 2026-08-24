import { FC, ReactElement, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type DropdownItem = {
  content: ReactElement;
  value: string | string[];
  id: number;
};

type DropdownProps = {
  items: Array<DropdownItem>;
  emptyContent?: ReactElement;
  className?: string;
  onChange?: (item: { id: number; value: string | string[] }) => void;
};

const Dropdown: FC<DropdownProps> = ({
  items,
  emptyContent,
  className,
  onChange,
}) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

  const handleSelect = (index: number) => {
    setSelectedItemIndex(index);
    onChange!({ id: items[index].id, value: items[index].value });
  };

  return (
    <Select
      value={selectedItemIndex > -1 ? String(selectedItemIndex) : ""}
      onValueChange={(value) => handleSelect(Number(value))}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={emptyContent} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item, index) => (
          <SelectItem key={index} value={String(index)}>
            {item.content}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Dropdown;
