import { ReactNode } from "react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SessionProvider from "@/contexts/session-provider";
import AdminSideNav from "./_components/admin-side-nav";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getSession();
  if (!session) redirect("/");
  if (!session.isAdmin) redirect("/login");

  return (
    <SessionProvider session={session}>
      <div className="fixed inset-0 flex overflow-hidden">
        <AdminSideNav />
        <main className="flex-1 bg-secondary h-full overflow-y-auto">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
