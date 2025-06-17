import { AnyCategory, AnySubcategory, QuestionType, System } from "@/types";
import { GeneratedAudit, GeneratedQuestion } from "@/types";
import { stripAndParse } from "../../helpers";
import { promptGemini } from "@/llm/gemini";

export async function generateQuestion(
  system: System,
  category: AnyCategory,
  subcategory: AnySubcategory,
  type: QuestionType
) {
  const prompt = `
  You are an expert item writer trained to create original, board-style multiple-choice questions for medical board exams (USMLE Step 1 or Step 2). Each question must test **clinical reasoning** using real-world logic, based on evidence-based medical sources.

  You are given:
  - A system 
  - A category within the system
  - A subcategory within the category
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
  System: ${system}
  Category: ${category as string}
  Question Type: ${type}
  Subcategory: ${subcategory as string}
  ---

  Output your result in this JSON format:

  {
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

  const result = await promptGemini(prompt);
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
  const result = await promptGemini(prompt);
  return stripAndParse<GeneratedAudit>(result);
}
