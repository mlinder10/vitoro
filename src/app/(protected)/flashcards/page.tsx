import { db, flashcardFolders } from "@/db";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import Link from "next/link";
import GradientTitle from "@/components/gradient-title";
import { FolderClosed } from "lucide-react";
import { Button } from "@/components/ui/button";

async function getFlashcardFolders(userId: string) {
  return await db
    .select()
    .from(flashcardFolders)
    .where(eq(flashcardFolders.userId, userId));
}

export default async function FlashcardPage() {
  const { id } = await getSession();
  const folders = await getFlashcardFolders(id);

  return (
    <div className="flex flex-col items-center gap-8 p-8 h-full">
      <GradientTitle text="Flashcards" className="font-bold text-4xl" />
      <div className="flex flex-col flex-1 gap-4 w-full">
        {folders.map((f) => (
          <FolderRow key={f.id} folder={f} />
        ))}
        {folders.length === 0 && <EmptyFlashcardsView />}
      </div>
    </div>
  );
}

// TODO: add delete option
function FolderRow({ folder }: { folder: { id: string; name: string } }) {
  return (
    <Link
      href={`/flashcards/${folder.id}`}
      className="flex justify-between items-center bg-card hover:bg-accent/5 shadow-sm p-6 border border-border rounded-2xl transition"
    >
      <div className="flex items-center gap-4">
        <div className="bg-accent/10 p-3 rounded-full">
          <FolderClosed className="w-6 h-6 text-accent" />
        </div>
        <p className="font-medium text-lg">{folder.name}</p>
      </div>
      <Button variant="outline" size="sm">
        Open
      </Button>
    </Link>
  );
}

function EmptyFlashcardsView() {
  return (
    <div className="flex-1 place-items-center grid">
      <div className="flex flex-col items-center gap-6 bg-card shadow-sm p-10 border border-border rounded-2xl max-w-md text-center">
        <div className="bg-accent/10 p-4 rounded-full">
          <FolderClosed className="w-10 h-10 text-accent" />
        </div>
        <p className="font-semibold text-xl">No flashcard folders yet</p>
        <p className="max-w-sm text-muted-foreground text-sm">
          Create flashcards with Vito to review concepts you&apos;ve learned in
          the Question Bank.
        </p>
      </div>
    </div>
  );
}
