import { SubscriptionId } from "@/lib/payment";
import {
  AuditRating,
  Choices,
  LabValue,
  NBMEStep,
  QBankMode,
  QuestionChoice,
  QuestionDifficulty,
  YieldType,
} from "@/types";
import { sql } from "drizzle-orm";
import {
  customType,
  index,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

// Extensions ---------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const float32Array = customType<{
  data: number[];
  config: { dimensions: number };
  configRequired: true;
  driverData: Buffer;
}>({
  dataType(config) {
    return `F32_BLOB(${config.dimensions})`;
  },
  fromDriver(value: Buffer) {
    return Array.from(new Float32Array(value.buffer));
  },
  toDriver(value: number[]) {
    return sql`vector32(${JSON.stringify(value)})`;
  },
});

function jsonType<T>() {
  return customType<{
    data: T;
    configRequired: false;
    driverData: string;
  }>({
    dataType() {
      return `TEXT`;
    },
    fromDriver(value: string) {
      try {
        return JSON.parse(value);
      } catch {
        return value as T;
      }
    },
    toDriver(value: T) {
      return JSON.stringify(value);
    },
  });
}

function json<T>(name: string) {
  return jsonType<T>()(name);
}

const date = customType<{
  data: Date;
  driverData: string;
  configRequired: false;
}>({
  dataType() {
    return "TEXT";
  },
  fromDriver(value: string) {
    return new Date(value.endsWith("Z") ? value : value + "Z");
  },
  toDriver(value: Date) {
    return value.toISOString();
  },
});

const SQL_UUID = sql`(lower(hex(randomblob(16))))`;
const SQL_NOW = sql`(datetime('now'))`;

// Schemas ------------------------------------------------------------------

// users

export const users = sqliteTable("users", {
  id: text("id").primaryKey().default(SQL_UUID).notNull(),
  email: text("email").unique().notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  gradYear: text("grad_year").notNull(),
  exam: json<NBMEStep>("exam").notNull(),
  color: text("color").notNull(),
  password: text("password").notNull(),
  createdAt: date("created_at").default(SQL_NOW),
  // optional
  school: text("school"),
  studyTools: text("study_tools"),
  referral: text("referral"),
});

export const passwordResets = sqliteTable("password_resets", {
  id: text("id").primaryKey().default(SQL_UUID).notNull(),
  code: text("code").unique().notNull(),
  validUntil: date("valid_until").notNull(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});

export const admins = sqliteTable("admins", {
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: date("created_at").default(SQL_NOW).notNull(),
});

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey().default(SQL_UUID).notNull(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: date("created_at").default(SQL_NOW).notNull(),
  expiresAt: date("expires_at").notNull(),
  subscriptionId: json<SubscriptionId>("subscription_id").notNull(),
  isRenewable: json<boolean>("is_renewable").default(true).notNull(),
});

// export const alphaApplications = sqliteTable("alpha_applications", {
//   id: text("id").primaryKey().default(SQL_UUID).notNull(),
//   createdAt: date("created_at").default(SQL_NOW).notNull(),
//   approved: json<boolean>("approved").default(false).notNull(),
//   userId: text("user_id")
//     .references(() => users.id, { onDelete: "cascade" })
//     .notNull(),
// });

// export const betaApplications = sqliteTable("beta_applications", {
//   id: text("id").primaryKey().default(SQL_UUID).notNull(),
//   createdAt: date("created_at").default(SQL_NOW).notNull(),
//   approved: json<boolean>("approved").default(false).notNull(),
//   userId: text("user_id")
//     .references(() => users.id, { onDelete: "cascade" })
//     .notNull(),
// });

// nbme questions

export const stepOneNbmeQuestions = sqliteTable("step_one_nbme_questions", {
  id: text("id").primaryKey().default(SQL_UUID).notNull(),
  createdAt: date("created_at").default(SQL_NOW).notNull(),

  systems: json<string[]>("systems").notNull(),
  categories: json<string[]>("categories").notNull(),
  topic: text("topic").notNull(),
  competency: text("competency").notNull(),
  concept: text("concept").notNull(),

  question: text("question").notNull(),
  answer: json<QuestionChoice>("answer").notNull(),
  choices: json<Choices>("choices").notNull(),
  explanations: json<Choices>("explanations").notNull(),
  labValues: json<LabValue[]>("lab_values").notNull(),

  difficulty: json<QuestionDifficulty>("difficulty").notNull(),

  yield: json<YieldType>("yield")
    .default('"Medium"' as YieldType)
    .notNull(),
  rating: json<AuditRating>("rating").notNull(),
  step: json<"Step 1">("step")
    .notNull()
    .default('"Step 1"' as "Step 1"),
});

