"use client";

import { fetchQuestions } from "@/app/(protected)/practice/actions";
import {
  AnyCategory,
  AnySubcategory,
  NBMEStep,
  QuestionDifficulty,
  QuestionType,
  System,
} from "@/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

// Context Typing --------------------------------------------------------------

const DEFAULT_QUESTION_COUNT = 30;

type QBankSessionType = {
  // State
  isTimed: boolean;
  setIsTimed: Dispatch<SetStateAction<boolean>>;
  step: NBMEStep | undefined;
  setStep: Dispatch<SetStateAction<NBMEStep | undefined>>;
  type: QuestionType | undefined;
  setType: Dispatch<SetStateAction<QuestionType | undefined>>;
  system: System | undefined;
  setSystem: Dispatch<SetStateAction<System | undefined>>;
  category: AnyCategory | undefined;
  setCategory: Dispatch<SetStateAction<AnyCategory | undefined>>;
  subcategory: AnySubcategory | undefined;
  setSubcategory: Dispatch<SetStateAction<AnySubcategory | undefined>>;
  topic: string | undefined;
  setTopic: Dispatch<SetStateAction<string>>;
  difficulty: QuestionDifficulty | undefined;
  setDifficulty: Dispatch<SetStateAction<QuestionDifficulty | undefined>>;
  questionCount: number;
  setQuestionCount: Dispatch<SetStateAction<number>>;
  // Methods
  nextQuestion: () => string | null;
  previousQuestion: () => string | null;
  handleFetchQuestions: (userId: string, filter?: boolean) => Promise<string>;
};

const QBankSessionContext = createContext<QBankSessionType>({
  isTimed: false,
  setIsTimed: () => {},
  step: undefined,
  setStep: () => {},
  type: undefined,
  setType: () => {},
  system: undefined,
  setSystem: () => {},
  category: undefined,
  setCategory: () => {},
  subcategory: undefined,
  setSubcategory: () => {},
  topic: undefined,
  setTopic: () => {},
  difficulty: undefined,
  setDifficulty: () => {},
  questionCount: DEFAULT_QUESTION_COUNT,
  setQuestionCount: () => {},
  nextQuestion: () => null,
  previousQuestion: () => null,
  handleFetchQuestions: async () => "",
});

type QBankSessionProviderProps = {
  children: ReactNode;
};

// Context Provider ------------------------------------------------------------

export default function QBankSessionProvider({
  children,
}: QBankSessionProviderProps) {
  const [isTimed, setIsTimed] = useState(false);
  const [step, setStep] = useState<NBMEStep>();
  const [type, setType] = useState<QuestionType>();
  const [system, setSystem] = useState<System>();
  const [category, setCategory] = useState<AnyCategory>();
  const [subcategory, setSubcategory] = useState<AnySubcategory>();
  const [topic, setTopic] = useState<string>("");
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>();
  const [questionCount, setQuestionCount] = useState(DEFAULT_QUESTION_COUNT);
  const [node, setNode] = useState<QuestionNode | null>(null);

  async function handleFetchQuestions(userId: string, filter = true) {
    const questions = await fetchQuestions(
      userId,
      {
        step: filter ? step : undefined,
        type: filter ? type : undefined,
        system: filter ? system : undefined,
        category: filter ? category : undefined,
        subcategory: filter ? subcategory : undefined,
        topic: filter ? topic : undefined,
        difficulty: filter ? difficulty : undefined,
      },
      questionCount
    );

    let rootNode: QuestionNode | null = null;
    let currNode: QuestionNode | null = null;

    for (const question of questions) {
      if (rootNode === null) {
        rootNode = { questionId: question.id, next: null, previous: null };
        currNode = rootNode;
        continue;
      }
      if (currNode === null) throw new Error("Current node is null");

      const newNode: QuestionNode = {
        questionId: question.id,
        next: null,
        previous: currNode,
      };
      currNode.next = newNode;
      currNode = newNode;
    }

    if (rootNode === null) throw new Error("Root node is null");

    setNode(rootNode);
    return rootNode.questionId;
  }

  return (
    <QBankSessionContext.Provider
      value={{
        isTimed,
        setIsTimed,
        step,
        setStep,
        type,
        setType,
        system,
        setSystem,
        category,
        setCategory,
        subcategory,
        setSubcategory,
        topic,
        setTopic,
        difficulty,
        setDifficulty,
        questionCount,
        setQuestionCount,
        nextQuestion: () => node?.next?.questionId ?? null,
        previousQuestion: () => node?.previous?.questionId ?? null,
        handleFetchQuestions,
      }}
    >
      {children}
    </QBankSessionContext.Provider>
  );
}

export type QuestionFilters = {
  step: NBMEStep | undefined;
  type: QuestionType | undefined;
  system: System | undefined;
  category: AnyCategory | undefined;
  subcategory: AnySubcategory | undefined;
  topic: string | undefined;
  difficulty: QuestionDifficulty | undefined;
};

// Hook --------------------------------------------------------------------

export function useQBankSession() {
  return useContext(QBankSessionContext);
}

// Question Linked List -----------------------------------------------------

type QuestionNode = {
  questionId: string;
  next: QuestionNode | null;
  previous: QuestionNode | null;
};
