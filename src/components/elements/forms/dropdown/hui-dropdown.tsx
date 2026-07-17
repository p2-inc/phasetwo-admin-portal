import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DDItem = {
  id: string;
  name: string;
  disabled?: boolean;
};

type Props = {
  name: string;
  items: DDItem[];
  selectedItem: DDItem | undefined;
  onChange: (item: DDItem) => void;
  listBoxProps?: any;
};

const DropDown: React.FC<Props> = ({
  items,
  selectedItem,
  onChange,
  name,
  listBoxProps = {},
}) => {
  const handleValueChange = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      onChange(item);
    }
  };

  return (
    <Select
      value={selectedItem?.id ?? ""}
      onValueChange={handleValueChange}
      name={name}
      {...listBoxProps}
    >
      <SelectTrigger className="mt-1 w-full">
        <SelectValue placeholder={selectedItem?.name} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.id} value={item.id} disabled={item.disabled}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DropDown;
