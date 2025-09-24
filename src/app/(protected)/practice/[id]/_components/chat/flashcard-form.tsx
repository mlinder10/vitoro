import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "@/contexts/session-provider";
import { cn } from "@/lib/utils";
import { GeneratedFlashcard, FlashcardFolder } from "@/types";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { fetchFolders, createFolder, createFlashcard } from "./actions/actions";
import { Button } from "@/components/ui/button";

type FlashcardFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  flashcards: GeneratedFlashcard[];
};

export default function FlashcardForm({
  open,
  setOpen,
  flashcards,
}: FlashcardFormProps) {
  const { id } = useSession();
  const [folders, setFolders] = useState<FlashcardFolder[]>([]);
  const [target, setTarget] = useState<FlashcardFolder | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchFolders(id).then(setFolders);
  }, [id]);

  async function handleCreateFolder() {
    if (!newFolderName.trim()) return;
    if (folders.some((f) => f.name === newFolderName.trim())) return;

    setLoading(true);
    const folder = await createFolder(newFolderName.trim(), id);
    setFolders((prev) => [...prev, folder]);
    setTarget(folder);
    setNewFolderName("");
    setLoading(false);
  }

  async function handleCreateFlashcard() {
    if (!target) return;
    setLoading(true);
    await createFlashcard(target.id, flashcards);
    setLoading(false);
    setOpen(false);
    toast.success(
      `Successfully saved ${flashcards.length} flashcards to ${target.name}`,
      { richColors: true }
    );
  }

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent className="flex flex-col p-0 min-w-full h-full">
        <DialogHeader className="px-4 py-4">
          <DialogTitle>Save Flashcards</DialogTitle>
          <DialogDescription>
            Choose or create a folder to save your flashcards
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 gap-6 grid grid-cols-[1fr_3fr] overflow-y-hidden">
          <div className="flex flex-col flex-1 px-4 border-r">
            <div className="flex gap-2 mb-4">
              <input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="New folder name"
                className="flex-1 px-2 py-1 border rounded-md text-sm"
              />
              <Button onClick={handleCreateFolder} disabled={loading}>
                Create
              </Button>
            </div>

            <div className="flex-1 space-y-2 pb-4 overscroll-y-auto">
              {folders.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setTarget(f)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer",
                    target?.id === f.id
                      ? "border-custom-accent bg-secondary"
                      : "hover:bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "font-black text-muted-foreground",
                      target?.id === f.id && "text-custom-accent"
                    )}
                  >
                    •
                  </span>
                  <span
                    className={cn(
                      target?.id === f.id
                        ? "text-custom-accent"
                        : "text-muted-foreground"
                    )}
                  >
                    {f.name}
                  </span>
                </div>
              ))}
              {folders.length === 0 && (
                <p className="text-muted-foreground text-sm italic">
                  No folders yet
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1 px-4 pb-4 overflow-y-auto">
            <h3 className="mb-2 font-semibold text-sm">Preview</h3>
            <div className="flex-1 space-y-3 p-3 border rounded-md">
              {flashcards.map((c, i) => (
                <div key={i} className="flex flex-col p-2 border rounded-md">
                  <ReactMarkdown>{c.front}</ReactMarkdown>
                  <div className="my-4 bg-border w-full h-px" />
                  <ReactMarkdown>{c.back}</ReactMarkdown>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="accent"
                onClick={handleCreateFlashcard}
                disabled={!target || loading}
              >
                Save to {target?.name ?? "Folder"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
