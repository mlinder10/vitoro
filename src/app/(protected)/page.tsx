import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ComponentType } from "react";

// const DUMMY_ITEM = {
//   title: "Lorem ipsum",
//   description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//   link: "/",
//   icon: ArrowRight,
//   cta: "Lorem",
// };

export default function HomePage() {
  return (
    <div className="pt-24 h-full">
      <p className="ml-8 font-bold text-4xl">Welcome to Vitado!</p>
      <section className="py-8">
        <p className="ml-12 font-semibold">Study Materials</p>
        <div className="flex gap-4 py-4 pl-8 w-full overflow-x-auto snap-x">
          <RowItem
            title="Question Bank"
            description="Prepare for your exams with our carefully curated question bank of MBME-style questions."
            link="/practice"
            icon={ArrowRight}
            cta="Practice"
          />
          {/* {[...Array(5)].map((_, index) => (
            <RowItem
              key={index}
              title={DUMMY_ITEM.title}
              description={DUMMY_ITEM.description}
              link={DUMMY_ITEM.link}
              icon={DUMMY_ITEM.icon}
              cta={DUMMY_ITEM.cta}
            />
          ))} */}
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
