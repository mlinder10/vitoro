import { useTheme } from "@/contexts/theme-provider";
// import { Button } from "./ui/button";

import { cn } from "@/lib/utils";
import { MoonStar, SunMedium } from "lucide-react";

const HEIGHT = "h-9";

export default function ThemeToggleSwitch() {
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <div
      className={cn(
        "relative rounded-full bg-secondary aspect-[2/1] w-fit border-2 cursor-pointer transition-colors duration-500",
        "flex items-center",
        HEIGHT,
        theme === "light" ? "bg-orange-300" : "bg-purple-950"
      )}
      onClick={toggleTheme}
    >
      <div className="flex flex-1 justify-center">
        <MoonStar className={cn("text-muted-foreground")} />
      </div>
      <div className="flex flex-1 justify-center">
        <SunMedium className={cn("text-muted-foreground")} />
      </div>
      <div
        className={cn(
          "absolute aspect-square bg-muted rounded-full transition-all top-0 h-full ease-in-out duration-500",
          theme === "light" ? "left-0" : "left-[53%]"
        )}
      />
    </div>
  );
}
