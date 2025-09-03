"use client";

import { handleSaveQuestionChanges } from "@/app/admin/review/[id]/actions";
import { StepTwoNBMEQuestion } from "@/types";
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
  question: StepTwoNBMEQuestion;
  editQuestion: StepTwoNBMEQuestion;
  hasChanges: boolean;
  updateQuestion: <T extends keyof StepTwoNBMEQuestion>(
    key: T,
    value:
      | ((prev: StepTwoNBMEQuestion[T]) => StepTwoNBMEQuestion[T])
      | StepTwoNBMEQuestion[T]
  ) => void;
  pageType: ReviewPageType;
  setPageType: Dispatch<SetStateAction<ReviewPageType>>;
  isSaving: boolean;
  revertChanges: () => void;
  saveChanges: () => void;
};

const AdminReviewContext = createContext<AdminReviewContextType>({
  question: {} as StepTwoNBMEQuestion,
  editQuestion: {} as StepTwoNBMEQuestion,
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
  question: StepTwoNBMEQuestion;
};

export type ReviewPageType = "review" | "edit";

export default function AdminReviewProvider({
  children,
  question,
}: AdminReviewProviderProps) {
  const [editQuestion, setEditQuestion] = useState(question);
  const [pageType, setPageType] = useState<ReviewPageType>("review");
  const [isSaving, setIsSaving] = useState(false);
  const hasChanges = JSON.stringify(question) !== JSON.stringify(editQuestion);
  const router = useRouter();

  function updateQuestion<T extends keyof StepTwoNBMEQuestion>(
    key: T,
    value:
      | ((prev: StepTwoNBMEQuestion[T]) => StepTwoNBMEQuestion[T])
      | StepTwoNBMEQuestion[T]
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
