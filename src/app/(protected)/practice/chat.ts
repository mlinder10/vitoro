"use server";

import { Gemini } from "@/ai";
import { NBMEQuestion, QuestionChoice, Task, Message } from "@/types";

function buildTaskPrompts(basePrompt: string) {
  return {

    breakdown:
      basePrompt +
      `
## 🧠 Clue Breakdown
- Extract 3-6 key stem findings

## 🔬 Mechanism Map
- Link each clue to a pathophysiologic or clinical inference

## ✅ Decision Logic
- Lay out the step-by-step rule used to land on the correct answer

## 🏹 Practice Point
- One high-yield rule the student should now burn into memory
`,

    distractor:
      basePrompt +
      `
## 🎯 Why They Fell For It
- Dissect the wrong answer's seduction

## ⚔️ Killer Differentiator
- The fact that should have killed the distractor

## 🧩 If → Then Rule
- **If** [critical clue] → **Then** pick [correct choice]

## 🔁 Rapid Rep
- One quick-fire case to apply this rule
`,

    "gap-finder":
      basePrompt +
      `
## 📉 Bridge the Gap
- Provide a 5-point micro-lesson to bridge the gap between the student's answer and the correct answer.

## 🧠 Review
- Give an easy to digest but detailed explanation of the key concept for this question to help reinforce the student's understanding.

## 🔄 Check Your Understanding
- ask an open ended question related to the review to help reinforce the student's understanding
- DO NOT ANSWER THE QUESTION FOR THEM, wait for their response. 

`,

    strategy:
      basePrompt +
      `
## 🧭 Read Order
- Tell them to read the last sentence FIRST, then read the stem, and then walk them through how to build a differential diagnosis for the question.

## 🔑 Clue Ranking
- Which findings matter most — and which are noise

## 🚫 Elimination Rules
- What should've been cut instantly

## 🏁 Final Move
- Coach them on how to answer the question in their head first before looking to the answer choices.

## 🥼 Think like a doctor
- Explain the process of thinking like a doctor, building a differential diagnosis, and how to apply it to the question.
`,


    pattern:
      basePrompt +
      `
## 🧠 Pattern Table

| Trigger Clue | Pick This | Not That (Why) |
|--------------|-----------|----------------|
| Clue 1       |           |                |
| Clue 2       |           |                |
| Clue 3       |           |                |

## ⚡ Pattern Drill
- One A vs B decision forced by a key clue, DO NOT ANSWER THE QUESTION FOR THEM, wait for their response.
`,

    memory:
      basePrompt +
      `
## 🧠 Flashcard Build

**Cloze Card**  
Front: [Sentence with ______ blank]  
Back: [Answer]

**Scenario Card**  
Front: [Clinical situation]  
Back: [Critical takeaway]

**Mnemonic**  
Keep it clean, short, and testable.
`,

    "pimp-mode":
      basePrompt +
      `
## 🔥 Pimp Mode (Free-Response)

Ask the student 4-6 **short-answer**, **no-choice** questions that:
- Start simple (basic mechanism, name the bug/drug/pathway)
- Progress to integration (what if x was different?)
- Include at least 1 trap check (common wrong answer test)
- Always end with: "Where do people usually screw this up?"

The goal: make them *think*, not guess.
Use a tone that's firm but fair. You're not being cruel — you're training them for real.
`,
  } as const;
}

function getTaskSystemPrompt(
  task: Task,
  question: NBMEQuestion,
  choice: QuestionChoice
) {
  const isCorrect = choice === question.answer;
  const basePrompt = `You are Vito, an encouraging and brilliant USMLE board prep tutor trained in the style of Adam Plotkin. 
Your job is to dissect why the student got this question ${isCorrect ? "RIGHT" : "WRONG"} and push them to clinical mastery. 
Tone: clear, direct, but snarky and sarcastic. Teach them what matters. Skip what doesn't.

Formatting Rules:\n- Respond using markdown.\n- Use H2 headings (##) for each major section with natural, meaningful titles you choose.\n- No global intro/outro; keep the response organized under headings only.\n- Keep it concise and instructional.

Question:
${question.question}

Answer Choices:
${question.choices.a}
${question.choices.b}
${question.choices.c}
${question.choices.d}
${question.choices.e}

Student Picked: ${choice}
Correct Answer: ${question.answer}
`;

  const prompts = buildTaskPrompts(basePrompt);

  return prompts[task];
}

export async function promptChatWithTask(
  task: Task,
  question: NBMEQuestion,
  choice: QuestionChoice,
  messages?: Message[]
) {
  let prompt = getTaskSystemPrompt(task, question, choice);

  if (messages && messages.length > 0) {
    const history = messages.reduce(
      (acc, m) => acc + `${m.role} message: ${m.content}\n`,
      ""
    );
    prompt += `\nPrevious Conversation:\n${history}`;
  }

  const llm = new Gemini();
  return await llm.promptStreamed([
    {
      content: prompt,
      type: "text",
    },
  ]);
}

// General --------------------------------------------------------------------

export async function promptGeneralChat(
  question: NBMEQuestion,
  choice: QuestionChoice,
  messages: Message[]
) {
  const basePrompt = `You are Vitoro, an encouraging and brilliant USMLE board prepcoach trained in the style of Adam Plotkin.
Your job is to push students to clinical mastery by helping them understand how to break down question stems, build a differential diagnosis, and understand the key differences between answer choices. Tone: clear, direct, but snarky and sarcastic.

Formatting Rules:\n- Respond using markdown.\n- Use H2 headings (##) for each major section with natural, meaningful titles you choose.\n- No global intro/outro; keep the response organized under headings only.\n- Keep it concise and instructional.

## Case Stem
${question.question}

## Answer Choices
- a: ${question.choices.a}
- b: ${question.choices.b}
- c: ${question.choices.c}
- d: ${question.choices.d}
- e: ${question.choices.e}

## User Answer
${choice}

## Correct Answer
${question.answer}

## Key Explanation
${question.explanations[question.answer]}

## Previous Conversation
`; 

  const formatted = messages
    .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n");
  const joined =
    basePrompt +
    formatted +
    "\n\nPlease respond to the user's last message.";
  const llm = new Gemini();
  return await llm.promptStreamed([
    {
      content: joined,
      type: "text",
    },
  ]);
}