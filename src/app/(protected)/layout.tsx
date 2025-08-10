import SessionProvider from "@/contexts/session-provider";
import { tryGetSession } from "@/lib/auth";
import { LOGIN_PATH } from "@/lib/constants";
import { redirect } from "next/navigation";
import SideNav from "./_components/side-nav";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await tryGetSession();
  if (!session) redirect(LOGIN_PATH);

  return (
    <SessionProvider session={session}>
      <div className="fixed inset-0 flex overflow-hidden">
        <SideNav />
        <main className="flex-1 bg-secondary h-full overflow-y-auto min-w-0">{children}</main>
      </div>
    </SessionProvider>
  );
}
