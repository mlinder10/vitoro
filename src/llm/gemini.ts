"use server";

import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";

type Model = "gemini-2.0-flash" | "gemini-2.0-flash-lite";

const DEFAULT_MODEL: Model = "gemini-2.0-flash";

const geminiClientSingleton = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY must be set");
  return new GoogleGenerativeAI(apiKey);
};

declare global {
  var gemini: ReturnType<typeof geminiClientSingleton>;
}

const gemini = globalThis.gemini ?? geminiClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.gemini = gemini;
}

// Access functions for the LLM ----------------------------------------------------

export async function promptGemini(
  prompt: string,
  model: Model = DEFAULT_MODEL
) {
  const llm = gemini.getGenerativeModel({ model });
  const output = await llm.generateContent(prompt);
  return output.response.text();
}

export async function promptGeminiStreamed(
  prompt: string,
  model: Model = DEFAULT_MODEL
) {
  const llm = gemini.getGenerativeModel({ model });
  return llm.generateContentStream(prompt);
}

export async function promptGeminiWithRag(
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

  const embeddingLLM = gemini.getGenerativeModel({
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
  const llm = gemini.getGenerativeModel({ model });
  const result = await llm.generateContent(finalPrompt);

  return result.response.text();
}
