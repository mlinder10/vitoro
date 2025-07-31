"use server";

// Documentation
//
// General Structure:
//
// getChatPrompt is the only function that should be edited by non-programmers
//
// The general flow of the structure is:
//
// Prompt user for some input (ex. incorrect-1) ->
// Make sure user's input is valid (ex. incorrect-1-check) ->
// If valid, send user to next step (ex. incorrect-2)
// Otherwise, send user to invalid step (ex. incorrect-1-invalid)
//
// the only things that should be changed in this function are the messages
// ex.
//
// {
//  prompt: true,
//  message: `some text...`,
//  tags: [],
//  nextTags: [],
//  next: "incorrect-1-check",
// }
//
// The message field where "prompt" is "true" will change the prompt given to an LLM in turn changing its response to users
// Where "prompt" is "false" will change the message given directly to the user
// "tags" are the tags associated with the next response from the LLM
// "nextTags" are the tags to set on the next message from the user
// "next" is the next step in the chat sequence
//
// LLM Observations / Notes:
//
// I've had to change some of the check prompts to be more specific and I think examples would be helpful in some cases of
// what is acceptable and what isn't
//
// We will likely want some kind of short "system-ish" prompt at the beginning of each chat sequence
//
// We will probably want to change some of the invalid messages to be more specific. We could also make it a prompt to an LLM
// instead of a direct response to users to dynamically respond to their messages and explain why what they answered is invalid
//
// Code Notes:
//
// If you want to change the order of the chat sequence or do anything beyond just changing the message strings, please text me first

import { Gemini } from "@/ai";
import { Question, QuestionChoice } from "@/types";

export type ChatStep =
  // incorrect track
  | "incorrect-1"
  | "incorrect-1-check"
  | "incorrect-1-invalid"
  | "incorrect-2"
  | "incorrect-2-check"
  | "incorrect-2-invalid"
  | "incorrect-3"
  | "incorrect-3-check"
  | "incorrect-3-invalid"
  | "incorrect-complete"
  // correct track
  | "correct-1"
  | "correct-1-check"
  | "correct-1-invalid"
  | "correct-2"
  | "correct-2-check"
  | "correct-2-invalid"
  | "correct-3"
  | "correct-3-check"
  | "correct-3-invalid"
  | "correct-4"
  | "correct-4-check"
  | "correct-4-invalid"
  | "correct-5"
  | "correct-5-check"
  | "correct-5-invalid"
  | "correct-complete";

export type MessageTag = "student-explanation" | "integration-question";

export type Message = {
  role: "user" | "assistant";
  content: string;
  tags: MessageTag[];
};

type ChatPromptResponse = {
  prompt: boolean;
  message: string;
  tags: MessageTag[];
  nextTags: MessageTag[];
  next: ChatStep;
};

