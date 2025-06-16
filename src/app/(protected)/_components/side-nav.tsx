"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/session-provider";
import { cn } from "@/lib/utils";
import {
  LogOut,
  Menu,
  Notebook,
  Settings,
  ShieldUserIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import AccountIcon from "./account-icon";

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(true);
  const session = useSession();

  return (
    <nav
      className={cn(
        "flex flex-col justify-between p-4 border-r-2 h-full max-w-[320px]",
        isOpen && "flex-1"
      )}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          {isOpen && (
            <Link href="/">
              <h1 className="font-bold text-lg">Vitado</h1>
            </Link>
          )}
          <Button variant="ghost" onClick={() => setIsOpen((prev) => !prev)}>
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {isOpen && (
          <ul>
            <ListLink href="/practice">
              <Notebook size={16} />
              <span>Practice</span>
            </ListLink>
            {session.isAdmin && (
              <ListLink href="/admin">
                <ShieldUserIcon size={16} />
                <span>Admin</span>
              </ListLink>
            )}
            <ListLink href="/account">
              <AccountIcon className="-ml-2" />
              <span>Account</span>
            </ListLink>
          </ul>
        )}
      </div>
      {isOpen && (
        <div className="flex flex-col gap-2">
          <Button variant="outline">
            <Settings />
            <span>Settings</span>
          </Button>
          <Button variant="accent-tertiary">
            <LogOut />
            <span>Logout</span>
          </Button>
        </div>
      )}
    </nav>
  );
}

type ListLinkProps = {
  href: string;
  children: React.ReactNode;
};

function ListLink({ href, children }: ListLinkProps) {
  return (
    <li>
      <Button asChild variant="ghost">
        <Link
          href={href}
          className="flex justify-start items-center gap-2 w-full text-muted-foreground text-sm"
        >
          {children}
        </Link>
      </Button>
    </li>
  );
}
