import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import { readFileSync, writeFileSync } from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const inputs = require("./inputs.json") as Input[];

// Types --------------------------------------------------------------------

type Input = {
  topic: string;
  concept: string;
  type: string;
};

type QuestionChoice = "a" | "b" | "c" | "d" | "e";

type QuestionDifficulty = "easy" | "moderate" | "hard";

type GeneratedQuestion = {
  topic: string;
  concept: string;
  type: string;

  question: string;
  choices: {
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
  };
  answer: QuestionChoice;
  explanations: {
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
  };

  sources: string[];
  difficulty: QuestionDifficulty;
  nbmeStyleNotes: string[];
};

export type ParsedQuestion = GeneratedQuestion & {
  id: string;
  createdAt: Date;
  creatorId: string;
};

export function encodeQuestion(question: ParsedQuestion) {
  return {
    id: question.id,
    topic: question.topic,
    concept: question.concept,
    type: question.type,
    createdAt: question.createdAt,
    creatorId: question.creatorId,
    question: question.question,
    answer: question.answer,
    difficulty: question.difficulty,
    sources: JSON.stringify(question.sources),
    choices: JSON.stringify(question.choices),
    explanations: JSON.stringify(question.explanations),
    nbmeStyleNotes: JSON.stringify(question.nbmeStyleNotes),
  };
}

export type ChecklistItem = { pass: boolean; notes: string };

export type AuditRating = "Pass" | "Flag for Human Review" | "Reject";

export type GeneratedAudit = {
  checklist: {
    1: ChecklistItem;
    2: ChecklistItem;
    3: ChecklistItem;
    4: ChecklistItem;
    5: ChecklistItem;
    6: ChecklistItem;
    7: ChecklistItem;
    8: ChecklistItem;
    9: ChecklistItem;
  };
  suggestions: string[];
  rating: AuditRating;
};

export type ParsedAudit = GeneratedAudit & {
  id: string;
  questionId: string;
};

export function encodeAudit(audit: ParsedAudit) {
  return {
    id: audit.id,
    rating: audit.rating,
    checklist: JSON.stringify(audit.checklist),
    suggestions: JSON.stringify(audit.suggestions),
  };
}

// Config -------------------------------------------------------------------

function createDb() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;
  if (!url || !authToken)
    throw new Error("DATABASE_URL and DATABASE_AUTH_TOKEN must be set");

  const adapter = new PrismaLibSQL({ url, authToken });
  return new PrismaClient({ adapter });
}

function createGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY must be set");
  const gemini = new GoogleGenerativeAI(apiKey);
  return gemini.getGenerativeModel({ model: "gemini-2.0-flash" });
}

// Prompt -------------------------------------------------------------------

function createQuestionPrompt({ topic, concept, type }: Input) {
  return `
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
}

function createAuditPrompt(question: GeneratedQuestion) {
  return `
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
}

function stripAndParse<T>(output: string): T {
  return JSON.parse(
    output.replace("```json", "").replace("```", "").trim()
  ) as T;
}

// Logging ------------------------------------------------------------------

const META_FILE_PATH = "src/script/meta.txt";

function readInputOffset() {
  const data = readFileSync(META_FILE_PATH, "utf-8");
  const num = parseInt(data);
  if (isNaN(num)) throw new Error("Invalid input offset");
  return num;
}

function writeInputOffset(num: number) {
  writeFileSync(META_FILE_PATH, num.toString());
}

// Main ---------------------------------------------------------------------

async function main() {
  try {
    const db = createDb();
    const gemini = createGemini();
    let offset = readInputOffset();
    const unwrittenInputs = inputs.slice(offset);

    for (const input of unwrittenInputs) {
      // Generate question
      const questionPrompt = createQuestionPrompt(input);
      const questionRes = await gemini.generateContent(questionPrompt);
      const parsedQuestion = stripAndParse<GeneratedQuestion>(
        questionRes.response.text()
      );
      const fullQuestion: ParsedQuestion = {
        ...parsedQuestion,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        creatorId: "167e3d51-7236-4304-81d9-42355cd76bc8", // Matt Linder's user ID
      };
      const encodedQuestion = encodeQuestion(fullQuestion);

      // Generate audit
      const auditPrompt = createAuditPrompt(parsedQuestion);
      const auditRes = await gemini.generateContent(auditPrompt);
      const parsedAudit = stripAndParse<GeneratedAudit>(
        auditRes.response.text()
      );
      const fullAudit: ParsedAudit = {
        ...parsedAudit,
        id: crypto.randomUUID(),
        questionId: fullQuestion.id,
      };
      const encodedAudit = encodeAudit(fullAudit);

      // Save both
      await db.question.create({
        data: {
          ...encodedQuestion,
          audit: { create: encodedAudit },
        },
      });
      writeInputOffset(++offset);
      console.log(
        `Generated question #${offset} with\nTopic: ${input.topic}\nConcept: ${input.concept}\nType: ${input.type}\n\n`
      );
    }
  } catch (error) {
    // Retry after one minute on error
    console.error(error);
    setTimeout(() => main(), 1000);
  }
}

main();
