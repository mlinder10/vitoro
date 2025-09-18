import { Button } from "@/components/ui/button";

type ActionButtonsProps = {
  saveDisabled?: boolean;
  discardDisabled?: boolean;
  onSave: () => Promise<void>;
  onDiscard: () => void;
};

export default function ActionsButtons({
  saveDisabled,
  discardDisabled,
  onSave,
  onDiscard,
}: ActionButtonsProps) {
  return (
    <div className="right-8 bottom-8 fixed flex gap-4">
      <Button variant="accent" onClick={onSave} disabled={saveDisabled}>
        <span>Save</span>
      </Button>
      <Button
        variant="destructive"
        onClick={onDiscard}
        disabled={discardDisabled}
      >
        <span>Discard</span>
      </Button>
    </div>
  );
}
