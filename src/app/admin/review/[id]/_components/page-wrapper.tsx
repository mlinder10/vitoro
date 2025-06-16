"use client";

import { ParsedAudit, ParsedQuestion } from "@/types";
import { useState } from "react";
import ReviewPage from "./review-page";
import EditPage from "./edit-page";

type ReviewPageWrapperProps = {
  question: ParsedQuestion;
  audit: ParsedAudit | null;
};

export type ReviewPageType = "review" | "edit";

export default function ReviewPageWrapper({
  question,
  audit,
}: ReviewPageWrapperProps) {
  const [pageType, setPageType] = useState<ReviewPageType>("review");

  if (pageType === "review")
    return (
      <ReviewPage question={question} audit={audit} setPageType={setPageType} />
    );
  if (pageType === "edit")
    return (
      <EditPage question={question} audit={audit} setPageType={setPageType} />
    );
  return null;
}
