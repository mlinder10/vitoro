import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Session } from "@/lib/auth";
import { HEADER_HEIGHT, INNER_WIDTH } from "./constants";

export function Header({ session }: { session: Session | null }) {
  return (
    <header
      style={{ height: HEADER_HEIGHT }}
      className="flex justify-center items-center border-b"
    >
      <nav
        style={{ maxWidth: INNER_WIDTH }}
        className="grid grid-cols-3 w-full"
      >
        <Link href="/home#hero">
          <h1 className="font-bold text-2xl">Vitoro</h1>
        </Link>
        <ul className="flex justify-self-center items-center gap-8 text-muted-foreground">
          <li>
            <Link href="/home#features">Features</Link>
          </li>
          <li>
            <Link href="/home#features">About</Link>
          </li>
          <li>
            <Link href="/home/contact">Contact</Link>
          </li>
        </ul>
        <Button asChild variant="accent" className="justify-self-end w-fit">
          <Link href={session ? "/" : "/register"}>Get Started</Link>
        </Button>
      </nav>
    </header>
  );
}
