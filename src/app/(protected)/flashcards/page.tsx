import { db, flashcardFolders } from "@/db";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

async function getFlashcardFolders(userId: string) {
  return await db
    .select()
    .from(flashcardFolders)
    .where(eq(flashcardFolders.userId, userId));
}

export default async function FlashcardPage() {
  const { id } = await getSession();
  const folders = await getFlashcardFolders(id);

  return folders.map((f) => (
    <div key={f.id}>
      <p>{f.name}</p>
    </div>
  ));
}
