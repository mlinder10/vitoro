import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

type SearchbarProps = Omit<React.ComponentProps<"input">, "className"> & {
  containerClassName?: string;
  inputClassName?: string;
  iconClassName?: string;
};

export default function Searchbar({
  containerClassName,
  inputClassName,
  iconClassName,
  ...props
}: SearchbarProps) {
  return (
    <div className={cn(containerClassName, "relative")}>
      <Input {...props} className={cn(inputClassName, "ml-8")} />
      <Search
        className={cn(
          iconClassName,
          "absolute left-2 top-1/2 -translate-y-1/2"
        )}
      />
    </div>
  );
}
