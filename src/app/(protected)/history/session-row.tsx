import EditableText from "@/components/editable-text";
import { Button } from "@/components/ui/button";
import { capitalize } from "@/lib/utils";
import { QBankSession } from "@/types";
import Link from "next/link";
import { deleteSession, updateSessionName } from "./actions";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MINS_PER_QUESTION } from "@/lib/constants";

type SessionRowProps = {
  session: QBankSession;
  onNameChange: (id: string, name: string) => void;
  onDelete: (id: string) => void;
};

export default function SessionRow({
  session,
  onNameChange,
  onDelete,
}: SessionRowProps) {
  async function handleNameChange(value: string) {
    await updateSessionName(session.id, value);
    onNameChange(session.id, value);
  }

  async function handleDelete() {
    await deleteSession(session.id);
    onDelete(session.id);
  }

  return (
    <div key={session.id} className="bg-tertiary px-8 py-2 border rounded-md">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <EditableText value={session.name} onChange={handleNameChange} />
          <span className="text-muted-foreground text-sm">
            {session.createdAt.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="p-2 border rounded-md w-[64px] text-muted-foreground text-sm text-center">
            {capitalize(session.mode)}
          </span>
          {!session.inProgress ||
          (session.mode === "timed" &&
            isExpired(session.createdAt, session.questionIds.length)) ? (
            <Button variant="accent" className="w-[80px]" asChild>
              <Link href={`/practice/${session.id}/summary`}>View</Link>
            </Button>
          ) : (
            <Button variant="accent-light" className="w-[80px]" asChild>
              <Link href={`/practice/${session.id}`}>Continue</Link>
            </Button>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 />
                <span>Delete</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete {`"${session.name}"`}</DialogTitle>
                <DialogDescription>
                  This action cannot be undone
                </DialogDescription>
              </DialogHeader>
              <div></div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">
                    <span>Cancel</span>
                  </Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleDelete}>
                  <span>Delete</span>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

function isExpired(startedAt: Date, questionCount: number) {
  const now = Date.now();
  const createdAt = new Date(startedAt).getTime();
  const totalTime = questionCount * MINS_PER_QUESTION * 60 * 1000;
  const endTime = createdAt + totalTime;
  const timeLeft = Math.max(0, endTime - now);
  return timeLeft <= 0;
}
