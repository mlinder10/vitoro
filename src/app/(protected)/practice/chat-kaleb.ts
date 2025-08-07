"use server";

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
  | "correct-complete"
  // universal follow-up
  | "follow-up-menu"
  | "follow-up-challenge"
  | "follow-up-schema"
  | "follow-up-systems"
  | "follow-up-integration";

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
  error?: string;
};

// Separate validation functions
class ValidationService {
  private llm = new Gemini();

  async validateResponse(
    prompt: string
  ): Promise<{ valid: boolean; error?: string }> {
    try {
      const res = await this.llm.prompt([
        {
          type: "text",
          content: prompt,
        },
      ]);

      const cleanResponse = res.trim().toLowerCase();
      return {
        valid: cleanResponse === "yes" || cleanResponse.startsWith("yes"),
      };
    } catch (error) {
      console.error("LLM validation failed:", error);
      return {
        valid: false,
        error: "Validation service unavailable. Please try again.",
      };
    }
  }

  async validateExplanation(
    question: Question,
    choice: QuestionChoice,
    userResponse: string
  ): Promise<{ valid: boolean; error?: string }> {
    const prompt = `
Only respond with "yes" or "no".
Is this a valid response to the question: "What clinical finding made you go with that choice?": ${userResponse}
In relation to the question: "${question.question}"
and choice: "${question.choices[choice]}"
The response does not need to be correct or particularly sophisticated, but it should be related to the question.`;

    return this.validateResponse(prompt);
  }

  async validateSatisfaction(
    userResponse: string
  ): Promise<{ valid: boolean; error?: string }> {
    const prompt = `
Only respond with "yes" or "no".
Does this text seem to be any of the following: satisfied, affirmative, accepting, or understandable?
TEXT: ${userResponse}`;

    return this.validateResponse(prompt);
  }

  async validateIntegrationAnswer(
    integrationQuestion: string,
    userResponse: string
  ): Promise<{ valid: boolean; error?: string }> {
    const prompt = `
Only respond with "yes" or "no".
Is this a valid answer to the question: "${integrationQuestion}"?
ANSWER: ${userResponse}`;

    return this.validateResponse(prompt);
  }

  async validateNextStepAnswer(
    question: Question,
    userResponse: string
  ): Promise<{ valid: boolean; error?: string }> {
    const prompt = `
Only respond with "yes" or "no".
Is this a valid answer to the question: "What would you do NEXT in a real patient?"
In reference to the question: "${question.question}"
RESPONSE: ${userResponse}`;

    return this.validateResponse(prompt);
  }
}

// Step definitions - each step knows its own logic
class StepDefinitions {
  private validator = new ValidationService();

  // Helper to get student explanation from messages
  private getStudentExplanation(messages: Message[]): string {
    return (
      messages.findLast((m) => m.tags.includes("student-explanation"))
        ?.content || "None provided"
    );
  }

  // Helper to get integration question from messages
  private getIntegrationQuestion(messages: Message[]): string {
    const question = messages.find((message) =>
      message.tags.includes("integration-question")
    )?.content;
    if (!question) {
      throw new Error("Integration question not found");
    }
    return question;
  }

  // Helper to get last user message
  private getLastUserMessage(messages: Message[]): string {
    const lastMessage = messages.at(-1);
    if (!lastMessage) {
      throw new Error("No user message found");
    }
    return lastMessage.content;
  }

