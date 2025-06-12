import { Search } from "lucide-react";
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
    <div
      className={cn(
        containerClassName,
        "relative border-2 h-9 rounded-md focus-within:border-ring w-full"
      )}
    >
      <input
        {...props}
        className={cn(inputClassName, "pl-8 h-full w-full focus:outline-0")}
      />
      <Search
        className={cn(
          iconClassName,
          "absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
        )}
        size={16}
      />
    </div>
  );
}
