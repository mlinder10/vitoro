"use client";

import {
  countQuestions,
  createQbankSession,
  fetchQuestions,
  getCountsGrouped,
  updateQbankSession,
} from "@/app/(protected)/practice/actions";
import useDeepState from "@/hooks/use-deep-state";
import {
  AnyCategory,
  AnySubcategory,
  NBMEStep,
  Question,
  QuestionChoice,
  QuestionDifficulty,
  QuestionType,
  System,
} from "@/types";
import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

// Context Typing --------------------------------------------------------------

export const DEFAULT_QUESTION_COUNT = 0;

export type Selected = {
  systems: Set<System>;
  categories: Set<AnyCategory>;
  subcategories: Set<AnySubcategory>;
};

// TODO: only use topics in filtering
type QBankSessionType = {
  // State
  mode: QBankMode;
  setMode: Dispatch<SetStateAction<QBankMode>>;
  step: NBMEStep | undefined;
  setStep: Dispatch<SetStateAction<NBMEStep | undefined>>;
  type: QuestionType | undefined;
  setType: Dispatch<SetStateAction<QuestionType | undefined>>;
  status: QBankStatus[];
  setStatus: Dispatch<SetStateAction<QBankStatus[]>>;
  selected: Selected;
  setSelected: (updater: (draft: Selected) => void) => void;
  difficulty: QuestionDifficulty | undefined;
  setDifficulty: Dispatch<SetStateAction<QuestionDifficulty | undefined>>;
  questionCount: number;
  setQuestionCount: Dispatch<SetStateAction<number>>;
  availableCount: number;
  refreshAvailableCount: (userId: string) => Promise<void>;
  groupedCounts: Record<string, number>;
  refreshGroupedCounts: (userId: string) => Promise<void>;
  time: number | null;
  // question data
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
  questions: Question[];
  answers: (QuestionChoice | null)[];
  setAnswers: Dispatch<SetStateAction<(QuestionChoice | null)[]>>;
  flagged: string[];
  setFlagged: Dispatch<SetStateAction<string[]>>;
  // Methods
  startSession: (userId: string, filter?: boolean) => Promise<void>;
  endSession: (userId: string) => Promise<void>;
};

const QBankSessionContext = createContext<QBankSessionType>({
  mode: "tutor",
  setMode: () => {},
  step: undefined,
  setStep: () => {},
  type: undefined,
  setType: () => {},
  status: [],
  setStatus: () => {},
  selected: {
    systems: new Set(),
    categories: new Set(),
    subcategories: new Set(),
  },
  setSelected: () => {},
  difficulty: undefined,
  setDifficulty: () => {},
  questionCount: DEFAULT_QUESTION_COUNT,
  setQuestionCount: () => {},
  availableCount: 0,
  refreshAvailableCount: async () => {},
  groupedCounts: {},
  refreshGroupedCounts: async () => {},
  time: null,
  // question data
  index: 0,
  setIndex: () => {},
  questions: [],
  answers: [],
  setAnswers: () => {},
  flagged: [],
  setFlagged: () => {},
  // Methods
  startSession: async () => {},
  endSession: async () => {},
});

type QBankSessionProviderProps = {
  children: ReactNode;
};

// Context Provider ------------------------------------------------------------

const TIME_PER_QUESTION = 90; // 1.5 min

export type QBankMode = "timed" | "tutor";
export type QBankStatus = "Unanswered" | "Answered" | "Correct" | "Incorrect";

export default function QBankSessionProvider({
  children,
}: QBankSessionProviderProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [mode, setMode] = useState<QBankMode>("tutor");
  const [step, setStep] = useState<NBMEStep>();
  const [type, setType] = useState<QuestionType>();
  const [status, setStatus] = useState<QBankStatus[]>([]);
  const [selected, setSelected] = useDeepState<Selected>({
    systems: new Set(),
    categories: new Set(),
    subcategories: new Set(),
  });
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>();
  const [questionCount, setQuestionCount] = useState(DEFAULT_QUESTION_COUNT);
  const [availableCount, setAvailableCount] = useState(0);
  const [groupedCounts, setGroupedCounts] = useState<Record<string, number>>(
    {}
  );

  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(QuestionChoice | null)[]>([]);
  const [flagged, setFlagged] = useState<string[]>([]);
  const [time, setTime] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (time !== null) {
      if (time === 0) return;

      const timer = setInterval(() => {
        setTime(time - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [time, router]);

  useEffect(() => {
    async function updateSession() {
      if (!sessionId) return;
      await updateQbankSession({
        id: sessionId,
        flaggedIds: flagged,
        answers,
      });
    }
    updateSession();
  }, [answers, flagged, sessionId]);

  async function startSession(userId: string, filter = true) {
    const questions = await fetchQuestions(
      userId,
      {
        step: filter ? step : undefined,
        type: filter ? type : undefined,
        status: filter ? status : undefined,
        selected: filter ? selected : undefined,
        difficulty: filter ? difficulty : undefined,
      },
      questionCount
    );
    // TODO: make sure questions are valid
    setQuestions(questions);
    setAnswers(Array(questions.length).fill(null));
    const id = await createQbankSession(
      userId,
      questions.map((q) => q.id),
      mode
    );
    setSessionId(id);

    if (mode === "timed") {
      setTime(questions.length * TIME_PER_QUESTION);
    }
  }

  async function endSession() {
    if (!sessionId) throw new Error("No session started");

    if (answers.some((a) => a === null)) {
      throw new Error("All questions must be answered");
    }

    await updateQbankSession({
      id: sessionId,
      flaggedIds: flagged,
      answers,
      inProgress: false,
    });

    router.replace(`/practice/summary/${sessionId}`);
  }

  async function refreshAvailableCount(userId: string) {
    try {
      const value = await countQuestions(userId, {
        step,
        type,
        status,
        selected,
        difficulty,
      });
      setAvailableCount(value);
    } catch (e) {
      setAvailableCount(0);
      console.error("refreshAvailableCount failed", e);
    }
  }

  async function refreshGroupedCounts(userId: string) {
    try {
      const rows = await getCountsGrouped(userId, {
        step,
        type,
        status,
        selected,
        difficulty,
      });
      const map: Record<string, number> = {};
      for (const r of rows) {
        map[r.system] = (map[r.system] ?? 0) + r.count;
        map[r.category] = (map[r.category] ?? 0) + r.count;
        map[r.subcategory] = (map[r.subcategory] ?? 0) + r.count;
      }
      setGroupedCounts(map);
    } catch (e) {
      setGroupedCounts({});
      console.error("refreshGroupedCounts failed", e);
    }
  }

  return (
    <QBankSessionContext.Provider
      value={{
        mode,
        setMode,
        step,
        setStep,
        type,
        setType,
        status,
        setStatus,
        selected,
        setSelected,
        difficulty,
        setDifficulty,
        questionCount,
        setQuestionCount,
        // readonly
        availableCount,
        groupedCounts,
        time,
        // question data
        index,
        setIndex,
        questions,
        answers,
        setAnswers,
        flagged,
        setFlagged,
        // Methods
        startSession,
        endSession,
        refreshAvailableCount,
        refreshGroupedCounts,
      }}
    >
      {children}
    </QBankSessionContext.Provider>
  );
}

export type QuestionFilters = {
  step: NBMEStep | undefined;
  type: QuestionType | undefined;
  status: QBankStatus[] | undefined;
  selected: Selected | undefined;
  difficulty: QuestionDifficulty | undefined;
};

// Hook --------------------------------------------------------------------

export function useQBankSession() {
  return useContext(QBankSessionContext);
}