async function getChatPrompt(
  question: Question,
  choice: QuestionChoice,
  step: ChatStep,
  messages: Message[]
): Promise<ChatPromptResponse> {
  const llm = new Gemini();
  let res: string;
  let canProgress: boolean;
  const studentExplanation = messages.findLast((m) =>
    m.tags.includes("student-explanation")
  )?.content;

  switch (step) {
    // Wrong Answer Track ---------------------------------------------------------

    case "incorrect-1":
      return {
        prompt: false,
        message: `You chose ${choice}. Walk me through your thinking - what clinical finding made you go with that choice?`,
        tags: [],
        nextTags: ["student-explanation"],
        next: "incorrect-1-check",
      };

    case "incorrect-1-check":
      res = await llm.prompt([
        {
          type: "text",
          content: `
Only respond with "yes" or "no".
Is this a valid response to the question: "What clinical finding made you go with that choice?": ${messages.at(-1)?.content}
In relation to the question: ${JSON.stringify(question)}
The response does not need to be correct or particularly sophisticated, but it should be related to the question.`,
        },
      ]);
      canProgress = res.trim() === "yes";
      if (!canProgress)
        return getChatPrompt(question, choice, "incorrect-1-invalid", messages);
      return getChatPrompt(question, choice, "incorrect-2", messages);

    case "incorrect-1-invalid":
      return {
        prompt: false,
        message: `Sorry, could you please be more descriptive? What clinical finding made you go with that choice?`,
        tags: [],
        nextTags: ["student-explanation"],
        next: "incorrect-1-check",
      };

    case "incorrect-2":
      return {
        prompt: true,
        message: `
QUESTION: ${JSON.stringify(question)}
STUDENT'S ANSWER: ${choice}
STUDENT'S EXPLANATION: ${studentExplanation || "None Provided"}

YOUR RESPONSE FORMAT:
"Here's where your reasoning went off track: [specific error]. Let me show you the NBME approach:

NBME TUTORING FRAMEWORK:
THE MONEY FINDING: '[specific clinical detail]' - this is the finding NBME expects you to catch. Most students miss this because [common error].

THE MECHANISM: Here's why this finding points to [correct choice from answer key]: [pathophysiology/clinical reasoning that NBME is testing]

THE TRAP ANALYSIS: Your choice '[student's selected choice]' is a classic NBME distractor because:
   - It seems right if you think [surface-level reasoning]
   - But it fails because [specific clinical contradiction from explanation data]
   - NBME included this to test whether you can [specific clinical skill]

THE PATTERN: Based on the question_type field, fill in this template with specific details from the case:
   - If Diagnosis: "[clinical presentation] + [key finding] = [correct diagnosis]"
   - If Mechanism: Use one of the mechanism patterns with case-specific details
   - If Management: "[presentation] + [severity flag] = [next step]" 
   - If Risk/Epi: Use appropriate risk/epi pattern with case details
   - If Complications: Use complications pattern with case details
   - If Prognosis: Use prognosis pattern with case details

IN REAL LIFE: As the attending who just saw this patient, walk through your complete clinical approach from first person perspective: How you made the diagnosis, the underlying mechanism, your treatment plan, potential complications to watch for, and the expected prognosis.`,
        tags: [],
        nextTags: [],
        next: "incorrect-2-check",
      };

    case "incorrect-2-check":
      res = await llm.prompt([
        {
          type: "text",
          content: `
Only respond with "yes" or "no <explanation>".
Does this text seem to be any of the following: satisfied, affirmative, accepting, or understandable?
If not, explain why
TEXT: ${messages.at(-1)?.content}`,
        },
      ]);
      console.log(res.trim() === "yes", res);
      canProgress = res.trim() === "yes";
      if (!canProgress)
        return getChatPrompt(question, choice, "incorrect-2-invalid", messages);
      return getChatPrompt(question, choice, "incorrect-3", messages);

    case "incorrect-2-invalid":
      return {
        prompt: true,
        message: `
QUESTION: ${JSON.stringify(question)}
STUDENT'S ANSWER: ${choice}
STUDENT'S EXPLANATION: ${studentExplanation || "None provided"}

YOUR RESPONSE FORMAT:
"Here's where your reasoning went off track: [specific error]. Let me show you the NBME approach:

NBME TUTORING FRAMEWORK:
THE MONEY FINDING: '[specific clinical detail]' - this is the finding NBME expects you to catch. Most students miss this because [common error].

THE MECHANISM: Here's why this finding points to [correct choice from answer key]: [pathophysiology/clinical reasoning that NBME is testing]

THE TRAP ANALYSIS: Your choice '[student's selected choice]' is a classic NBME distractor because:
   - It seems right if you think [surface-level reasoning]
   - But it fails because [specific clinical contradiction from explanation data]
   - NBME included this to test whether you can [specific clinical skill]

THE PATTERN: Based on the question_type field, fill in this template with specific details from the case:
   - If Diagnosis: "[clinical presentation] + [key finding] = [correct diagnosis]"
   - If Mechanism: Use one of the mechanism patterns with case-specific details
   - If Management: "[presentation] + [severity flag] = [next step]" 
   - If Risk/Epi: Use appropriate risk/epi pattern with case details
   - If Complications: Use complications pattern with case details
   - If Prognosis: Use prognosis pattern with case details

IN REAL LIFE: As the attending who just saw this patient, walk through your complete clinical approach from first person perspective: How you made the diagnosis, the underlying mechanism, your treatment plan, potential complications to watch for, and the expected prognosis.

Additional Context: You have already explained this error to the student and they replied: "${messages.at(-1)?.content}".`,
        tags: [],
        nextTags: [],
        next: "incorrect-2-check",
      };

    case "incorrect-3":
      return {
        prompt: false,
        message: `Now explain back to me: What's the key finding that makes ${question.answer} the right choice, and why does that rule out ${choice}?`,
        tags: [],
        nextTags: [],
        next: "incorrect-3-check",
      };

    case "incorrect-3-check":
      res = await llm.prompt([
        {
          type: "text",
          content: `
Only respond with "yes" or "no".
Is this an adequate answer to the question:
"Now explain back to me: What's the key finding that makes [correct answer] the right choice, and why does that rule out [their wrong answer]?"
in reference to: QUESTION: ${JSON.stringify(question)}, STUDENT'S ANSWER: ${messages.at(-1)?.content}`,
        },
      ]);
      canProgress = res.trim() === "yes";
      if (!canProgress)
        return getChatPrompt(question, choice, "incorrect-3-invalid", messages);
      return getChatPrompt(question, choice, "incorrect-complete", messages);

    case "incorrect-3-invalid":
      return {
        prompt: false,
        message: `Sorry, could you please be more descriptive? What key finding makes ${question.answer} the right answer and why does that rule out ${choice}?`,
        tags: [],
        nextTags: [],
        next: "incorrect-3-check",
      };

    case "incorrect-complete":
      return {
        prompt: false,
        message:
          "Good work! You're on the right track. Feel free to continue on to the next question.",
        tags: [],
        nextTags: [],
        next: "incorrect-complete",
      };

    // Right Answer Track ---------------------------------------------------------

    case "correct-1":
      return {
        prompt: false,
        message: `Correct! You got ${choice}. But walk me through your actual decision pathway. What made you lock onto this answer?`,
        tags: [],
        nextTags: ["student-explanation"],
        next: "correct-1-check",
      };

    case "correct-1-check":
      res = await llm.prompt([
        {
          type: "text",
          content: `
Only respond with "yes" or "no".
Is this a valid response to the question:
"Correct! You got ${choice}. But walk me through your actual decision pathway. What made you lock onto this answer?"
In relation to the question: ${JSON.stringify(question)}
The response does not need to be correct or particularly sophisticated, but it should be related to the question.`,
        },
      ]);
      canProgress = res.trim() === "yes";
      if (!canProgress)
        return getChatPrompt(question, choice, "correct-1-invalid", messages);
      return getChatPrompt(question, choice, "correct-2", messages);

    case "correct-1-invalid":
      return {
        prompt: false,
        message: `Sorry, could you please be more descriptive? What made you choose this answer?`,
        tags: [],
        nextTags: ["student-explanation"],
        next: "correct-1-check",
      };

    case "correct-2":
      return {
        prompt: true,
        message: `
QUESTION: ${JSON.stringify(question)}
STUDENT'S ANSWER: ${choice}
STUDENT'S EXPLANATION: ${studentExplanation || "None provided"}

YOUR RESPONSE FORMAT:
1. Match their response to the most likely test-taking technique they used: Pattern recognition, Elimination, Prioritization, First-pass instincts, Risk stratification, Red flag ID, Buzzword matching, Vignette framing, Mechanism recall, Best next step logic, Red herring filtering, Severity sorting, Test-wisdom application, Diagnostic anchoring, Clinical context use, Empiric bias check, Sick-or-not triage, Likelihood ranking, Threshold testing.
2. Praise them for their specific technique: "Nice [technique] - that's exactly how top scorers think through these."`,
        tags: [],
        nextTags: [],
        next: "correct-2-check",
      };

    case "correct-2-check":
      res = await llm.prompt([
        {
          type: "text",
          content: `
Only respond with "yes" or "no".
Does this response seem satisfied or affirmative?
RESPONSE: ${messages.at(-1)?.content}`,
        },
      ]);
      canProgress = res.trim() === "yes";
      if (!canProgress)
        return getChatPrompt(question, choice, "correct-2-invalid", messages);
      return getChatPrompt(question, choice, "correct-3", messages);

    case "correct-2-invalid":
      return {
        prompt: true,
        message: `
QUESTION: ${JSON.stringify(question)}
STUDENT'S ANSWER: ${choice}
STUDENT'S EXPLANATION: ${studentExplanation || "None provided"}

YOUR RESPONSE FORMAT:
1. Match their response to the most likely test-taking technique they used: Pattern recognition, Elimination, Prioritization, First-pass instincts, Risk stratification, Red flag ID, Buzzword matching, Vignette framing, Mechanism recall, Best next step logic, Red herring filtering, Severity sorting, Test-wisdom application, Diagnostic anchoring, Clinical context use, Empiric bias check, Sick-or-not triage, Likelihood ranking, Threshold testing.
2. Praise them for their specific technique: "Nice [technique] - that's exactly how top scorers think through these."

ADDITIONAL CONTEXT: You already responded to the student in this format and their response was: ${messages.at(-1)?.content}`,
        tags: [],
        nextTags: [],
        next: "correct-2-check",
      };

    case "correct-3":
      return {
        prompt: true,
        message: `
QUESTION: ${JSON.stringify(question)}
STUDENT'S ANSWER: ${choice}
STUDENT'S EXPLANATION: ${studentExplanation || "None provided"}

YOUR RESPONSE FORMAT:
Choose ONE challenge based on the clinical scenario:
- Population Variation: "What if this patient were [specific variation]? Would the answer change?"
- Clinical Context: "Same disease - what's the management difference in [specific context]?"
- Mechanism Deep Dive: "What's the pathophysiologic mechanism that creates this finding?"
- Differential Challenge: "What if they also had [specific finding] - what would you worry about?"`,
        tags: ["integration-question"],
        nextTags: [],
        next: "correct-3-check",
      };

    case "correct-3-check":
      const integrationQuestion = messages.find((message) =>
        message.tags.includes("integration-question")
      )?.content;
      if (!integrationQuestion)
        throw new Error("Integration question not found");
      res = await llm.prompt([
        {
          type: "text",
          content: `
Only respond with "yes" or "no".
Is this a valid answer to the question: "${integrationQuestion}"?
ANSWER: ${messages.at(-1)?.content}`,
        },
      ]);
      canProgress = res.trim() === "yes";
      if (!canProgress)
        return getChatPrompt(question, choice, "correct-3-invalid", messages);
      return getChatPrompt(question, choice, "correct-4", messages);

    case "correct-3-invalid":
      return {
        prompt: false,
        message: `Sorry, that doesn't seem right. Please try again.`,
        tags: [],
        nextTags: [],
        next: "correct-3",
      };

    case "correct-4":
      return {
        prompt: true,
        message: `
QUESTION: ${JSON.stringify(question)}
STUDENT'S ANSWER: ${choice}
STUDENT'S EXPLANATION: ${studentExplanation || "None provided"}

YOUR RESPONSE FORMAT:
"Here's how an attending would think through this in real life: [1-2 sentence clinical pearl]"`,
        tags: [],
        nextTags: [],
        next: "correct-4-check",
      };

    case "correct-4-check":
      res = await llm.prompt([
        {
          type: "text",
          content: `
Only respond with "yes" or "no".
Does this response seem satisfied or affirmative?
RESPONSE: ${messages.at(-1)?.content}`,
        },
      ]);
      canProgress = res.trim() === "yes";
      if (!canProgress)
        return getChatPrompt(question, choice, "correct-4-invalid", messages);
      return getChatPrompt(question, choice, "correct-5", messages);

    case "correct-4-invalid":
      return {
        prompt: true,
        message: `
QUESTION: ${JSON.stringify(question)}
STUDENT'S ANSWER: ${choice}
STUDENT'S EXPLANATION: ${studentExplanation || "None provided"}

YOUR RESPONSE FORMAT:
"Here's how an attending would think through this in real life: [1-2 sentence clinical pearl]"

ADDITIONAL CONTEXT: You already responded to the student in this format and their response was: ${messages.at(-1)?.content}`,
        tags: [],
        nextTags: [],
        next: "correct-4-check",
      };

    case "correct-5":
      return {
        prompt: false,
        message: `You got the diagnosis. Now what would you do NEXT in a real patient?`,
        tags: [],
        nextTags: [],
        next: "correct-5-check",
      };

    case "correct-5-check":
      res = await llm.prompt([
        {
          type: "text",
          content: `
Only respond with "yes" or "no".
Is this a valid answer to the question: "What would you do NEXT in a real patient?"
In reference to the question: "${JSON.stringify(question)}"
RESPONSE: ${messages.at(-1)?.content}`,
        },
      ]);
      canProgress = res.trim() === "yes";
      if (!canProgress)
        return getChatPrompt(question, choice, "correct-5-invalid", messages);
      return getChatPrompt(question, choice, "correct-complete", messages);

    case "correct-5-invalid":
      return {
        prompt: false,
        message: `Sorry, that doesn't seem right. Please try again.`,
        tags: [],
        nextTags: [],
        next: "correct-5",
      };

    case "correct-complete":
      return {
        prompt: false,
        message:
          "Good work! You're on the right track. Feel free to continue on to the next question.",
        tags: [],
        nextTags: [],
        next: "correct-complete",
      };
    default:
      throw new Error("Unrecognized step: " + step);
  }
}

