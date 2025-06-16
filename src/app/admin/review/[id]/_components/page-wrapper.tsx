"use client";

import ReviewPage from "./review-page";
import EditPage from "./edit-page";
import { useAdminReview } from "@/contexts/admin-review-provider";

export default function ReviewPageWrapper() {
  const { pageType } = useAdminReview();
  if (pageType === "review") return <ReviewPage />;
  if (pageType === "edit") return <EditPage />;
  return null;
}
