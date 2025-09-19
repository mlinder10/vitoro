import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ExpandableSection from "./expandable-section";

type TutorResponseProps = {
  content: string;
};

export default function TutorResponse({ content }: TutorResponseProps) {
  const sections = content.split("\n## ").filter((section) => section.trim());

  if (sections.length <= 1) {
    return (
      <div className="max-w-none prose prose-sm">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="mt-6 mb-4 font-bold text-lg">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="mt-5 mb-3 font-semibold text-base">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="mt-4 mb-2 font-medium text-sm">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="mb-3 leading-relaxed">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="space-y-1 mb-4 ml-4 list-disc">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="space-y-1 mb-4 ml-4 list-decimal">{children}</ol>
            ),
            table: ({ children }) => (
              <div className="my-4 overflow-x-auto">
                <table className="border border-border min-w-full text-sm border-collapse">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-secondary">{children}</thead>
            ),
            th: ({ children }) => (
              <th className="px-3 py-2 border border-border font-semibold text-left">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-3 py-2 border border-border">{children}</td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {sections.map((section, index) => {
        const lines = section.split("\n");
        const title = lines[0].replace(/^#+\s*/, "").trim();
        const body = lines.slice(1).join("\n").trim();

        return (
          <ExpandableSection
            key={index}
            title={title || `Section ${index + 1}`}
            defaultExpanded={index === 0}
            delay={index * 200}
          >
            <div className="max-w-none prose prose-sm">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="mt-4 mb-3 font-bold text-lg">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mt-3 mb-2 font-semibold text-base">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mt-2 mb-2 font-medium text-sm">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-1 mb-3 ml-4 list-disc">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="space-y-1 mb-3 ml-4 list-decimal">
                      {children}
                    </ol>
                  ),
                  table: ({ children }) => (
                    <div className="my-4 overflow-x-auto">
                      <table className="border border-border min-w-full text-sm border-collapse">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-secondary">{children}</thead>
                  ),
                  th: ({ children }) => (
                    <th className="px-3 py-2 border border-border font-semibold text-left">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-3 py-2 border border-border">
                      {children}
                    </td>
                  ),
                }}
              >
                {body}
              </ReactMarkdown>
            </div>
          </ExpandableSection>
        );
      })}
    </div>
  );
}
