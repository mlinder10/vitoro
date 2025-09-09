import GradientTitle from "@/components/gradient-title";
import { Button } from "@/components/ui/button";
import { Session, tryGetSession } from "@/lib/auth";
import Link from "next/link";
import HomeBackground from "./background";
import { Header } from "./header";
import { SECTION_HEIGHT, INNER_WIDTH } from "./constants";

export default async function HomePage() {
  const session = await tryGetSession();

  return (
    <>
      <Header session={session} />
      <main
        style={{ height: SECTION_HEIGHT }}
        className="bg-secondary overflow-y-scroll scroll-smooth"
      >
        <HomeBackground />
        <Hero session={session} />
        <QuestionSection />
        <FeaturesSection />
        <CallToActionSection session={session} />
      </main>
    </>
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
        <p className="z-1 font-bold text-4xl">
          The only <span className="text-custom-accent">AI</span> Board Prep{" "}
          <span className="text-custom-accent">Tutor</span>
        </p>
        <p className="z-1 text-muted-foreground">
          THIS is how board prep should feel
        </p>
        <div className="flex gap-4">
          <Button asChild variant="accent" className="z-1">
            <Link href={session ? "/" : "/register"}>Start learning</Link>
          </Button>
          <Button asChild variant="outline" className="z-1">
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
      <GradientTitle text="HOW?" className="z-1 font-black text-9xl" />
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
          className="z-1 flex flex-col gap-4 bg-tertiary p-6 border rounded-md w-full"
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
          className="z-1 flex flex-col gap-4 bg-tertiary p-6 border rounded-md w-full"
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
        className="z-1 flex flex-col gap-8 bg-tertiary p-6 border rounded-md w-full"
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
    <section className="z-1 relative place-items-center grid bg-background py-24 border-t">
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
