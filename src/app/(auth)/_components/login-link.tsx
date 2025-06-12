"use client";

import { Button } from "@/components/ui/button";
import { LOGIN_PATH, REGISTER_PATH } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LoginLink() {
  const pathname = usePathname();

  if (pathname === LOGIN_PATH) {
    return (
      <Button asChild variant="accent-tertiary">
        <Link href={REGISTER_PATH}>Register</Link>
      </Button>
    );
  }

  return (
    <Button asChild variant="accent-tertiary">
      <Link href={LOGIN_PATH}>Login</Link>
    </Button>
  );
}
