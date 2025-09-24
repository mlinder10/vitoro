import { DialogHeader } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@radix-ui/react-dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import {
  ArrowLeft,
  Shrink,
  Expand,
  Settings,
  Menu,
  Eye,
  Sparkles,
} from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import ChatSettings from "./chat-settings";

type NavButtonsProps = {
  expanded: boolean;
  fullScreen: boolean;
  tone: string;
  onToggleExpand?: () => void;
  onToggleFullScreen?: () => void;
  onShowPromptOptions: () => void;
  onGenerateFlashcard: () => void;
  setTone: Dispatch<SetStateAction<string>>;
};

export default function NavButtons({
  expanded,
  fullScreen,
  tone,
  onToggleExpand,
  onToggleFullScreen,
  onShowPromptOptions,
  onGenerateFlashcard,
  setTone,
}: NavButtonsProps) {
  return (
    <>
      {/* Resize Buttons */}
      <div className="top-4 left-4 absolute flex gap-2">
        {onToggleExpand && (
          <button
            className="flex justify-center items-center backdrop-blur-md border rounded-full w-[32px] aspect-square cursor-pointer"
            onClick={onToggleExpand}
            aria-label="Toggle chat size"
          >
            <ArrowLeft
              size={16}
              className={cn("transition-all", expanded && "rotate-180")}
            />
          </button>
        )}
        {onToggleFullScreen && (
          <button
            className="flex justify-center items-center backdrop-blur-md border rounded-full w-[32px] aspect-square cursor-pointer"
            onClick={onToggleFullScreen}
            aria-label="Toggle chat fullscreen"
          >
            {fullScreen ? <Shrink size={16} /> : <Expand size={16} />}
          </button>
        )}
      </div>

      {/* Settins Buttons */}
      <div className="top-4 right-4 absolute flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="flex justify-center items-center backdrop-blur-md border rounded-full w-[32px] aspect-square cursor-pointer"
              aria-label="Open chat settings"
            >
              <Settings size={16} />
            </button>
          </DialogTrigger>
          <DialogContent className="min-w-fit">
            <DialogHeader>
              <DialogTitle>Chat Settings</DialogTitle>
            </DialogHeader>
            <ChatSettings tone={tone} setTone={setTone} />
          </DialogContent>
        </Dialog>

        <Select value="none">
          <SelectTrigger
            className="backdrop-blur-md border rounded-2xl"
            aria-label="Open chat options"
          >
            <Menu size={16} className="text-foreground" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1" onMouseDown={onShowPromptOptions}>
              <Eye size={16} />
              <span>Show Prompt Options</span>
            </SelectItem>
            <SelectItem value="2" onMouseDown={onGenerateFlashcard}>
              <Sparkles size={16} />
              <span>Generate Flashcard</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