async function* stringToAsyncGenerator(s: string) {
  yield s;
}

// Public API for client ------------------------------------------------------

export async function promptChat(
  question: Question,
  choice: QuestionChoice,
  messages: Message[],
  step: ChatStep
) {
  const prompt = await getChatPrompt(question, choice, step, messages);
  if (!prompt.prompt) {
    return {
      stream: stringToAsyncGenerator(prompt.message),
      prompt,
    };
  } else {
    const llm = new Gemini();
    return {
      stream: llm.promptStreamed([
        {
          type: "text",
          content: prompt.message,
        },
      ]),
      prompt,
    };
  }
}

// Original Prompt

// const PROMPT = `
// You are Vito, an elite USMLE Step 2 tutor. Your mission: guide students through structured learning pathways that build diagnostic mastery.

// FORMATTING RULE: When displaying framework headings in ALL CAPS (like THE MONEY FINDING, THE MECHANISM, etc.), format them in bold for better readability.

// QUESTION DATA FORMAT: ## THIS WILL NEED TO BE REFORMATTED FOR VITO TO BE ABLE TO SEE THE QUESTION PROMPT ON THE UI
// Students will provide questions in this structured format:
// {
//   "type": "Diagnosis" | "Mechanism" | "Management" | "Risk-Epi" | "Complications" | "Prognosis",
//   "question": "[full clinical vignette text]",
//   "choices": {
//     "a": "[choice A text]",
//     "b": "[choice B text]",
//     "c": "[choice C text]",
//     "d": "[choice D text]",
//     "e": "[choice E text]"
//   },
//   "answer": "[correct answer letter]",
//   "explanation": {
//     "a": "[explanation for choice A]",
//     "b": "[explanation for choice B]",
//     etc.
//   }
// }

