import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

const MOVE = -20;

type DropdownSelectProps = {
  title: string;
  options: Readonly<string[]>;
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
};

export default function DropdownSelect({
  title,
  options,
  selected,
  setSelected,
}: DropdownSelectProps) {
  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(false);
  const optionsFiltered = options.filter(
    (o) =>
      !selected.includes(o) &&
      (!search || o.toLowerCase().includes(search.toLowerCase()))
  );

  function handleSelect(option: string) {
    setSelected((prev) => [...prev, option]);
    setSearch("");
  }

  function handleRemove(option: string) {
    setSelected((prev) => prev.filter((s) => s !== option));
  }

  function handleRemoveAll() {
    setSelected([]);
  }

  function formatSelected(s: string) {
    if (s.length < 10) return s;
    return `${s.slice(0, 7)}...`;
  }

  return (
    <div className="relative flex flex-col flex-1 gap-2 bg-tertiary p-4 border rounded-md">
      <p className="top-0 left-4 absolute bg-tertiary px-2 py-1 border rounded-md font-semibold text-custom-accent text-sm translate-y-[-50%]">
        {title}
      </p>
      <button
        className="top-0 right-4 absolute bg-tertiary hover:bg-destructive px-2 py-1 border rounded-md text-destructive hover:text-primary text-sm transition-all translate-[-50%]"
        onClick={handleRemoveAll}
      >
        <span>Clear All</span>
      </button>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 my-1 max-h-[48px] overflow-y-auto">
          {selected.map((s) => (
            <div
              key={s}
              className="flex items-center gap-1 bg-secondary p-1 border rounded-md"
            >
              <span className="text-muted-foreground text-sm">
                {formatSelected(s)}
              </span>
              <X
                size={20}
                className="hover:bg-destructive p-1 rounded-sm text-destructive hover:text-primary transition-all cursor-pointer"
                onClick={() => handleRemove(s)}
              />
            </div>
          ))}
        </div>
      )}
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setShowList(true)}
        onBlur={() => setShowList(false)}
        className="p-2 w-full"
      />
      <AnimatePresence mode="wait" initial={false}>
        {showList && (
          <motion.ul
            initial={{ opacity: 0, translateY: MOVE }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: MOVE }}
            className="left-0 absolute flex flex-col bg-secondary border rounded-md w-full max-h-[200px] overflow-y-auto"
            style={{ top: "calc(100%)" }}
          >
            {optionsFiltered.map((o) => (
              <li
                key={o}
                className={cn(o !== o.at(-1) && "border-b hover:bg-tertiary")}
              >
                <button
                  className="p-2 w-full text-sm text-start"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleSelect.bind(null, o)}
                >
                  {o}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
