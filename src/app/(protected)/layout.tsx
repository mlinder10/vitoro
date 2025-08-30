import SessionProvider from "@/contexts/session-provider";
import { tryGetSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SideNav from "./_components/side-nav";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await tryGetSession();
  if (!session) redirect("/home");

  return (
    <SessionProvider session={session}>
      <div className="fixed inset-0 flex overflow-hidden">
        <SideNav />
        <main className="flex-1 bg-secondary min-w-0 h-full overflow-y-auto">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
