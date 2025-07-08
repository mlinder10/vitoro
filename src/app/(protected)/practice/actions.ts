"use server";

import { db, questions, answeredQuestions, reviewQuestions } from "@/db";
import { eq, and, isNull, or, sql } from "drizzle-orm";
import {
  GeneratedReviewQuestion,
  isValidGeneratedReviewQuestion,
  Question,
  QuestionChoice,
} from "@/types";
import { Gemini, stripAndParse, TextPrompt } from "@/llm";
import { QuestionFilters } from "@/contexts/qbank-session-provider";
import { redirect } from "next/navigation";

export async function resetProgress(userId: string) {
  await db
    .delete(answeredQuestions)
    .where(eq(answeredQuestions.userId, userId));
}

export async function answerQuestion(
  userId: string,
  questionId: string,
  answer: QuestionChoice
) {
  await db.insert(answeredQuestions).values({
    userId,
    questionId,
    answer,
  });
}

export async function promptChat(
  question: Question,
  choice: QuestionChoice,
  messages: string[]
) {
  const basePrompt = `
    You are a NBME exam tutor.

    A student was just presented this question:
    Stem: ${question.question}
    Choices: ${JSON.stringify(question.choices)}
    Explanations: ${JSON.stringify(question.explanations)}
    Answer: ${question.answer}

    The student selected: ${choice}

    Your task is to help the student understand why they selected the wrong answer.

    This is the conversation you've had so far:
  `;

  const input: TextPrompt[] = [
    {
      type: "text",
      content: JSON.stringify({ role: "base", content: basePrompt }),
    },
  ];
  for (let i = 0; i < messages.length; ++i) {
    input.push({
      type: "text",
      content: JSON.stringify({
        role: i % 2 === 0 ? "user" : "ai-tutor",
        content: messages[i],
      }),
    });
  }

  const llm = new Gemini();
  return llm.promptStreamed(input);
}

export async function createReviewQuestion(
  question: Question,
  answer: QuestionChoice,
  userId: string
) {
  const prompt = `
    You are an NBME exam tutor.

    A student was just presented this question:
    Stem: ${question.question}
    Choices: ${JSON.stringify(question.choices)}
    Explanations: ${JSON.stringify(question.explanations)}
    Answer: ${question.answer}

    The student selected: ${answer}

    Please generate a review question based on this question and the student's answer.

    Please respond in the following JSON format:

    {
      "question": "<review question>",
      "answerCriteria": ["<answer criteria>"]
    }
  `;

  const llm = new Gemini();
  const result = await llm.prompt([{ type: "text", content: prompt }]);

  if (!result) throw new Error("Failed to generate text");
  const parsed = stripAndParse<GeneratedReviewQuestion>(result);
  if (!parsed) throw new Error("Failed to parse JSON");
  if (!isValidGeneratedReviewQuestion(parsed))
    throw new Error("Invalid JSON: " + result);

  await db.insert(reviewQuestions).values({
    ...parsed,
    questionId: question.id,
    userId,
  });
}

// Filtered questions ---------------------------------------------------------

export async function redirectToQuestion(
  userId: string,
  filters: QuestionFilters
) {
  const [question] = await db
    .select({ id: questions.id })
    .from(questions)
    .leftJoin(
      answeredQuestions,
      and(
        eq(answeredQuestions.questionId, questions.id),
        eq(answeredQuestions.userId, userId)
      )
    )
    .where(
      and(
        eq(questions.rating, "Pass"),
        ...buildWhereClause(filters),
        isNull(answeredQuestions.userId)
      )
    )
    .orderBy(sql`RANDOM()`)
    .limit(1);

  if (!question) redirect("/practice/complete");

  redirect(`/practice/q/${question.id}`);
}

function buildWhereClause({
  step,
  type,
  system,
  category,
  subcategory,
  topic,
  difficulty,
}: QuestionFilters) {
  return [
    step && step !== "Mixed"
      ? or(eq(questions.step, step), eq(questions.step, "Mixed"))
      : undefined,
    type ? eq(questions.type, type) : undefined,
    system ? eq(questions.system, system) : undefined,
    category ? eq(questions.category, category) : undefined,
    subcategory ? eq(questions.subcategory, subcategory) : undefined,
    topic ? eq(questions.topic, topic) : undefined,
    difficulty ? eq(questions.difficulty, difficulty) : undefined,
  ].filter((c) => c !== undefined);
}
