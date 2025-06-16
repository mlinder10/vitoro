// import { ParsedQuestion } from "@/types";
// import QuestionView from "../(protected)/practice/_components/question-view";
import SideNav from "../(protected)/_components/side-nav";
import AccountPage from "../(protected)/account/page";

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

export default function DevPage() {
  return (
    <div className="flex h-full overflow-hidden">
      <SideNav />
      <main className="flex-4 bg-secondary h-full overflow-y-auto">
        {/* <QuestionView question={QUESTION} /> */}
        <AccountPage />
      </main>
    </div>
  );
}
