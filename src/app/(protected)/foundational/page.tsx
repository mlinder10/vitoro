import GradientTitle from "@/components/gradient-title";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FoundationalLandingPage() {
  return (
    <div className="flex flex-col items-center gap-8 p-8 h-full">
      <GradientTitle text="Foundational" className="font-bold text-4xl" />
      <div className="flex gap-4">
        <Button asChild variant="accent">
          <Link href="/foundational/new">Start New Session</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/foundational/previous">Continue Previous Session</Link>
        </Button>
      </div>
    </div>
  );
}
