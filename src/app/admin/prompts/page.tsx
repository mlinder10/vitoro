"use client";

import useInfiniteScroll, { LoadingFooter } from "@/hooks/use-infinite-scroll";
import { fetchPrompts } from "./actions";
import { Prompt } from "@/types";

export default function PromptsPage() {
  const { data, isLoading, containerRef } = useInfiniteScroll<
    Prompt,
    HTMLDivElement
  >(async (offset) => {
    return await fetchPrompts(offset, 10);
  }, []);

  return (
    <main>
      <div ref={containerRef}>
        {data.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-2 bg-tertiary border rounded-md"
          >
            <p className="">{p.prompt}</p>
            <div className="flex gap-2 text-muted-foreground text-sm">
              <span>Input: {p.inputTokens}</span>
              <span>Output: {p.outputTokens}</span>
            </div>
          </div>
        ))}
        <LoadingFooter isLoading={isLoading} />
      </div>
    </main>
  );
}