  async getStepResponse(
    step: ChatStep,
    question: Question,
    choice: QuestionChoice,
    messages: Message[]
  ): Promise<ChatPromptResponse> {
    try {
      switch (step) {
        // INCORRECT TRACK
        case "incorrect-1":
          return {
            prompt: false,
            message: `You chose ${choice}. Walk me through your thinking - what clinical finding made you go with that choice?`,
            tags: [],
            nextTags: ["student-explanation"],
            next: "incorrect-1-check",
          };

        case "incorrect-1-check": {
          const userResponse = this.getLastUserMessage(messages);
          const validation = await this.validator.validateExplanation(
            question,
            choice,
            userResponse
          );

          if (validation.error) {
            return {
              prompt: false,
              message: validation.error,
              tags: [],
              nextTags: ["student-explanation"],
              next: "incorrect-1-check",
              error: validation.error,
            };
          }

          if (!validation.valid) {
            return {
              prompt: false,
              message: `Sorry, it seems like your response was vague or unrelated to the question. Please try again. What clinical finding made you go with that choice?`,
              tags: [],
              nextTags: ["student-explanation"],
              next: "incorrect-1-check",
            };
          }

          // Valid response - move to combined teaching + prompt step
          return {
            prompt: true,
            message: this.getIncorrectTeachingWithPrompt(
              question,
              choice,
              this.getStudentExplanation(messages)
            ),
            tags: [],
            nextTags: [],
            next: "incorrect-3-check",
          };
        }

        case "incorrect-2-check": {
          const userResponse = this.getLastUserMessage(messages);
          const validation =
            await this.validator.validateSatisfaction(userResponse);

          if (validation.error) {
            return {
              prompt: true,
              message: this.getIncorrectTeachingWithPrompt(
                question,
                choice,
                this.getStudentExplanation(messages),
                userResponse
              ),
              tags: [],
              nextTags: [],
              next: "incorrect-3-check",
              error: validation.error,
            };
          }

          if (!validation.valid) {
            return {
              prompt: true,
              message: this.getIncorrectTeachingWithPrompt(
                question,
                choice,
                this.getStudentExplanation(messages),
                userResponse
              ),
              tags: [],
              nextTags: [],
              next: "incorrect-3-check",
            };
          }

          // This case should not be reached since we skip incorrect-2-check
          throw new Error(
            "incorrect-2-check should not be reached with new flow"
          );
        }

        case "incorrect-3-check": {
          const userResponse = this.getLastUserMessage(messages);
          const prompt = `
Only respond with "yes" or "no".
Is this an adequate answer to the question:
"Now explain back to me: What's the key finding that makes [correct answer] the right choice, and why does that rule out [their wrong answer]?"
in reference to: QUESTION: ${JSON.stringify(question)}, STUDENT'S ANSWER: ${userResponse}`;

          const validation = await this.validator.validateResponse(prompt);

          if (validation.error) {
            return {
              prompt: false,
              message: validation.error,
              tags: [],
              nextTags: [],
              next: "incorrect-3-check",
              error: validation.error,
            };
          }

          if (!validation.valid) {
            return {
              prompt: false,
              message: `Sorry, it seems like your response was vague or unrelated to the question. Please try again. What key finding makes ${question.answer} the right answer and why does that rule out ${choice}?`,
              tags: [],
              nextTags: [],
              next: "incorrect-3-check",
            };
          }

          return {
            prompt: false,
            message:
              "Good work! You're on the right track. Feel free to continue on to the next question.",
            tags: [],
            nextTags: [],
            next: "follow-up-menu",
          };
        }

        // CORRECT TRACK
        case "correct-1":
          return {
            prompt: false,
            message: `Correct! You got ${choice}. But walk me through your actual decision pathway. What made you lock onto this answer?`,
            tags: [],
            nextTags: ["student-explanation"],
            next: "correct-1-check",
          };

        case "correct-1-check": {
          const userResponse = this.getLastUserMessage(messages);
          const validation = await this.validator.validateExplanation(
            question,
            choice,
            userResponse
          );

          if (validation.error) {
            return {
              prompt: false,
              message: validation.error,
              tags: [],
              nextTags: ["student-explanation"],
              next: "correct-1-check",
              error: validation.error,
            };
          }

          if (!validation.valid) {
            return {
              prompt: false,
              message: `Sorry, it seems like your response was vague or unrelated to the question. Please try again. What made you choose this answer?`,
              tags: [],
              nextTags: ["student-explanation"],
              next: "correct-1-check",
            };
          }

          // Valid response - move to combined technique praise + integration challenge
          return {
            prompt: true,
            message: this.getCorrectTechniqueWithChallenge(
              question,
              choice,
              this.getStudentExplanation(messages)
            ),
            tags: ["integration-question"],
            nextTags: [],
            next: "correct-3-check",
          };
        }

        case "correct-2-check": {
          const userResponse = this.getLastUserMessage(messages);
          const validation =
            await this.validator.validateSatisfaction(userResponse);

          if (validation.error) {
            return {
              prompt: true,
              message: this.getCorrectTechniqueWithChallenge(
                question,
                choice,
                this.getStudentExplanation(messages),
                userResponse
              ),
              tags: ["integration-question"],
              nextTags: [],
              next: "correct-3-check",
              error: validation.error,
            };
          }

          if (!validation.valid) {
            return {
              prompt: true,
              message: this.getCorrectTechniqueWithChallenge(
                question,
                choice,
                this.getStudentExplanation(messages),
                userResponse
              ),
              tags: ["integration-question"],
              nextTags: [],
              next: "correct-3-check",
            };
          }

          // This case should not be reached since we skip correct-2-check
          throw new Error(
            "correct-2-check should not be reached with new flow"
          );
        }

        case "correct-3-check": {
          const userResponse = this.getLastUserMessage(messages);
          const integrationQuestion = this.getIntegrationQuestion(messages);
          const validation = await this.validator.validateIntegrationAnswer(
            integrationQuestion,
            userResponse
          );

          if (validation.error) {
            return {
              prompt: false,
              message: validation.error,
              tags: [],
              nextTags: [],
              next: "correct-3-check",
              error: validation.error,
            };
          }

          if (!validation.valid) {
            return {
              prompt: false,
              message: `Sorry, that doesn't seem right. Please try again.`,
              tags: [],
              nextTags: [],
              next: "correct-3-check",
            };
          }

          return {
            prompt: true,
            message: this.getExpertModelPrompt(
              question,
              choice,
              this.getStudentExplanation(messages)
            ),
            tags: [],
            nextTags: [],
            next: "correct-4-check",
          };
        }

        case "correct-4-check": {
          const userResponse = this.getLastUserMessage(messages);
          const validation =
            await this.validator.validateSatisfaction(userResponse);

          if (validation.error) {
            return {
              prompt: true,
              message: this.getExpertModelPrompt(
                question,
                choice,
                this.getStudentExplanation(messages),
                userResponse
              ),
              tags: [],
              nextTags: [],
              next: "correct-4-check",
              error: validation.error,
            };
          }

          if (!validation.valid) {
            return {
              prompt: true,
              message: this.getExpertModelPrompt(
                question,
                choice,
                this.getStudentExplanation(messages),
                userResponse
              ),
              tags: [],
              nextTags: [],
              next: "correct-4-check",
            };
          }

          return {
            prompt: false,
            message: `You got the integration diagnosis we just discussed. Now what would you do NEXT in a real patient with this more complex presentation?`,
            tags: [],
            nextTags: [],
            next: "correct-5-check",
          };
        }

        case "correct-5-check": {
          const userResponse = this.getLastUserMessage(messages);
          const validation = await this.validator.validateNextStepAnswer(
            question,
            userResponse
          );

          if (validation.error) {
            return {
              prompt: false,
              message: validation.error,
              tags: [],
              nextTags: [],
              next: "correct-5-check",
              error: validation.error,
            };
          }

          if (!validation.valid) {
            return {
              prompt: false,
              message: `Sorry, that doesn't seem right. Please try again.`,
              tags: [],
              nextTags: [],
              next: "correct-5-check",
            };
          }

          return {
            prompt: false,
            message:
              "Good work! You're on the right track. Feel free to continue on to the next question.",
            tags: [],
            nextTags: [],
            next: "follow-up-menu",
          };
        }

        // UNIVERSAL FOLLOW-UP
        case "follow-up-menu":
          return {
            prompt: false,
            message: `Want to go deeper? Choose your next move:
🔹 **Challenge** - Give me a nightmare-mode case on this topic
🔹 **Schema** - Quiz me on the framework (diagnosis, HPI, key findings, tx)
🔹 **Systems** - Connect this to other systems in the differential
🔹 **Integration** - Hit me with a different twist on the same core concept`,
            tags: [],
            nextTags: [],
            next: "follow-up-menu",
          };

        case "follow-up-challenge":
          return {
            prompt: true,
            message: this.getFollowUpChallengePrompt(question, choice),
            tags: [],
            nextTags: [],
            next: "follow-up-menu",
          };

        case "follow-up-schema":
          return {
            prompt: true,
            message: this.getFollowUpSchemaPrompt(question, choice),
            tags: [],
            nextTags: [],
            next: "follow-up-menu",
          };

        case "follow-up-systems":
          return {
            prompt: true,
            message: this.getFollowUpSystemsPrompt(question, choice),
            tags: [],
            nextTags: [],
            next: "follow-up-menu",
          };

        case "follow-up-integration":
          return {
            prompt: true,
            message: this.getFollowUpIntegrationPrompt(question, choice),
            tags: [],
            nextTags: [],
            next: "follow-up-menu",
          };

        // COMPLETE STATES
        case "incorrect-complete":
        case "correct-complete":
          return {
            prompt: false,
            message:
              "Good work! You're on the right track. Feel free to continue on to the next question.",
            tags: [],
            nextTags: [],
            next: step,
          };

        default:
          throw new Error(`Unrecognized step: ${step}`);
      }
    } catch (error) {
      console.error(`Error in step ${step}:`, error);
      return {
        prompt: false,
        message: "Something went wrong. Please try again.",
        tags: [],
        nextTags: [],
        next: step,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private getIncorrectTeachingWithPrompt(
    question: Question,
    choice: QuestionChoice,
    studentExplanation: string,
    previousResponse?: string
  ): string {
    const basePrompt = `
QUESTION: ${JSON.stringify(question)}
STUDENT'S ANSWER: ${choice}
STUDENT'S EXPLANATION: ${studentExplanation}

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

Now explain back to me: What's the key finding that makes ${question.answer} the right choice, and why does that rule out ${choice}?

If this was not helpful and you need a better explanation, let me know and we can discuss further."`;

    if (previousResponse) {
      return (
        basePrompt +
        `\n\nAdditional Context: You have already explained this error to the student and they replied: "${previousResponse}".`
      );
    }

    return basePrompt;
  }

  private getFollowUpChallengePrompt(
    question: Question,
    choice: QuestionChoice
  ): string {
    return `
ORIGINAL QUESTION: ${JSON.stringify(question)}
CORRECT ANSWER: ${choice}

YOUR TASK: Generate a high-difficulty, edge-case clinical vignette that tests advanced reasoning, traps, or atypical presentations related to this topic.

REQUIREMENTS:
- Create a nightmare-mode case with unusual presentation or complicating factors
- Include subtle findings that could mislead students
- Test advanced clinical reasoning beyond basic pattern recognition
- Make it challenging but fair - should be solvable with deep understanding
- Include realistic distractors that test common misconceptions

FORMAT: Present as a complete clinical vignette with multiple choice answers.`;
  }

  private getFollowUpSchemaPrompt(
    question: Question,
    choice: QuestionChoice
  ): string {
    return `
ORIGINAL QUESTION: ${JSON.stringify(question)}
CORRECT ANSWER: ${choice}

YOUR TASK: Quiz the user on the diagnostic framework for this topic — including etiology, HPI clues, diagnostic findings, and treatment.

REQUIREMENTS:
- Ask about the systematic approach to this diagnosis
- Cover: etiology, history/presentation patterns, physical exam findings, diagnostic tests, treatment approach
- Test their understanding of the complete clinical framework
- Focus on the step-by-step thinking process, not just facts
- Help them build a mental schema they can apply to similar cases

FORMAT: Ask 3-4 focused questions that build the complete diagnostic framework.`;
  }

  private getFollowUpSystemsPrompt(
    question: Question,
    choice: QuestionChoice
  ): string {
    return `
ORIGINAL QUESTION: ${JSON.stringify(question)}
CORRECT ANSWER: ${choice}

YOUR TASK: Present a related case or concept from another organ system commonly in the differential or comorbid with the current topic.

REQUIREMENTS:
- Choose a different organ system that connects to this diagnosis
- Show how similar presentations can arise from different systems
- Highlight key differentiating features between systems
- Teach systems-based thinking and cross-system connections
- Make the connection clinically meaningful, not just academic

FORMAT: Present a related case that tests their ability to differentiate between systems.`;
  }

  private getFollowUpIntegrationPrompt(
    question: Question,
    choice: QuestionChoice
  ): string {
    return `
ORIGINAL QUESTION: ${JSON.stringify(question)}
CORRECT ANSWER: ${choice}

YOUR TASK: Modify the original case by changing age, comorbidity, acuity, or setting to reinforce application of the same core principle in a new context.

REQUIREMENTS:
- Keep the same underlying pathophysiology/principle
- Change the clinical context (age group, comorbidities, setting, acuity)
- Show how the same disease presents differently in different contexts
- Test their ability to adapt their knowledge to new situations
- Maintain the core learning objective while adding complexity

FORMAT: Present the modified scenario and ask how their approach would change.`;
  }

  private getCorrectTechniqueWithChallenge(
    question: Question,
    choice: QuestionChoice,
    studentExplanation: string,
    previousResponse?: string
  ): string {
    const basePrompt = `
QUESTION: ${JSON.stringify(question)}
STUDENT'S ANSWER: ${choice}
STUDENT'S EXPLANATION: ${studentExplanation}

YOUR RESPONSE FORMAT:
1. Match their response to the most likely test-taking technique they used: Pattern recognition, Elimination, Prioritization, First-pass instincts, Risk stratification, Red flag ID, Buzzword matching, Vignette framing, Mechanism recall, Best next step logic, Red herring filtering, Severity sorting, Test-wisdom application, Diagnostic anchoring, Clinical context use, Empiric bias check, Sick-or-not triage, Likelihood ranking, Threshold testing.
2. Praise them for their specific technique: "Nice [technique] - that's exactly how top scorers think through these."
3. Based on the question type, ask this specific challenge:
   - If Diagnosis question: "What if this patient also had [add one specific additional finding that would suggest a complication or related condition]? What would you worry about?"
   - If Mechanism question: "How would you explain this mechanism to a patient in simple terms, and why does understanding it matter for their treatment?"
   - If Management question: "What if this same patient were [elderly/pregnant/had renal failure/had heart failure] - would your management change?"
   - If Risk/Epi question: "Given this risk factor, what specific screening, prevention, or counseling would you recommend to this patient?"
   - If Complications question: "What's the most serious downstream effect if this complication progresses untreated?"
   - If Prognosis question: "What single factor would most dramatically change this patient's prognosis?"`;

    if (previousResponse) {
      return (
        basePrompt +
        `\n\nADDITIONAL CONTEXT: You already responded to the student in this format and their response was: ${previousResponse}`
      );
    }

    return basePrompt;
  }

  private getExpertModelPrompt(
    question: Question,
    choice: QuestionChoice,
    studentExplanation: string,
    previousResponse?: string
  ): string {
    const basePrompt = `
QUESTION: ${JSON.stringify(question)}
STUDENT'S ANSWER: ${choice}
STUDENT'S EXPLANATION: ${studentExplanation}

YOUR RESPONSE FORMAT:
"Here's how an attending would think through this in real life: [1-2 sentence clinical pearl]"`;

    if (previousResponse) {
      return (
        basePrompt +
        `\n\nADDITIONAL CONTEXT: You already responded to the student in this format and their response was: ${previousResponse}`
      );
    }

    return basePrompt;
  }
}

// Main function - now much cleaner
async function getChatPrompt(
  question: Question,
  choice: QuestionChoice,
  step: ChatStep,
  messages: Message[]
): Promise<ChatPromptResponse> {
  const stepDefinitions = new StepDefinitions();
  return stepDefinitions.getStepResponse(step, question, choice, messages);
}

async function* stringToAsyncGenerator(s: string) {
  yield s;
}

// System prompt that defines Vito's role and persona for the entire conversation
const VITO_SYSTEM_PROMPT = `
You are Vito, an elite USMLE Step 2 tutor. Your mission: guide students through structured learning pathways that build diagnostic mastery.

FORMATTING RULE: When displaying framework headings in ALL CAPS (like THE MONEY FINDING, THE MECHANISM, etc.), format them in bold for better readability.

TONE:
- Direct and focused but able to have fun and tell jokes
- Challenging but supportive  
- No fluff or excessive praise
- Clinical precision

TEACHING PHILOSOPHY:
- Focus on the "money findings" that separate high scorers from average test-takers
- Teach NBME patterns and trap analysis
- Connect test-taking strategy to real clinical thinking
- Build confidence through structured learning progressions
- Always tie concepts back to actual patient care

You maintain this persona and approach throughout all interactions with students.
`;

// Public API - unchanged
export async function promptChat(
  question: Question,
  choice: QuestionChoice,
  messages: Message[],
  step: ChatStep
) {
  const prompt = await getChatPrompt(question, choice, step, messages);

  if (prompt.error) {
    // Handle errors gracefully
    return {
      stream: stringToAsyncGenerator(prompt.message),
      prompt,
    };
  }

  if (!prompt.prompt) {
    return {
      stream: stringToAsyncGenerator(prompt.message),
      prompt,
    };
  } else {
    const llm = new Gemini();
    try {
      return {
        stream: llm.promptStreamed([
          {
            type: "text",
            content: VITO_SYSTEM_PROMPT + "\n\n" + prompt.message,
          },
        ]),
        prompt,
      };
    } catch (error) {
      console.error("LLM streaming failed:", error);
      return {
        stream: stringToAsyncGenerator(
          "I'm having trouble connecting to the AI service. Please try again."
        ),
        prompt: {
          ...prompt,
          error: "LLM service unavailable",
        },
      };
    }
  }
}

// IMPLEMENTATION NOTES:
/*
KEY IMPROVEMENTS MADE:

1. ELIMINATED BUGS:
   - Fixed infinite recursive loops that could crash the system
   - Added comprehensive error handling for all LLM calls
   - Resolved inconsistent message access patterns
   - Fixed control flow issues with proper state management

2. STREAMLINED CONVERSATION FLOW:
   - INCORRECT PATH: Now 3 steps instead of 5
     * Student explains → Combined teaching + prompt → Student demonstrates understanding
   - CORRECT PATH: Now 4 steps instead of 6  
     * Student explains → Combined praise + challenge → Expert insight → Next steps

3. IMPROVED USER EXPERIENCE:
   - Students always know what to do next (no hanging conversations)
   - Clear escape hatches ("if this was not helpful...")
   - Explicit references to integration scenarios
   - More specific, actionable LLM prompts

4. ROBUST ERROR HANDLING:
   - All LLM calls wrapped in try-catch
   - Graceful degradation when services fail
   - Clear error messages for debugging
   - System continues working even during failures

5. BETTER EDUCATIONAL OUTCOMES:
   - More specific integration challenges based on question type
   - Clearer learning objectives for each step
   - Better connection between teaching and application
   - More clinically relevant follow-up questions

USAGE:
- Public API remains unchanged: promptChat(question, choice, messages, step)
- Error handling is built-in and graceful
- All existing integrations should work without modification
- New conversation flows are more efficient and user-friendly

TESTING RECOMMENDATIONS:
- Test error scenarios (LLM service down, invalid responses)
- Verify conversation flows for both correct/incorrect paths
- Check that integration challenges match question types appropriately
- Validate that all validation steps work as expected
*/
