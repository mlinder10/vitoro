import { Button } from "@/components/ui/button";

type ActionButtonsProps = {
  saveDisabled?: boolean;
  discardDisabled?: boolean;
  onSave: () => Promise<void>;
  onDiscard: () => void;
};

export default function ActionsButtons({
  onSave,
  onDiscard,
}: ActionButtonsProps) {
  return (
    <div className="right-8 bottom-8 fixed flex gap-4">
      <Button variant="accent" onClick={onSave}>
        <span>Save</span>
      </Button>
      <Button variant="destructive" onClick={onDiscard}>
        <span>Discard</span>
      </Button>
    </div>
  );
}
