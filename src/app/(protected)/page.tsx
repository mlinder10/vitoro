import { Home, NotebookText, Target } from "lucide-react";
import Link from "next/link";
import { ComponentType } from "react";
import PageTitle from "./_components/page-title";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="h-full">
      <PageTitle text="Welcome to Vitoro!" icon={Home} />
      <section>
        <h2 className="ml-8 font-semibold">Study Materials</h2>
        <div className="flex gap-4 py-4 pl-8 w-full overflow-x-auto snap-x">
          <RowItem
            icon={Target}
            title="Question Bank"
            description="Prepare for your exams with our carefully curated question bank of MBME-style questions."
            link="/practice"
          />
          <RowItem
            icon={NotebookText}
            title="Review Questions"
            description="Target your weak areas with your custom review questions."
            link="/review"
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
          "hover:ring-custom-accent-secondary hover:ring-2"
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
