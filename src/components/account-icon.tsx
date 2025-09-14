import { useSession } from "@/contexts/session-provider";
import { isColorDark, cn, shiftColor } from "@/lib/utils";

type AccountIconProps = {
  size?: number;
  className?: string;
};

export default function AccountIcon({
  size = 24,
  className,
}: AccountIconProps) {
  const { firstName, lastName, color } = useSession();

  const initials =
    firstName.length === 0 || lastName.length === 0
      ? "?"
      : firstName.charAt(0) + lastName.charAt(0);
  const isDark = isColorDark(color);

  return (
    <div
      className={cn("relative border-2 rounded-full aspect-square", className)}
      style={{
        width: `${size}px`,
        backgroundColor: color,
        borderColor: shiftColor(color),
        color: isDark ? "white" : "black",
      }}
    >
      <span className="top-1/2 left-1/2 absolute -translate-x-1/2 -translate-y-1/2">
        {initials}
      </span>
    </div>
  );
}
