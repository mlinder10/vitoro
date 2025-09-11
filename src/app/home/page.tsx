import GradientTitle from "@/components/gradient-title";
import { Button } from "@/components/ui/button";
import { Session, tryGetSession } from "@/lib/auth";
import Link from "next/link";
import HomeBackground from "./background";
import { Header } from "./header";
import { SECTION_HEIGHT, INNER_WIDTH } from "./constants";
import VitoAnimation from "@/components/vito-animation";

export default async function HomePage() {
  const session = await tryGetSession();

  return (
    <>
      <Header session={session} />
      <main className="bg-secondary">
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
      className="place-items-center grid relative z-10"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Vito Animation */}
        <VitoAnimation width={250} height={172} className="z-1 mb-2" />
        <h1 className="z-1 font-bold text-4xl text-center">
          Your <span className="text-custom-accent">Personal</span> Board Prep{" "}
          <span className="text-custom-accent">Tutor</span>
        </h1>
        <div className="z-1 text-muted-foreground text-center space-y-1 max-w-lg">
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
    <section
      style={{ height: SECTION_HEIGHT }}
      className="place-items-center grid relative z-10"
    >
      <GradientTitle text="HOW?" className="z-1 font-black text-9xl" />
    </section>
  );
}

function FeaturesSection() {
  return (
    <section
      id="features"
      style={{ height: SECTION_HEIGHT }}
      className="flex flex-col justify-center items-center gap-8 relative z-10"
    >
      <h2 className="font-bold text-white text-4xl text-center mb-4">
        See for yourself...
      </h2>
      <div className="flex justify-center w-full px-8">
        <div
          style={{ maxWidth: INNER_WIDTH * 0.8 }}
          className="w-full flex justify-center"
        >
          <video
            className="z-1 w-full max-w-4xl h-auto rounded-lg shadow-2xl border border-border"
            controls
            preload="metadata"
            style={{ 
              maxHeight: "60vh",
              aspectRatio: "16/9"
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
    <section className="relative place-items-center grid bg-background py-24 border-t z-10">
      <div
        style={{ maxWidth: INNER_WIDTH * 0.4 }}
        className="flex flex-col items-center gap-8"
      >
        <p className="font-bold text-4xl">
          Ready to <span className="text-custom-accent">Excel</span>?
        </p>
        <p className="text-muted-foreground text-center">
          If the "tried and true" isn't working for you, it's time to try something new.
        </p>
        <Button asChild variant="accent">
          <Link href={session ? "/" : "/register"}>Start your preparation</Link>
        </Button>
      </div>
    </section>
  );
}
