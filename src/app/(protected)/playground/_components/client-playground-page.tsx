"use client";

import { Button } from "@/components/ui/button";
import { NBMEQuestion, QuestionChoice } from "@/types";
import { SYSTEMS, SystemsMap } from "@/types/systems";
import { Calculator, Clipboard, Menu } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlaygroundQuestionCard from "@/app/(protected)/playground/_components/playground-question-card";
import PlaygroundChatCard from "@/app/(protected)/playground/_components/playground-chat-card";
import PlaygroundNavigator from "@/app/(protected)/playground/_components/playground-navigator";

// Import the test questions directly
import testQuestionsData from "../../_components/test-questions.json";

// Type for the JSON structure
type TestQuestion = {
  topic: string;
  concept_tested: string;
  question: string;
  lab_values: Array<{
    analyte: string;
    value: number | null;
    unit: string | null;
    qual: string | null;
    panel: string;
  }>;
  choices: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  correct_answer: string;
  explanation: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  systems: string[];
  category: string[];
  Competency: string;
};

// Transform the JSON data to match NBMEQuestion type
const transformedQuestions: NBMEQuestion[] = (testQuestionsData as TestQuestion[]).map((q, index) => ({
  id: `test-${index}`,
  createdAt: new Date(),
  systems: q.systems.filter((s): s is keyof SystemsMap => 
    SYSTEMS.map(sys => sys.name).includes(s)
  ) as any, // Type assertion needed due to complex SystemsMap type
  categories: q.category || [],
  topic: q.topic,
  competency: q.Competency || "",
  concept: q.concept_tested || "",
  question: q.question,
  answer: q.correct_answer.toLowerCase() as QuestionChoice,
  choices: {
    a: q.choices.A,
    b: q.choices.B,
    c: q.choices.C,
    d: q.choices.D,
    e: q.choices.E,
  },
  explanations: {
    a: q.explanation.A,
    b: q.explanation.B,
    c: q.explanation.C,
    d: q.explanation.D,
    e: q.explanation.E,
  },
  labValues: q.lab_values.map(lab => ({
    analyte: lab.analyte,
    value: lab.value || 0,
    unit: lab.unit || "",
    qual: lab.qual,
    panel: lab.panel,
  })),
  difficulty: "Moderate" as const,
  yield: "Medium" as const,
  rating: "Pass" as const,
  step: "Step 1" as const,
}));

export default function ClientPlaygroundPage() {
  const [answers, setAnswers] = useState<(QuestionChoice | null)[]>(
    new Array(transformedQuestions.length).fill(null)
  );
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeQuestion = transformedQuestions[activeIndex];

  function handleBack() {
    if (activeIndex < 1) return;
    setActiveIndex((prev) => prev - 1);
  }

  function handleNext() {
    if (activeIndex >= transformedQuestions.length - 1) return;
    setActiveIndex((prev) => prev + 1);
  }

  function handleSubmit(choice: QuestionChoice) {
    const copy = [...answers];
    copy[activeIndex] = choice;
    setAnswers(copy);
  }

  return (
    <div className="flex flex-col h-full">
      <Header onToggleSidebar={() => setShowSidebar((prev) => !prev)} />
      <div className="flex flex-1 h-full overflow-hidden">
        <AnimatePresence initial={false}>
          {showSidebar && (
            <motion.div
              key="sidebar"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="h-full"
            >
              <PlaygroundNavigator
                questions={transformedQuestions}
                answers={answers}
                activeQuestion={activeQuestion}
                onSelect={(_: NBMEQuestion, i: number) => setActiveIndex(i)}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex flex-1 gap-8 p-8 h-full">
          <PlaygroundQuestionCard
            question={activeQuestion}
            answers={answers}
            index={activeIndex}
            totalQuestions={transformedQuestions.length}
            onBack={handleBack}
            onNext={handleNext}
            onSubmit={handleSubmit}
          />
          {answers[activeIndex] !== null && (
            <PlaygroundChatCard
              question={activeQuestion}
              choice={answers[activeIndex]}
            />
          )}
        </div>
      </div>
    </div>
  );
}

type HeaderProps = {
  onToggleSidebar: () => void;
};

function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="flex justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onToggleSidebar}>
          <Menu />
        </Button>
        <h1 className="font-semibold text-lg">AI Playground</h1>
      </div>
      <div className="flex gap-4">
        <Button variant="outline">
          <Calculator />
          <span>Calculator</span>
        </Button>
        <Button variant="outline">
          <Clipboard />
          <span>Lab Values</span>
        </Button>
      </div>
    </header>
  );
}
