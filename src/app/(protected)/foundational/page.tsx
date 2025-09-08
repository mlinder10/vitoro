import PageTitle from "../_components/page-title";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSession } from "@/lib/auth";
import { STEP2_SYSTEM_TO_SHELVES } from "@/lib/foundational-data";
import { getIncomplete } from "./actions";

export default async function FoundationalPage() {
  const { id } = await getSession();
  const incomplete = await getIncomplete(id);

  return (
    <div className="h-full overflow-y-auto">
      <PageTitle text="Foundational" />
      {incomplete.length > 0 ? (
        <div className="space-y-4 p-4">
          {incomplete.map((item) => {
            let href = `/foundational/${encodeURIComponent(item.system)}?step=${encodeURIComponent(String(item.step))}`;
            if (item.topic)
              href += `&topic=${encodeURIComponent(item.topic)}`;
            const shelves = STEP2_SYSTEM_TO_SHELVES[item.system];
            if (shelves?.length === 1)
              href += `&shelf=${encodeURIComponent(shelves[0])}`;
            return (
              <div
                key={item.questionId}
                className="relative flex justify-between items-center px-6 py-4 hover:pr-2 border rounded-md transition-all"
              >
                <div>
                  <p>{item.system}</p>
                  {item.topic && (
                    <p className="text-sm text-muted-foreground">{item.topic}</p>
                  )}
                </div>
                <ArrowRight size={16} className="text-muted-foreground" />
                <Link href={href} className="absolute inset-0 opacity-0">
                  Continue {item.system}
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="p-4 text-sm text-muted-foreground">
          No in-progress sessions.
        </p>
      )}
      <div className="p-4">
        <Link
          href="/foundational/new"
          className="block w-full text-center px-6 py-4 border rounded-md hover:bg-secondary"
        >
          Start New Session
        </Link>
      </div>
    </div>
  );
}
