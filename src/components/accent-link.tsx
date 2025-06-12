import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";

type AccentLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  accent?: "primary" | "secondary" | "tertiary";
};

export default function AccentLink({
  href,
  children,
  className = "",
  accent = "primary",
}: AccentLinkProps) {
  function getColor() {
    switch (accent) {
      case "primary":
        return "text-custom-accent hover:text-custom-accent-dark focus:text-custom-accent-dark";
      case "secondary":
        return "text-custom-accent-secondary hover:text-custom-accent-secondary-dark focus:text-custom-accent-secondary-dark";
      case "tertiary":
        return "text-custom-accent-tertiary hover:text-custom-accent-tertiary-dark focus:text-custom-accent-tertiary-dark";
    }
  }

  return (
    <Link href={href} className={cn(className, getColor())}>
      {children}
    </Link>
  );
}
