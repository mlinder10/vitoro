import PaginationFooter from "@/components/pagination-footer";
import { fetchPrompts } from "./actions";
import PromptContainer from "./prompt-container";

const MAX_ITEMS_PER_PAGE = 30;

type PromptsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PromptsPage({ searchParams }: PromptsPageProps) {
  const { page } = await searchParams;
  const pageNum = page ? Number(page) : 1;
  const data = await fetchPrompts(
    (pageNum - 1) * MAX_ITEMS_PER_PAGE,
    MAX_ITEMS_PER_PAGE
  );

  return (
    <main className="flex flex-col gap-4 p-4 h-full">
      <ul className="flex flex-col flex-1 gap-4 overflow-y-auto">
        {data.map((p) => (
          <PromptContainer key={p.id} prompt={p} />
        ))}
      </ul>
      <PaginationFooter page={pageNum} />
    </main>
  );
}
