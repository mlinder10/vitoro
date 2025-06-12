import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AuthHeader from "./_components/auth-header";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <>
      <AuthHeader />
      {children}
    </>
  );
}
