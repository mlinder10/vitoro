"use server";

import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";

type Model = "gemini-2.0-flash" | "gemini-2.0-flash-lite";

const DEFAULT_MODEL: Model = "gemini-2.0-flash";

export class Gemini {
  private static _shared = new Gemini();

  static get shared() {
    return this._shared;
  }

  private gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  private constructor() {}

  async prompt(prompt: string, model: Model = DEFAULT_MODEL) {
    const llm = this.gemini.getGenerativeModel({ model });
    const output = await llm.generateContent(prompt);
    return output.response.text();
  }

  async promptStreamed(prompt: string, model: Model = DEFAULT_MODEL) {
    const llm = this.gemini.getGenerativeModel({ model });
    return llm.generateContentStream(prompt);
  }

  async promptWithRag(
    prompt: string,
    documents: string[],
    model: Model = DEFAULT_MODEL,
    topK: number = 3
  ) {
    if (documents.length < 1) throw new Error("No documents provided");
    if (prompt.length === 0) throw new Error("No prompt provided");

    if (documents.length < topK) topK = documents.length;
    if (topK > 10) topK = 10;
    if (topK < 1) topK = 1;

    const embeddingLLM = this.gemini.getGenerativeModel({
      model: "models/text-embedding-004",
    });

    const chunks = [
      ...new Set(
        documents.flatMap((d) =>
          d
            .split("\n\n")
            .map((p) => p.trim())
            .filter(Boolean)
        )
      ),
    ];

    // Embed docs
    const { embeddings } = await embeddingLLM.batchEmbedContents({
      requests: chunks.map((c) => ({
        content: { role: "", parts: [{ text: c }] },
        taskType: TaskType.RETRIEVAL_DOCUMENT,
      })),
    });

    const queryEmbedding = embeddings[embeddings.length - 1];
    const docEmbeddings = embeddings.slice(0, -1);

    // Cosine similarity
    function cosineSimilarity(a: number[], b: number[]): number {
      const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
      const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
      const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
      return dot / (normA * normB);
    }

    const scoredDocs = documents.map((doc, i) => ({
      doc,
      score: cosineSimilarity(queryEmbedding.values, docEmbeddings[i].values),
    }));

    // Get top K elements
    const topDocs = scoredDocs
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map((d) => d.doc);

    const context = topDocs.join("\n---\n");
    const finalPrompt = `${context}\n\nUser Question: ${prompt}`;

    // Generate response
    const llm = this.gemini.getGenerativeModel({ model });
    const result = await llm.generateContent(finalPrompt);

    return result.response.text();
  }
}
