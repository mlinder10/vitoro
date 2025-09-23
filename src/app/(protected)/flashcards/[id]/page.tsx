import { db, flashcardFolders, flashcards } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import FlashcardFolderClientPage from "./flashcard-folder-client-page";

async function fetchFlashcards(id: string) {
  const [[folder], cards] = await Promise.all([
    db
      .select()
      .from(flashcardFolders)
      .where(eq(flashcardFolders.id, id))
      .limit(1),
    db.select().from(flashcards).where(eq(flashcards.folderId, id)),
  ]);
  if (!folder || !cards?.length) return notFound();
  return { folder, cards };
}

type FlashcardFolderPageProps = {
  params: Promise<{ id: string }>;
};

export default async function FlashcardFolderPage({
  params,
}: FlashcardFolderPageProps) {
  const { id } = await params;
  const { folder, cards } = await fetchFlashcards(id);
  return (
    <FlashcardFolderClientPage folderName={folder.name} flashcards={cards} />
  );
}
