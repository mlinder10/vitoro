import {
  qbankSessions,
  stepOneNbmeQuestions,
  stepTwoNbmeQuestions,
  answeredStepOneNbmes,
  answeredStepTwoNbmes,
  stepOneFoundationalQuestions,
  stepTwoFoundationalQuestions,
  stepOneFoundationalFollowUps,
  stepTwoFoundationalFollowUps,
  answeredStepOneFoundationals,
  answeredStepTwoFoundationals,
  admins,
  reviewQuestions,
  users,
} from "@/db";
import { InferSelectModel } from "drizzle-orm";

// User

export type User = InferSelectModel<typeof users>;
export type Admin = InferSelectModel<typeof admins>;

// Review

export type ReviewQuestion = InferSelectModel<typeof reviewQuestions>;

// QBank

export type QBankSession = InferSelectModel<typeof qbankSessions>;

export type StepOneNBMEQuestion = InferSelectModel<typeof stepOneNbmeQuestions>;
export type StepTwoNBMEQuestion = InferSelectModel<typeof stepTwoNbmeQuestions>;
export type NBMEQuestion = StepOneNBMEQuestion | StepTwoNBMEQuestion;

export type AnsweredStepOneNBME = InferSelectModel<typeof answeredStepOneNbmes>;
export type AnsweredStepTwoNBME = InferSelectModel<typeof answeredStepTwoNbmes>;
export type AnsweredNBME = AnsweredStepOneNBME | AnsweredStepTwoNBME;

// Foundational

export type StepOneFoundationalQuestion = InferSelectModel<
  typeof stepOneFoundationalQuestions
>;
export type StepTwoFoundationalQuestion = InferSelectModel<
  typeof stepTwoFoundationalQuestions
>;
export type FoundationalQuestion =
  | StepOneFoundationalQuestion
  | StepTwoFoundationalQuestion;

export type StepOneFoundationalFollowup = InferSelectModel<
  typeof stepOneFoundationalFollowUps
>;
export type StepTwoFoundationalFollowup = InferSelectModel<
  typeof stepTwoFoundationalFollowUps
>;
export type FoundationalFollowup =
  | StepOneFoundationalFollowup
  | StepTwoFoundationalFollowup;

export type AnsweredStepOneFoundational = InferSelectModel<
  typeof answeredStepOneFoundationals
>;
export type AnsweredStepTwoFoundational = InferSelectModel<
  typeof answeredStepTwoFoundationals
>;
export type AnsweredFoundational =
  | AnsweredStepOneFoundational
  | AnsweredStepTwoFoundational;
