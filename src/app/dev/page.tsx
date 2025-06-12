import { ParsedQuestion } from "@/lib/types";
import QuestionView from "../(protected)/practice/_components/question-view";

const QUESTION: ParsedQuestion = {
  id: "",
  createdAt: new Date(),
  creatorId: "",

  question: "What is the best programming language",
  answer: "c",
  choices: {
    a: "Java",
    b: "Python",
    c: "Swift",
    d: "TypeScript",
    e: "C#",
  },
  explanations: {
    a: "Too much boilerplate",
    b: "No type safety",
    c: "Just perfect...",
    d: "Missing some type safety (linting issues)",
    e: "Strange gaming language...",
  },
  nbmeStyleNotes: [],
  sources: [],
  difficulty: "easy",

  topic: "",
  concept: "",
  type: "",
};

export default function DevPage() {
  return <QuestionView question={QUESTION} />;
}
