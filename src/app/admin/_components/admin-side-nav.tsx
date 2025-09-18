"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  Home,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  Target,
  User,
} from "lucide-react";
import Link from "next/link";
import { ComponentType, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { unauthenticate } from "@/lib/auth";
import ThemeToggleSwitch from "@/components/theme-toggle-switch";
import { useTheme } from "@/contexts/theme-provider";
import AccountIcon from "@/components/account-icon";

export default function AdminSideNav() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await unauthenticate();
    setIsLoading(true);
    router.replace("/login");
    setIsLoading(false);
  }

  useEffect(() => {
    const sidebarOpen = JSON.parse(
      localStorage.getItem("vitoro-sidebar-open") || "true"
    );
    setIsOpen(sidebarOpen);
  }, []);

  useEffect(() => {
    localStorage.setItem("vitoro-sidebar-open", JSON.stringify(isOpen));
  }, [isOpen]);

  return (
    <nav
      className={cn(
        "flex flex-col justify-between p-4 border-r-2 h-screen transition-all",
        isOpen ? "w-[320px]" : "w-[64px]"
      )}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          {isOpen && (
            <Link href="/">
              <h1 className="font-bold text-lg">Vitoro</h1>
              <p className="text-muted-foreground text-sm">Admin</p>
            </Link>
          )}
          <Button variant="ghost" onClick={() => setIsOpen((prev) => !prev)}>
            {isOpen ? <ChevronLeft /> : <Menu />}
          </Button>
        </div>
        <ul>
          <ListLink
            href="/admin"
            icon={LayoutDashboard}
            label="Home"
            isOpen={isOpen}
          />
          <ListLink
            href="/admin/qbank"
            icon={Target}
            label="QBank"
            isOpen={isOpen}
          />
          <ListLink
            href="/admin/foundational"
            icon={Layers}
            label="Foundational"
            isOpen={isOpen}
          />
          <ListLink
            href="/admin/users"
            icon={User}
            label="Users"
            isOpen={isOpen}
          />
          <ListLink
            href="/admin/prompts"
            icon={MessageCircle}
            label="Prompts"
            isOpen={isOpen}
          />
          <ListLink href="/" icon={Home} label="Main Site" isOpen={isOpen} />
        </ul>
      </div>
      {isOpen && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center px-1">
            <div>
              <p className="font-semibold text-muted-foreground text-xs">
                Theme
              </p>
              <p className="font-semibold">
                {theme === "light" ? "Light" : "Dark"}
              </p>
            </div>
            <ThemeToggleSwitch />
          </div>
          <Button variant="outline" asChild>
            <Link href="/account">
              <AccountIcon />
              <span>Account</span>
            </Link>
          </Button>
          <Button variant="accent" onClick={handleLogout} disabled={isLoading}>
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
  const path = usePathname();

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex justify-start items-center gap-2 px-2 py-2 rounded-md w-full text-muted-foreground text-sm",
          "hover:bg-secondary focus:bg-secondary hover:text-primary",
          path === href && "font-bold text-primary"
        )}
      >
        <Icon size={size} />
        {isOpen && <span>{label}</span>}
      </Link>
    </li>
  );
}
