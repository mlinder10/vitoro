"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

type PaginationFooterProps = {
  page: number;
};

export default function PaginationFooter({ page }: PaginationFooterProps) {
  const router = useRouter();

  function nextPage() {
    router.push(`?page=${page + 1}`);
  }

  function prevPage() {
    if (page > 1) {
      router.push(`?page=${page - 1}`);
    }
  }

  return (
    <nav className="grid grid-cols-3 text-muted-foreground text-sm">
      <button
        onClick={prevPage}
        className="flex justify-start items-center gap-2"
        disabled={page < 2}
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>
      <span className="justify-center text-center">{page}</span>
      <button
        onClick={nextPage}
        className="flex justify-end items-center gap-2"
      >
        <span>Next</span>
        <ArrowRight size={16} />
      </button>
    </nav>
  );
}
