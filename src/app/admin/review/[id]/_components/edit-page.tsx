import { ParsedQuestion, ParsedAudit } from "@/types";
import { ReviewPageType } from "./page-wrapper";
import AuditSection from "./audit-section";

type EditPageProps = {
  question: ParsedQuestion;
  audit: ParsedAudit | null;
  setPageType: (pageType: ReviewPageType) => void;
};

export default function EditPage({
  question,
  audit,
  setPageType,
}: EditPageProps) {
  return (
    <main className="flex h-page">
      <QuestionSection />
      <AuditSection
        question={question}
        audit={audit}
        pageType={"edit"}
        setPageType={setPageType}
      />
    </main>
  );
}

function QuestionSection() {
  return (
    <section className="flex-3/4 space-y-4 p-4 overflow-y-auto">
      <p></p>
    </section>
  );
}
