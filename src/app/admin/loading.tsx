import { Loader2 } from "lucide-react";

export default function CustomLoadingPage() {
  return (
    <main className="place-items-center grid h-page">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin" size={24} />
        <div className="flex gap-0.5 text-muted-foreground">
          <p>Loading</p>
          <p className="animate-jump">.</p>
          <p className="animate-jump delay-75">.</p>
          <p className="animate-jump delay-150">.</p>
        </div>
      </div>
    </main>
  );
}
