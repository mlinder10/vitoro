import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function CustomLoadingPage() {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const interval = setInterval(
      () => setDots((prevDots) => (prevDots + 1) % 4),
      500
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="place-items-center grid h-full">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin" size={24} />
        <p className="text-muted-foreground">Loading{".".repeat(dots)}</p>
      </div>
    </main>
  );
}
