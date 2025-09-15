type TaskPromptProps = {
  label: string;
  onClick: () => void;
};

export default function TaskPrompt({ label, onClick }: TaskPromptProps) {
  return (
    <div
      className="bg-muted hover:bg-muted/50 py-2 rounded-md w-[160px] text-center transition cursor-pointer"
      onClick={onClick}
    >
      {label}
    </div>
  );
}
