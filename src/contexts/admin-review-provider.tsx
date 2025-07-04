"use client";

import { handleSaveQuestionChanges } from "@/app/admin/review/[id]/actions";
import { Audit, Question } from "@/types";
import { useRouter } from "next/navigation";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type AdminReviewContextType = {
  question: Question;
  audit: Audit | null;
  editQuestion: Question;
  hasChanges: boolean;
  updateQuestion: <T extends keyof Question>(
    key: T,
    value: ((prev: Question[T]) => Question[T]) | Question[T]
  ) => void;
  pageType: ReviewPageType;
  setPageType: Dispatch<SetStateAction<ReviewPageType>>;
  isSaving: boolean;
  revertChanges: () => void;
  saveChanges: () => void;
};

const AdminReviewContext = createContext<AdminReviewContextType>({
  question: {} as Question,
  audit: null,
  editQuestion: {} as Question,
  hasChanges: false,
  updateQuestion: () => {},
  pageType: "review",
  setPageType: () => {},
  isSaving: false,
  revertChanges: () => {},
  saveChanges: () => {},
});

type AdminReviewProviderProps = {
  children: ReactNode;
  question: Question;
  audit: Audit | null;
};

export type ReviewPageType = "review" | "edit";

export default function AdminReviewProvider({
  children,
  question,
  audit,
}: AdminReviewProviderProps) {
  const [editQuestion, setEditQuestion] = useState(question);
  const [pageType, setPageType] = useState<ReviewPageType>("review");
  const [isSaving, setIsSaving] = useState(false);
  const hasChanges = JSON.stringify(question) !== JSON.stringify(editQuestion);
  const router = useRouter();

  function updateQuestion<T extends keyof Question>(
    key: T,
    value: ((prev: Question[T]) => Question[T]) | Question[T]
  ) {
    if (typeof value === "function") value = value(editQuestion[key]);
    setEditQuestion((prev) => ({ ...prev, [key]: value }));
  }

  function revertChanges() {
    setEditQuestion(question);
  }

  async function saveChanges() {
    setIsSaving(true);
    await handleSaveQuestionChanges(editQuestion);
    setIsSaving(false);
    router.refresh();
  }

  return (
    <AdminReviewContext.Provider
      value={{
        question,
        audit,
        editQuestion,
        hasChanges,
        updateQuestion,
        pageType,
        setPageType,
        isSaving,
        revertChanges,
        saveChanges,
      }}
    >
      {children}
    </AdminReviewContext.Provider>
  );
}

export function useAdminReview() {
  return useContext(AdminReviewContext);
}
