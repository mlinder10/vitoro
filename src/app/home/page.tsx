import { Button } from "@/components/ui/button";
import { Session, tryGetSession } from "@/lib/auth";
import Link from "next/link";

const HEADER_HEIGHT = 80;
const INNER_WIDTH = 1000;
const SECTION_HEIGHT = `calc(100vh - ${HEADER_HEIGHT}px)`;

export default async function HomePage() {
  const session = await tryGetSession();

  return (
    <>
      <Header session={session} />
      <main
        style={{ height: SECTION_HEIGHT }}
        className="bg-secondary overflow-y-scroll"
      >
        {/* background image / svgs */}
        <Hero session={session} />
        <QuestionSection />
        <FeaturesSection />
        <CallToActionSection session={session} />
      </main>
    </>
  );
}

function Header({ session }: { session: Session | null }) {
  return (
    <header
      style={{ height: HEADER_HEIGHT }}
      className="flex justify-center items-center border-b"
    >
      <nav
        style={{ maxWidth: INNER_WIDTH }}
        className="grid grid-cols-3 w-full"
      >
        <h1 className="font-bold text-2xl">Vitoro</h1>
        <ul className="flex justify-self-center items-center gap-8 text-muted-foreground">
          <li>
            <Link href="#features">Features</Link>
          </li>
          <li>
            <Link href="#about">About</Link>
          </li>
          <li>
            <Link href="#contact">Contact</Link>
          </li>
        </ul>
        <Button asChild variant="accent" className="justify-self-end w-fit">
          <Link href={session ? "/" : "/register"}>Get Started</Link>
        </Button>
      </nav>
    </header>
  );
}

function Hero({ session }: { session: Session | null }) {
  return (
    <section
      id="hero"
      style={{ height: SECTION_HEIGHT }}
      className="place-items-center grid"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Image */}
        <p className="font-bold text-4xl">
          The only <span className="text-custom-accent">AI</span> Board Prep{" "}
          <span className="text-custom-accent">Tutor</span>
        </p>
        <p className="text-muted-foreground">
          THIS is how board prep should feel
        </p>
        <div className="flex gap-4">
          <Button asChild variant="accent">
            <Link href={session ? "/" : "/register"}>Start learning</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="#features">See how it works</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function QuestionSection() {
  return (
    <section
      style={{ height: SECTION_HEIGHT }}
      className="place-items-center grid"
    >
      <p className="bg-clip-text bg-gradient-to-r from-primary to-custom-accent font-black text-transparent text-9xl animate-gradient">
        HOW?
      </p>
    </section>
  );
}

const CARD_HEIGHT = "240px";

function FeaturesSection() {
  return (
    <section
      id="features"
      style={{ height: SECTION_HEIGHT }}
      className="flex flex-col justify-center items-center gap-16"
    >
      <p className="font-semibold text-4xl">Glad you asked</p>
      <div
        style={{ maxWidth: INNER_WIDTH }}
        className="gap-8 grid grid-cols-2 w-full"
      >
        <div
          className="flex flex-col gap-4 bg-tertiary p-6 border rounded-md w-full"
          style={{ height: CARD_HEIGHT }}
        >
          <span className="place-items-center grid bg-secondary p-2 rounded-md w-fit aspect-square">
            ❤️
          </span>
          <p className="font-semibold text-lg">We know what you need</p>
          <div className="flex flex-col text-muted-foreground text-sm">
            <p>
              Our current team is comprised of 3 current U.S. medical students.
            </p>
            <p>We understand your pain.</p>
            <p>We understand YOU.</p>
          </div>
        </div>
        <div
          className="flex flex-col gap-4 bg-tertiary p-6 border rounded-md w-full"
          style={{ height: CARD_HEIGHT }}
        >
          <span className="place-items-center grid bg-secondary p-2 rounded-md w-fit aspect-square">
            🥼
          </span>
          <p className="font-semibold text-lg">We know how to help</p>
          <div className="flex flex-col text-muted-foreground text-sm">
            <p>Our co-founder, Adam, scored a 273 on Step 2.</p>
            <p>
              He tutors students for free and makes YouTube videos on HY topics
              &#40;for fun&#41;.
            </p>
            <p>
              He trained Vitoro and reviewed our 4000+ board-style questions.
            </p>
          </div>
        </div>
      </div>
      <div
        style={{ maxWidth: INNER_WIDTH * 0.6 }}
        className="flex flex-col gap-8 bg-tertiary p-6 border rounded-md w-full"
      >
        <p className="text-center">
          Vitoro&apos;s adaptive approach helped me identify my weak areas
          quickly and focus my study time where it mattered most. The board exam
          felt managable because I was truly prepared.
        </p>
        <p className="text-muted-foreground text-sm text-center">
          Dr. Sara Chen, Internal Medicine Resident
        </p>
      </div>
    </section>
  );
}

function CallToActionSection({ session }: { session: Session | null }) {
  return (
    <section className="place-items-center grid bg-background py-24 border-t">
      <div
        style={{ maxWidth: INNER_WIDTH * 0.4 }}
        className="flex flex-col items-center gap-8"
      >
        <p className="font-bold text-4xl">
          Ready to <span className="text-custom-accent">Excel</span>?
        </p>
        <p className="text-muted-foreground text-center">
          Join thousands of medical professionals who&apos;ve transformed their
          board preparation with intelligent, adaptive learning.
        </p>
        <Button asChild variant="accent">
          <Link href={session ? "/" : "/register"}>Start your perparation</Link>
        </Button>
      </div>
    </section>
  );
}
