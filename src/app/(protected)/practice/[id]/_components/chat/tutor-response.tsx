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
