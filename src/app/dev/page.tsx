"use client";

// import { ParsedAudit, ParsedQuestion } from "@/types";
// import AdminReviewProvider from "@/contexts/admin-review-provider";
import AdminHeader from "../admin/_components/admin-header";
// import ReviewPageWrapper from "../admin/review/[id]/_components/page-wrapper";
import CreateQuestionPage from "../admin/create/page";

// const QUESTION: ParsedQuestion = {
//   id: "",
//   createdAt: new Date(),
//   creatorId: "",

//   question: "What is the best programming language",
//   answer: "c",
//   choices: {
//     a: "Java",
//     b: "Python",
//     c: "Swift",
//     d: "TypeScript",
//     e: "C#",
//   },
//   explanations: {
//     a: "Too much boilerplate",
//     b: "No type safety",
//     c: "Just perfect...",
//     d: "Missing some type safety (linting issues)",
//     e: "Strange gaming language...",
//   },
//   nbmeStyleNotes: [],
//   sources: [],
//   difficulty: "easy",

//   topic: "",
//   concept: "",
//   type: "",
// };

// const AUDIT: ParsedAudit = {
//   id: "",
//   questionId: "",
//   rating: "Flag for Human Review",
//   suggestions: [],
//   checklist: {
//     1: { pass: true, notes: "" },
//     2: { pass: true, notes: "" },
//     3: { pass: true, notes: "" },
//     4: { pass: true, notes: "" },
//     5: { pass: true, notes: "" },
//     6: { pass: true, notes: "" },
//     7: { pass: true, notes: "" },
//     8: { pass: true, notes: "" },
//     9: { pass: true, notes: "" },
//   },
// };

export default function DevPage() {
  return (
    <>
      <AdminHeader />
      <CreateQuestionPage />
      {/* <AdminReviewProvider question={QUESTION} audit={AUDIT}>
        <ReviewPageWrapper />
      </AdminReviewProvider> */}
    </>
  );
}
