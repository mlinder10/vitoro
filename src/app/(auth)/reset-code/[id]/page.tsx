import db from "@/db/db";
import { notFound } from "next/navigation";
import PageContent from "./_components/page-content";

export default async function ResetCodePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const passwordReset = await db.resetPassword.findUnique({ where: { id } });
  if (!passwordReset) return notFound();

  return <PageContent id={id} />;
}
