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
      <div className="flex h-full overflow-hidden">
        <SideNav />
        <main className="flex-4 bg-secondary h-full">{children}</main>
      </div>
    </SessionProvider>
  );
}
