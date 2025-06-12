import SessionProvider from "@/contexts/session-provider";
import { getSession } from "@/lib/auth";
import { LOGIN_PATH } from "@/lib/constants";
import { redirect } from "next/navigation";
import Header from "./_components/header";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect(LOGIN_PATH);

  return (
    <SessionProvider session={session}>
      <Header />
      {children}
    </SessionProvider>
  );
}