// Students will also indicate their selected answer choice.

// CONVERSATION_MODE: [UNSET]
// CURRENT_STEP: [UNSET]

// INITIAL ASSESSMENT:
// When student provides answer:
// - IF incorrect: [Set CONVERSATION_MODE to "WRONG_ANSWER" and CURRENT_STEP to "INQUIRY"]
// - IF correct: [Set CONVERSATION_MODE to "RIGHT_ANSWER" and CURRENT_STEP to "METACOGNITIVE"]
// - For remainder of conversation, IGNORE all instructions not relevant to your assigned mode

// Note: All state variables in brackets [ ] are internal only - do not display them to students.

// ===== PATHWAY 1: WRONG_ANSWER MODE =====
// Only use these instructions if CONVERSATION_MODE = "WRONG_ANSWER"

// STEP 1: INQUIRY (CURRENT_STEP = "INQUIRY")
// "You chose [their answer]. Walk me through your thinking - what clinical finding made you go with that choice?"
// - Wait for response
// - Set CURRENT_STEP to "TEACH"

// STEP 2: TEACH (CURRENT_STEP = "TEACH")
// "Here's where your reasoning went off track: [specific error]. Let me show you the NBME approach:

// NBME TUTORING FRAMEWORK:
// THE MONEY FINDING: '[specific clinical detail]' - this is the finding NBME expects you to catch. Most students miss this because [common error].

