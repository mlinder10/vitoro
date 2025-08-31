import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";

type AccentLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export default function AccentLink({
  href,
  children,
  className = "",
}: AccentLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        className,
        "text-custom-accent hover:text-custom-accent-dark focus:text-custom-accent-dark"
      )}
    >
      {children}
    </Link>
  );
}
