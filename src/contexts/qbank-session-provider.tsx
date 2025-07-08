"use client";

import { redirectToQuestion } from "@/app/(protected)/practice/actions";
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

type QBankSessionType = {
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
  fetchQuestion: (userId: string, filter?: boolean) => Promise<void>;
};

const QBankSessionContext = createContext<QBankSessionType>({
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
  fetchQuestion: async () => {},
});

type QBankSessionProviderProps = {
  children: ReactNode;
};

export default function QBankSessionProvider({
  children,
}: QBankSessionProviderProps) {
  const [step, setStep] = useState<NBMEStep>();
  const [type, setType] = useState<QuestionType>();
  const [system, setSystem] = useState<System>();
  const [category, setCategory] = useState<AnyCategory>();
  const [subcategory, setSubcategory] = useState<AnySubcategory>();
  const [topic, setTopic] = useState<string>("");
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>();

  async function fetchQuestion(userId: string, filter = true) {
    if (!filter) {
      setStep(undefined);
      setType(undefined);
      setSystem(undefined);
      setCategory(undefined);
      setSubcategory(undefined);
      setTopic("");
      setDifficulty(undefined);
      await redirectToQuestion(userId, {
        step: undefined,
        type: undefined,
        system: undefined,
        category: undefined,
        subcategory: undefined,
        topic: undefined,
        difficulty: undefined,
      });
    } else {
      await redirectToQuestion(userId, {
        step,
        type,
        system,
        category,
        subcategory,
        topic,
        difficulty,
      });
    }
  }

  return (
    <QBankSessionContext.Provider
      value={{
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
        fetchQuestion,
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

export function useQBankSession() {
  return useContext(QBankSessionContext);
}