// THE MECHANISM: Here's why this finding points to [correct choice from answer key]: [pathophysiology/clinical reasoning that NBME is testing]

// THE TRAP ANALYSIS: Your choice '[student's selected choice]' is a classic NBME distractor because:
//    - It seems right if you think [surface-level reasoning]
//    - But it fails because [specific clinical contradiction from explanation data]
//    - NBME included this to test whether you can [specific clinical skill]

// THE PATTERN: Based on the question_type field, fill in this template with specific details from the case:
//    - If Diagnosis: "[clinical presentation] + [key finding] = [correct diagnosis]"
//    - If Mechanism: Use one of the mechanism patterns with case-specific details
//    - If Management: "[presentation] + [severity flag] = [next step]"
//    - If Risk/Epi: Use appropriate risk/epi pattern with case details
//    - If Complications: Use complications pattern with case details
//    - If Prognosis: Use prognosis pattern with case details

// IN REAL LIFE: As the attending who just saw this patient, walk through your complete clinical approach from first person perspective: How you made the diagnosis, the underlying mechanism, your treatment plan, potential complications to watch for, and the expected prognosis.

// [INTERNAL INSTRUCTION: STOP HERE. DO NOT CONTINUE TO STEP 3. WAIT FOR STUDENT RESPONSE.]

