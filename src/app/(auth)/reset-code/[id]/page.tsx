import { db, passwordResets } from "@/db";
import { notFound } from "next/navigation";
import PageContent from "./_components/page-content";
import { eq } from "drizzle-orm";

export default async function ResetCodePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [reset] = await db
    .select()
    .from(passwordResets)
    .where(eq(passwordResets.id, id));
  if (!reset) return notFound();

  return <PageContent id={id} />;
}
