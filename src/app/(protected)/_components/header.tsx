"use client";

import { useSession } from "@/contexts/session-provider";
import Link from "next/link";

export default function Header() {
  const session = useSession();

  return (
    <header className="h-header">
      <nav className="flex justify-between items-center px-6 h-full">
        <Link href="/">
          <h1>Vitado</h1>
        </Link>
        <ul>
          {session.isAdmin && (
            <li>
              <Link href="/admin">Admin</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
