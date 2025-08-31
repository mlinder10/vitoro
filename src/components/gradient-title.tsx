import { cn } from "@/lib/utils";

type GradientTitleProps = {
  text: string;
  className?: string;
};

export default function GradientTitle({ text, className }: GradientTitleProps) {
  return (
    <p
      className={cn(
        "bg-clip-text bg-gradient-to-r from-primary to-custom-accent text-transparent animate-gradient",
        className
      )}
    >
      {text}
    </p>
  );
}
