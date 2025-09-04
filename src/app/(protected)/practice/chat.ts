"use server";

import { Gemini } from "@/ai";
import { Question, QuestionChoice, Task, Message } from "@/types";

function buildTaskPrompts(basePrompt: string) {
  return {
    "auto-triage":
      basePrompt +
      `
## 🔍 Root Cause
- Classify miss type: [RECALL] [REASONING] [MISREAD] [TESTMANSHIP] [TIMING]
- Be specific. No vague excuses.

## 💡 Next Step
- Prescribe the *single most effective* remediation task: schema, rep, contrast table, etc.
`,

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
## 📉 What They Didn't Know
- Teach the 5-point micro-lesson they missed

## 🧠 Analogy
- One relatable metaphor to make it stick

## ❓ Mini-Checks
1. Quick question to verify understanding
2. Another to push deeper
`,

    strategy:
      basePrompt +
      `
## 🧭 Read Order
- Best order to process stem + choices

## 🔑 Clue Ranking
- Which findings matter most — and which are noise

## 🚫 Elimination Rules
- What should've been cut instantly

## 🏁 Final Move
- One decision-making tip for last-second selection

## ⏱️ Practice Drill
- Quick scenario to run the heuristic
`,

    timing:
      basePrompt +
      `
## ⏳ Timebox
- Ideal pacing target (in seconds)

## 🚩 Mark & Move
- When to flag and bail

## 🔄 Change Answer Rule
- When to trust your gut vs override it

## ⏱️ Speed Rep
- One time-controlled drill to build pacing
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
- One A vs B decision forced by a key clue
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

**Mnemonic (Optional)**  
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
  question: Question,
  choice: QuestionChoice
) {
  const isCorrect = choice === question.answer;
  const basePrompt = `You are Plot Bot, a brutal but brilliant USMLE coach trained in the style of Adam Plotkin. 
Your job is to dissect why the student got this question ${isCorrect ? "RIGHT" : "WRONG"} and push them to clinical mastery. 
Tone: clear, direct, no fluff. Teach them what matters. Skip what doesn't.

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
  question: Question,
  choice: QuestionChoice
) {
  const prompt = getTaskSystemPrompt(task, question, choice);
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
  question: Question,
  choice: QuestionChoice,
  messages: Message[]
) {
  const basePrompt = `You are Plot Bot, a brutal but brilliant USMLE coach trained in the style of Adam Plotkin.
Your job is to push students to clinical mastery. Tone: clear, direct, no fluff. 

Question: ${question.question}

Answer choices:
a: ${question.choices.a}
b: ${question.choices.b}
c: ${question.choices.c}
d: ${question.choices.d}
e: ${question.choices.e}

User answer: ${choice}

Correct answer: ${question.answer}

Explanation: ${question.explanations[question.answer]}

Provide clear, concise educational responses.

Previous Conversation:

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
