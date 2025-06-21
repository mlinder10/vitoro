"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/session-provider";
import { cn } from "@/lib/utils";
import {
  Home,
  LogOut,
  Menu,
  Notebook,
  Settings,
  ShieldUserIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { ComponentType, useState } from "react";
import AccountIcon from "./account-icon";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";

export default function SideNav() {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    setIsLoading(true);
    router.replace("/login");
    setIsLoading(false);
  }

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
        <ul>
          <ListLink href="/" icon={Home} label="Home" isOpen={isOpen} />
          <ListLink
            href="/practice"
            icon={Notebook}
            label="Practice"
            isOpen={isOpen}
          />
          {session.isAdmin && (
            <ListLink
              href="/admin"
              icon={ShieldUserIcon}
              label="Admin"
              isOpen={isOpen}
            />
          )}
          <ListLink
            href="/account"
            icon={AccountIcon}
            size={24}
            label="Account"
            isOpen={isOpen}
          />
        </ul>
      </div>
      {isOpen && (
        <div className="flex flex-col gap-2">
          <Button variant="outline" asChild>
            <Link href="/settings">
              <Settings />
              <span>Settings</span>
            </Link>
          </Button>
          <Button
            variant="accent-tertiary"
            onClick={handleLogout}
            disabled={isLoading}
          >
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
  icon: ComponentType<{ size?: number; className?: string }>;
  size?: number;
  label: string;
  isOpen: boolean;
};

function ListLink({
  href,
  icon: Icon,
  size = 16,
  label,
  isOpen,
}: ListLinkProps) {
  return (
    <li>
      <Link
        href={href}
        className="flex justify-start items-center gap-2 hover:bg-secondary focus:bg-secondary px-2 py-2 rounded-md w-full text-muted-foreground text-sm"
      >
        <Icon size={size} />
        {isOpen && <span>{label}</span>}
      </Link>
    </li>
  );
}
