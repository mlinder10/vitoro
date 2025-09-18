import GradientTitle from "@/components/gradient-title";
import { Button } from "@/components/ui/button";
import { Session, tryGetSession } from "@/lib/auth";
import Link from "next/link";
import HomeBackground from "./background";
import { Header } from "./header";
import { HEADER_HEIGHT, INNER_WIDTH } from "./constants";
import VitoAnimation from "@/components/icon/vito-animation";

export default async function HomePage() {
  const session = await tryGetSession();

  return (
    <>
      <Header session={session} />
      <main className="bg-secondary h-full overflow-y-auto scroll-smooth">
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
    <section id="hero" className="z-10 relative place-items-center grid h-full">
      <div
        className="flex flex-col items-center gap-6"
        style={{ paddingTop: HEADER_HEIGHT }}
      >
        {/* Vito Animation */}
        <VitoAnimation width={250} height={172} className="z-1 mb-2" />
        <h1 className="z-1 font-bold text-4xl text-center">
          Your <span className="text-custom-accent">Personal</span> Board Prep{" "}
          <span className="text-custom-accent">Tutor</span>
        </h1>
        <div className="z-1 space-y-1 max-w-lg text-muted-foreground text-center">
          <p>Built with the help of a 273 Step 2 Scorer</p>
          <p>Gain the confidence you deserve</p>
        </div>
        <div className="flex gap-4 mt-2">
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
    <section className="z-10 relative place-items-center grid h-full">
      <GradientTitle text="HOW?" className="z-1 font-black text-9xl" />
    </section>
  );
}

function FeaturesSection() {
  return (
    <section
      id="features"
      className="z-10 relative flex flex-col justify-center items-center gap-8 h-full"
    >
      <h2 className="mb-4 font-bold text-white text-4xl text-center">
        See for yourself...
      </h2>
      <div className="flex justify-center px-8 w-full">
        <div
          style={{ maxWidth: INNER_WIDTH * 0.8 }}
          className="flex justify-center w-full"
        >
          <video
            className="z-1 shadow-2xl border border-border rounded-lg w-full max-w-4xl h-auto"
            controls
            preload="metadata"
            style={{
              maxHeight: "60vh",
              aspectRatio: "16/9",
            }}
          >
            <source src="/Demo_Clip.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </section>
  );
}

function CallToActionSection({ session }: { session: Session | null }) {
  return (
    <section className="z-10 relative place-items-center grid bg-background py-24 border-t">
      <div
        style={{ maxWidth: INNER_WIDTH * 0.4 }}
        className="flex flex-col items-center gap-8"
      >
        <p className="font-bold text-4xl">
          Ready to <span className="text-custom-accent">Excel</span>?
        </p>
        <p className="text-muted-foreground text-center">
          If the &quot;tried and true&quot; isn&apos;t working for you,
          it&apos;s time to try something new.
        </p>
        <Button asChild variant="accent">
          <Link href={session ? "/" : "/register"}>Start your preparation</Link>
        </Button>
      </div>
    </section>
  );
}
