import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

type ExpandableSectionProps = {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  delay?: number;
};

export default function ExpandableSection({
  title,
  children,
  defaultExpanded = false,
  delay = 0,
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex justify-between items-center bg-secondary hover:bg-secondary/80 mb-2 p-3 rounded-md w-full text-left transition-colors duration-200"
      >
        <span className="font-medium text-custom-accent">{title}</span>
        <div className="transition-transform duration-200">
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? "max-h-[500px] opacity-100 mb-3" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-tertiary p-4 rounded-md">
          <div className="max-h-[400px] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
