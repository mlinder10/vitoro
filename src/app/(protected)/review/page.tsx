import { getSession } from "@/lib/auth";
import { ReviewQuestion } from "@/types";
import Link from "next/link";
import { ArrowRight, NotebookText } from "lucide-react";
import { trimTo } from "@/lib/utils";
import PageTitle from "../_components/page-title";
import { getQuestions } from "./actions";

export default async function ReviewPage() {
  const { id } = await getSession();
  const { answered, unanswered } = await getQuestions(id);

  return (
    <div className="flex flex-col h-screen">
      <PageTitle text="Review Questions" icon={NotebookText} />
      <div className="flex-1 px-8 overflow-hidden">
        <div className="gap-8 grid grid-cols-1 md:grid-cols-2 h-full">
          <QuestionsList
            title="Unanswered Questions"
            icon="❓"
            questions={unanswered}
          />
          <QuestionsList
            title="Answered Questions"
            icon="✅"
            questions={answered}
          />
        </div>
      </div>
    </div>
  );
}

type QuestionsListProps = {
  title: string;
  icon?: string;
  questions: ReviewQuestion[];
};

function QuestionsList({ title, icon, questions }: QuestionsListProps) {
  return (
    <section className="flex flex-col h-full overflow-hidden">
      <h2 className="flex items-center gap-2 mb-4 font-semibold text-lg">
        {icon && <span>{icon}</span>}
        {title} - {questions.length}
      </h2>
      <div className="flex flex-col gap-4 pr-2 pb-8 overflow-y-auto">
        {questions.length === 0 ? (
          <p className="text-muted-foreground text-sm italic">
            No questions in this section
          </p>
        ) : (
          questions.map((question) => (
            <Link
              href={`/review/${question.id}`}
              key={question.id}
              className="flex items-center gap-2 bg-background hover:shadow p-3 border rounded-md text-muted-foreground text-sm transition"
            >
              <p>{trimTo(question.question, 100)}</p>
              <ArrowRight size={16} />
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
