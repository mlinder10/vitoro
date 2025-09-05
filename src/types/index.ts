export * from "./question";
export * from "./systems";
export * from "./general";
export type SectionType = "concept" | "example" | "equation" | "practice" | "summary";

export type Section = {
  id: string;
  title: string;
  content: string;
  type: SectionType;
  defaultExpanded?: boolean;
  icon?: string;
};

export type AIResponse = {
  id: string;
  sections: Section[];
  timestamp: Date;
  hasExpandableSections: boolean;
};
