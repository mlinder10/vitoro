"use server";

import { GoogleGenerativeAI, TaskType } from "@google/generative-ai";
import { GeneratedAudit, GeneratedQuestion } from "./types";

export async function generateQuestion(
  topic: string,
  concept: string,
  type: string,
  sources: string[]
) {
  const prompt = `
  You are an expert item writer trained to create original, board-style multiple-choice questions for medical board exams (USMLE Step 1 or Step 2). Each question must test **clinical reasoning** using real-world logic, based on evidence-based medical sources.

  You are given:
  - A clinical topic 
  - A concept to test 
  - A question type (e.g., Diagnosis, Complication, Lab finding, Next Step, First line, Risk factor)

  Use this information to generate a single, original multiple-choice question with:

  1. A realistic and non-obvious vignette that requires reasoning (not recall)
  2. One clearly correct answer
  3. Four plausible distractors (anchored to clues in the stem or similar diagnosis)
    Modifier: if you do not have a source to reference for a incorrect answer choice related to the topic, identify that answer choice and flag it for a admin to update the dataset with appropriate source.
  4. A full explanation:
    - Why the correct answer is right (with citation reference)
    - Why each incorrect option is wrong (anchored to stem or concept)

  ---
  Input:
  Topic: ${topic}
  Concept to Test: ${concept}
  Question Type: ${type}
  Reference Sources: ${sources.join(", ")} 
  ---

  Output your result in this JSON format:

  {
    "topic": <topic> (string),
    "concept": <concept> (string),
    "type": <question type> (string),
    "question": <full stem> (string),
    "choices": {
      "a": <answer A> (string),
      "b": <answer B> (string),
      "c": <answer C> (string),
      "d": <answer D> (string),
      "e": <answer E> (string)
    },
    "answer": "a" | "b" | "c" | "d" | "e",
    "explanations": {
      "a": <explanation A> (string),
      "b": <explanation B> (string),
      "c": <explanation C> (string),
      "d": <explanation D> (string),
      "e": <explanation E> (string)
    },
    "sources": ["e.g., StatPearls - BPH 2024, or UTD file snippet ID"],
    "difficulty": "easy" | "moderate" | "hard",
    "nbmeStyleNotes": ["e.g., uses vague symptoms; distractors anchored to benign findings"]
  }
  `;

  const result = await Gemini.shared.prompt(prompt);
  return stripAndParse<GeneratedQuestion>(result);
}

export async function generateAudit(question: GeneratedQuestion) {
  const prompt = `
  You are an exam-quality control agent trained in board-style question development. You have just generated the following board-style question. You must now review it using the audit checklist below and report whether it passes each item.

  ---
  Input:
  Question: ${JSON.stringify(question)}
  ---

  Review each of the following checklist items. For each, return:
  - Pass (Yes/No)
  - Justification (brief explanation for your score)

  Checklist:
  1. One correct answer with all distractors clearly incorrect  
  2. Each distractor tests a plausible misunderstanding  
  3. Answer is consistent with vitals, labs, and imaging in the stem  
  4. No required data is missing for choosing the correct answer  
  5. Clinical presentation is realistic and not contradictory  
  6. Question requires clinical reasoning, not fact recall  
  7. No direct giveaway or naming of the diagnosis in the stem  
  8. Every answer choice is anchored to clues in the vignette  
  9. No duplicate correct answers or overly vague distractors  

  After the checklist, provide:
  - A suggested revision if any item failed
  - A final overall rating: Pass / Flag for Human Review / Reject

  Respond in structured JSON format:
  {
    "checklist": {
      "1": {"pass": true, "comment": "Clear single correct answer"},
      "2": {"pass": false, "comment": "Distractor D is irrelevant to clinical reasoning"},
      ...etc
    },
    "suggestions": ["Remove distractor D or replace with something clinically tempting but incorrect"],
    "rating": "Flag for Human Review"
  }
  `;
  const result = await Gemini.shared.prompt(prompt);
  return stripAndParse<GeneratedAudit>(result);
}

export async function testGenerateQuestionWithRAG(
  topic: string,
  concept: string,
  type: string,
  sources: string[]
) {
  const prompt = `
  You are an expert item writer trained to create original, board-style multiple-choice questions for medical board exams (USMLE Step 1 or Step 2). Each question must test **clinical reasoning** using real-world logic, based on evidence-based medical sources.

  You are given:
  - A clinical topic 
  - A concept to test 
  - A question type (e.g., Diagnosis, Complication, Lab finding, Next Step, First line, Risk factor)

  Use this information to generate a single, original multiple-choice question with:

  1. A realistic and non-obvious vignette that requires reasoning (not recall)
  2. One clearly correct answer
  3. Four plausible distractors (anchored to clues in the stem or similar diagnosis)
    Modifier: if you do not have a source to reference for a incorrect answer choice related to the topic, identify that answer choice and flag it for a admin to update the dataset with appropriate source.
  4. A full explanation:
    - Why the correct answer is right (with citation reference)
    - Why each incorrect option is wrong (anchored to stem or concept)

  ---
  Input:
  Topic: ${topic}
  Concept to Test: ${concept}
  Question Type: ${type}
  Reference Sources: ${sources.join(", ")} 
  ---

  Output your result in this JSON format:

  {
    "topic": <topic> (string),
    "concept": <concept> (string),
    "type": <question type> (string),
    "question": <full stem> (string),
    "choices": {
      "a": <answer A> (string),
      "b": <answer B> (string),
      "c": <answer C> (string),
      "d": <answer D> (string),
      "e": <answer E> (string)
    },
    "answer": "a" | "b" | "c" | "d" | "e",
    "explanations": {
      "a": <explanation A> (string),
      "b": <explanation B> (string),
      "c": <explanation C> (string),
      "d": <explanation D> (string),
      "e": <explanation E> (string)
    },
    "sources": ["e.g., StatPearls - BPH 2024, or UTD file snippet ID"],
    "difficulty": "easy" | "moderate" | "hard",
    "nbmeStyleNotes": ["e.g., uses vague symptoms; distractors anchored to benign findings"]
  }
  `;

  const result = await Gemini.shared.promptWithRag(prompt, sources);
  return stripAndParse<GeneratedQuestion>(result);
}

// Helper functions ---------------------------------------------------

function stripAndParse<T>(output: string): T {
  return JSON.parse(
    output.replace("```json", "").replace("```", "").trim()
  ) as T;
}

type Model = "gemini-2.0-flash" | "gemini-2.0-flash-lite";

const DEFAULT_MODEL: Model = "gemini-2.0-flash";

class Gemini {
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

  async promptStreamed(prompt: string, model: Model = DEFAULT_MODEL) {
    const llm = this.gemini.getGenerativeModel({ model });
    return llm.generateContentStream(prompt);
  }
}
