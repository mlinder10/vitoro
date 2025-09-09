type ProgressBarProps = {
  current: number;
  total: number;
};

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);
  return (
    <div className="bg-muted rounded-full w-full h-2 overflow-hidden">
      <div
        className="bg-gradient-to-r from-indigo-400 to-purple-600 h-full transition-all"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
