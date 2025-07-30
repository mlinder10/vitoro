import { Gemini } from "@/ai";
import { Question, QuestionChoice } from "@/types";

type ChatStep = "incorrect-1" | "incorrect-2" | "incorrect-3";

export async function promptChat(
  question: Question,
  choice: QuestionChoice,
  step: ChatStep,
  messages: string[]
) {
  const llm = new Gemini();
  let res: string;
  let canProgress: boolean;

  switch (step) {
    case "incorrect-1":
      return {
        prompt: false,
        message: `You chose ${choice}. Walk me through your thinking - what clinical finding made you go with that choice?`,
      };
    case "incorrect-2":
      res = await llm.prompt([
        {
          type: "text",
          content: `Only respond with "yes" or "no". Is this an adequate answer to the question: "What clinical finding made you go with that choice?": ${messages.at(-1)}`,
        },
      ]);
      canProgress = res === "yes";
      if (!canProgress)
        return promptChat(question, choice, "incorrect-1", messages);
      return promptChat(question, choice, "incorrect-3", messages);
    case "incorrect-3":
      return {
        prompt: true,
        message: `
QUESTION: ${JSON.stringify(question)}
STUDENT'S ANSWER: ${choice}
STUDENT'S EXPLANATION: ${messages.at(-1)}

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
        `,
      };
  }
}
