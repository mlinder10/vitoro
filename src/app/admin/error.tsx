"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Custom500() {
  return (
    <main className="place-items-center grid h-page">
      <div className="flex flex-col items-center gap-4">
        <p className="font-sans font-black text-muted-foreground text-2xl">
          500 - Internal Server Error
        </p>
        <p className="font-bold text-lg">It&apos;s not you, it&apos;s us</p>
        <p>We had an issue on our servers. Please try again later.</p>
        <Button asChild variant="accent">
          <Link href="/admin">
            <ArrowLeft />
            <span>Back to dashboard</span>
          </Link>
        </Button>
      </div>
    </main>
  );
}
