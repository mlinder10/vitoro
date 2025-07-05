import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ReviewQuestion } from "@/types";
import ReactMarkdown from "react-markdown";

type PageContentProps = {
  question: ReviewQuestion;
};

export default function PageContent({ question }: PageContentProps) {
  return (
    <div className="flex p-8 h-full">
      <section className="flex flex-col flex-1 justify-between bg-background p-4 border rounded-md">
        <ReactMarkdown>{question.question}</ReactMarkdown>
        <div className="space-y-4">
          <Textarea placeholder="Your Answer" className="h-[256px]" />
          <Button variant="accent" className="w-full">
            Submit
          </Button>
        </div>
      </section>
    </div>
  );
}
