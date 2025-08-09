export interface RetrievedDoc { id: string; title: string; snippet: string; }

export class Retriever {
  constructor(private index?: unknown) {}
  async fetch(concepts: string[], k = 3): Promise<RetrievedDoc[]> {
    return concepts.slice(0, k).map((c, i) => ({
      id: `SP:${c}:${i}`,
      title: `${c} – StatPearls`,
      snippet: `High-yield notes for ${c}...`
    }));
  }
}
