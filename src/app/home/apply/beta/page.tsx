import GradientTitle from "@/components/gradient-title";
import BetaApplicationForm from "@/features/beta-application/form";

export default function BetaApplicationPage() {
  return (
    <main className="flex flex-col gap-4 p-8 h-full">
      <GradientTitle
        text="Beta Application Form"
        className="font-black text-4xl"
      />
      <div className="flex-1 place-items-center grid">
        <BetaApplicationForm />
      </div>
    </main>
  );
}