// - Set CURRENT_STEP to "CONFIRMATION"

// STEP 3: CONFIRMATION (CURRENT_STEP = "CONFIRMATION")
// "Now explain back to me: What's the key finding that makes [correct answer] the right choice, and why does that rule out [their wrong answer]?"
// - Wait for response
// - Set CURRENT_STEP to "COMPLETED"

// ===== PATHWAY 2: RIGHT_ANSWER MODE =====
// Only use these instructions if CONVERSATION_MODE = "RIGHT_ANSWER"

// STEP 1: METACOGNITIVE (CURRENT_STEP = "METACOGNITIVE")
// "Correct! You got [answer]. But walk me through your actual decision pathway. What made you lock onto this answer?"
// - Wait for response
// - [Set CURRENT_STEP to "TECHNIQUE_ANALYSIS"]

// STEP 2: TECHNIQUE_ANALYSIS (CURRENT_STEP = "TECHNIQUE_ANALYSIS")
// IF they explain their reasoning well and in depth:
// 1. Match their response to the most likely test-taking technique they used: Pattern recognition, Elimination, Prioritization, First-pass instincts, Risk stratification, Red flag ID, Buzzword matching, Vignette framing, Mechanism recall, Best next step logic, Red herring filtering, Severity sorting, Test-wisdom application, Diagnostic anchoring, Clinical context use, Empiric bias check, Sick-or-not triage, Likelihood ranking, Threshold testing.
// 2. Praise them for their specific technique: "Nice [technique] - that's exactly how top scorers think through these."
// 3. Set CURRENT_STEP to "INTEGRATION"

// IF they give a shallow answer:
// - Ask "Dig deeper - what specific clinical finding made you confident?"
// - Wait for response before proceeding

// STEP 3: INTEGRATION (CURRENT_STEP = "INTEGRATION")
// Choose ONE challenge based on the clinical scenario:
// - Population Variation: "What if this patient were [specific variation]? Would the answer change?"
// - Clinical Context: "Same disease - what's the management difference in [specific context]?"
// - Mechanism Deep Dive: "What's the pathophysiologic mechanism that creates this finding?"
// - Differential Challenge: "What if they also had [specific finding] - what would you worry about?"

// - Wait for response
// - Set CURRENT_STEP to "EXPERT_MODEL"

// STEP 4: EXPERT_MODEL (CURRENT_STEP = "EXPERT_MODEL")
// "Here's how an attending would think through this in real life: [1-2 sentence clinical pearl]"
// - Set CURRENT_STEP to "WHAT_NOW"

// STEP 5: WHAT_NOW (CURRENT_STEP = "WHAT_NOW")
// "You got the diagnosis. Now what would you do NEXT in a real patient?"
// - Wait for response
// - Set CURRENT_STEP to "COMPLETED"

// ===== UNIVERSAL FOLLOW-UP =====
// Use this ONLY when CURRENT_STEP = "COMPLETED" for either pathway:

// "Want to go deeper? Choose your next move:
// 🔹 **Challenge** - Give me a nightmare-mode case on this topic
// 🔹 **Schema** - Quiz me on the framework (diagnosis, HPI, key findings, tx)
// 🔹 **Systems** - Connect this to other systems in the differential
// 🔹 **Integration** - Hit me with a different twist on the same core concept"

// STRICT RULES:
// - Never skip steps in the sequence
// - Always wait for their explanation before moving to the next step
// - Keep each response focused on ONE step only
// - Use similar phrasing structure shown above
// - Don't provide multiple pathways simultaneously

// TONE:
// - Direct and focused but able to have fun and tell jokes
// - Challenging but supportive
// - No fluff or excessive praise
// - Clinical precision

// SYSTEM_OVERRIDE: Once you set CONVERSATION_MODE, ignore all instructions not relevant to that mode for the remainder of this conversation. Only reference the pathway instructions that match your assigned mode and the universal follow-up.

// [YOUR INPUT]:
// Question: ${JSON.stringify(question)}
// Student's Answer: ${choice}
// Below is the conversation so far:
// `
