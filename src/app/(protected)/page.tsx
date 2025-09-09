import { Target, Layers } from "lucide-react";
import Link from "next/link";
import { ComponentType } from "react";
import { cn } from "@/lib/utils";
import GradientTitle from "@/components/gradient-title";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 p-8 h-full">
      <GradientTitle text="Vitoro" className="font-bold text-6xl" />
      <section className="flex flex-col gap-4">
        <h2 className="ml-8 font-semibold text-muted-foreground">
          Study Materials
        </h2>
        <div className="flex gap-4">
          <RowItem
            icon={Target}
            title="Question Bank"
            description="Prepare for your exams with our carefully curated question bank of NBME-style questions."
            link="/practice"
          />
          <RowItem
            icon={Layers}
            title="Foundational"
            description="Master core concepts with our foundational question sets."
            link="/foundational"
          />
        </div>
      </section>
    </div>
  );
}

type RowItemProps = {
  title: string;
  description: string;
  link: string;
  icon: ComponentType<{ size?: number; className?: string }>;
};

function RowItem({ title, description, link, icon: Icon }: RowItemProps) {
  return (
    <Link href={link}>
      <div
        className={cn(
          "flex flex-col items-center gap-2 bg-background p-4 border rounded-md max-w-[320px] h-full transition-all",
          "hover:ring-custom-accent hover:ring-2"
        )}
      >
        <Icon size={32} />
        <p className="font-bold text-lg">{title}</p>
        <p className="text-muted-foreground text-sm text-center">
          {description}
        </p>
      </div>
    </Link>
  );
}
