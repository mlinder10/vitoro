import { ReactNode } from "react";
import AdminHeader from "./_components/admin-header";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SessionProvider from "@/contexts/session-provider";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getSession();
  if (!session) redirect("/");
  if (!session.isAdmin) redirect("/login");

  return (
    <SessionProvider session={session}>
      <AdminHeader />
      {children}
    </SessionProvider>
  );
}
