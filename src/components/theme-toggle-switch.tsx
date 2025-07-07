import { useTheme } from "@/contexts/theme-provider";
import { Button } from "./ui/button";

export default function ThemeToggleSwitch() {
  const { setTheme } = useTheme();

  return (
    <Button
      onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
    >
      <span>Toggle Theme</span>
    </Button>
  );
}
