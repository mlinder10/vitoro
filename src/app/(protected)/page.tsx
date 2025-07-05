import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import { ComponentType } from "react";
import PageTitle from "./_components/page-title";

export default function HomePage() {
  return (
    <div className="h-full">
      <PageTitle text="Welcome to Vitoro!" icon={Home} />
      <section>
        <h2 className="ml-8 font-semibold">Study Materials</h2>
        <div className="flex gap-4 py-4 pl-8 w-full overflow-x-auto snap-x">
          <RowItem
            title="Question Bank"
            description="Prepare for your exams with our carefully curated question bank of MBME-style questions."
            link="/practice"
            icon={ArrowRight}
            cta="Practice"
          />
          <RowItem
            title="Review Questions"
            description="Target your weak areas with your custom review questions."
            link="/review"
            icon={ArrowRight}
            cta="Review"
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
  cta: string;
};

function RowItem({ title, description, link, icon: Icon, cta }: RowItemProps) {
  return (
    <Card className="flex flex-col justify-between w-[256px] min-w-[256px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant="accent-secondary" className="w-full">
          <Link href={link}>
            <span>{cta}</span>
            <Icon />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