export const stepTwoNbmeQuestions = sqliteTable("step_two_nbme_questions", {
  id: text("id").primaryKey().default(SQL_UUID).notNull(),
  createdAt: date("created_at").default(SQL_NOW).notNull(),

  system: text("system").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory").notNull(),
  topic: text("topic").notNull(),
  type: text("type").notNull(),

  question: text("question").notNull(),
  answer: json<QuestionChoice>("answer").notNull(),
  choices: json<Choices>("choices").notNull(),
  explanations: json<Choices>("explanations").notNull(),
  labValues: json<LabValue[]>("lab_values").notNull(),

  difficulty: json<QuestionDifficulty>("difficulty").notNull(),

  yield: json<YieldType>("yield")
    .default('"Medium"' as YieldType)
    .notNull(),
  rating: json<AuditRating>("rating").notNull(),
  step: json<"Step 2">("step")
    .notNull()
    .default('"Step 2"' as "Step 2"),
});

export const answeredStepOneNbmes = sqliteTable(
  "answered_step_one_nbmes",
  {
    id: text("id").primaryKey().default(SQL_UUID).notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    questionId: text("question_id")
      .references(() => stepOneNbmeQuestions.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: date("created_at").default(SQL_NOW).notNull(),
    answer: json<QuestionChoice>("answer").notNull(),
  },
  (table) => [
    index("step_one_nbme_answer_user_idx").on(table.userId),
    index("step_one_nbme_answer_question_idx").on(table.questionId),
  ]
);

export const answeredStepTwoNbmes = sqliteTable(
  "answered_step_two_nbmes",
  {
    id: text("id").primaryKey().default(SQL_UUID).notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    questionId: text("question_id")
      .references(() => stepTwoNbmeQuestions.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: date("created_at").default(SQL_NOW).notNull(),
    answer: json<QuestionChoice>("answer").notNull(),
  },
  (table) => [
    index("step_two_nbme_answer_user_idx").on(table.userId),
    index("step_two_nbme_answer_question_idx").on(table.questionId),
  ]
);

export const qbankSessions = sqliteTable("qbank_sessions", {
  id: text("id").primaryKey().default(SQL_UUID).notNull(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: date("created_at").default(SQL_NOW).notNull(),

  name: text("name").notNull(),
  mode: json<QBankMode>("mode").notNull(),
  step: json<NBMEStep>("step").notNull(),

  questionIds: json<string[]>("question_ids").notNull(),
  answers: json<(QuestionChoice | null)[]>("answers").notNull(),
  flaggedQuestionIds: json<string[]>("flagged_questions").notNull(),

  inProgress: json<boolean>("in_progress").default(true).notNull(),
});

// review questions

export const reviewQuestions = sqliteTable(
  "review_questions",
  {
    id: text("id").primaryKey().default(SQL_UUID).notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    questionId: text("question_id")
      // .references(() => questions.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: date("created_at").default(SQL_NOW).notNull(),
    question: text("question").notNull(),
    answerCriteria: json<string[]>("answer_criteria").notNull(),
    passed: json<boolean>("passed").default(false).notNull(),
  },
  (table) => [
    index("review_user_idx").on(table.userId),
    index("review_question_idx").on(table.questionId),
  ]
);

// foundational questions

export const stepOneFoundationalQuestions = sqliteTable(
  "step_one_foundational_questions",
  {
    id: text("id").primaryKey().default(SQL_UUID).notNull(),
    subject: text("subject").notNull(),
    topic: text("topic").notNull(),
    subtopic: text("subtopic").notNull(),

    question: text("question").notNull(),
    diagnosis: text("diagnosis").notNull(),
    step: json<"Step 1">("step")
      .notNull()
      .default('"Step 1"' as "Step 1"),
  }
);

export const stepOneFoundationalFollowUps = sqliteTable(
  "step_one_foundational_followups",
  {
    id: text("id").primaryKey().default(SQL_UUID).notNull(),
    foundationalQuestionId: text("foundational_question_id")
      .references(() => stepOneFoundationalQuestions.id, {
        onDelete: "cascade",
      })
      .notNull(),

    question: text("question").notNull(),
    choices: json<Choices>("choices").notNull(),
    explanations: json<Choices>("explanations").notNull(),
    answer: json<QuestionChoice>("answer").notNull(),

    isIntegration: json<boolean>("is_integration").notNull(),
    axis: text("axis").notNull(),
    step: json<"Step 1">("step")
      .notNull()
      .default('"Step 1"' as "Step 1"),
  }
);

export const stepTwoFoundationalQuestions = sqliteTable(
  "step_two_foundational_questions",
  {
    id: text("id").primaryKey().default(SQL_UUID).notNull(),
    topic: text("topic").notNull(),
    shelf: text("shelf").notNull(),
    system: text("system").notNull(),

    question: text("question").notNull(),
    expectedAnswer: text("expected_answer").notNull(),
    step: json<"Step 2">("step")
      .notNull()
      .default('"Step 2"' as "Step 2"),
  }
);

export const stepTwoFoundationalFollowUps = sqliteTable(
  "step_two_foundational_followups",
  {
    id: text("id").primaryKey().default(SQL_UUID).notNull(),
    foundationalQuestionId: text("foundational_question_id")
      .references(() => stepTwoFoundationalQuestions.id, {
        onDelete: "cascade",
      })
      .notNull(),
    question: text("question").notNull(),
    choices: json<Choices>("choices").notNull(),
    explanations: json<Choices>("explanations").notNull(),
    answer: json<QuestionChoice>("answer").notNull(),
    axis: text("axis").notNull(),
    step: json<"Step 2">("step")
      .notNull()
      .default('"Step 2"' as "Step 2"),
  }
);

export const answeredStepOneFoundationals = sqliteTable(
  "answered_step_one_foundational_questions",
  {
    id: text("id").primaryKey().default(SQL_UUID).notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    foundationalQuestionId: text("foundational_question_id")
      .references(() => stepOneFoundationalQuestions.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: date("created_at").default(SQL_NOW).notNull(),
    shortResponse: text("short_response").notNull(),
    answers: json<(QuestionChoice | null)[]>("answers").notNull(),
    isComplete: json<boolean>("is_complete").default(false).notNull(),
    step: json<"Step 1">("step")
      .notNull()
      .default('"Step 1"' as "Step 1"),
  }
);

export const answeredStepTwoFoundationals = sqliteTable(
  "answered_step_two_foundational_questions",
  {
    id: text("id").primaryKey().default(SQL_UUID).notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    foundationalQuestionId: text("foundational_question_id")
      .references(() => stepTwoFoundationalQuestions.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: date("created_at").default(SQL_NOW).notNull(),
    shortResponse: text("short_response").notNull(),
    answers: json<(QuestionChoice | null)[]>("answers").notNull(),
    isComplete: json<boolean>("is_complete").default(false).notNull(),
    step: json<"Step 2">("step")
      .notNull()
      .default('"Step 2"' as "Step 2"),
  }
);

export const prompts = sqliteTable("prompts", {
  id: text("id").primaryKey().default(SQL_UUID).notNull(),
  createdAt: date("created_at").default(SQL_NOW).notNull(),
  prompt: text("prompt").notNull(),
  output: text("output").notNull(),
  inputTokens: integer("input_tokens").notNull(),
  outputTokens: integer("output_tokens").notNull(),
});

export const flashcardFolders = sqliteTable("flashcard_folder", {
  id: text("id").primaryKey().default(SQL_UUID).notNull(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
});

export const flashcards = sqliteTable("flashcards", {
  id: text("id").primaryKey().default(SQL_UUID).notNull(),
  folderId: text("folder_id")
    .references(() => flashcardFolders.id, { onDelete: "cascade" })
    .notNull(),
  front: text("front").notNull(),
  back: text("back").notNull(),
});
