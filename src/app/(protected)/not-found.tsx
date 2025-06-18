import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Custom404() {
  return (
    <main className="place-items-center grid h-full">
      <div className="flex flex-col items-center gap-4">
        <p className="font-sans font-black text-muted-foreground text-2xl">
          404 - Not Found
        </p>
        <p className="font-semibold">No Study Materials Here</p>
        <Button asChild variant="accent">
          <Link href="/">
            <ArrowLeft />
            <span>Get back to studying</span>
          </Link>
        </Button>
      </div>
    </main>
  );
}
