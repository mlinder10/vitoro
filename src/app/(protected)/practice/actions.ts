"use server";

import {
  db,
  questions,
  answeredQuestions,
  audits,
  reviewQuestions,
} from "@/db";
import { eq, exists, not, and } from "drizzle-orm";
import {
  GeneratedReviewQuestion,
  isValidGeneratedReviewQuestion,
  Question,
  QuestionChoice,
} from "@/types";
import { Gemini, stripAndParse, TextPrompt } from "@/llm";

export async function fetchUnansweredQuestion(userId: string) {
  const [question] = await db
    .select({ question: questions })
    .from(questions)
    .leftJoin(audits, eq(questions.id, audits.questionId))
    .where(
      and(
        eq(audits.rating, "Pass"),
        not(
          exists(
            db
              .select()
              .from(answeredQuestions)
              .where(
                and(
                  eq(answeredQuestions.userId, userId),
                  eq(answeredQuestions.questionId, questions.id)
                )
              )
          )
        )
      )
    )
    .limit(1);
  return question ? question.question : null;
}

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
