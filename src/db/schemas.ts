import {
  AnyCategory,
  AnySubcategory,
  AuditRating,
  Choices,
  FoundationalFollowupAnswer,
  NBMEStep,
  QBankMode,
  QuestionChoice,
  QuestionDifficulty,
  QuestionType,
  System,
  YieldType,
} from "@/types";
import { sql } from "drizzle-orm";
import { customType, index, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
    driverData: Buffer;
  }>({
    dataType() {
      return `TEXT`;
    },
    fromDriver(value: Buffer) {
      return JSON.parse(value.toString("utf-8"));
    },
    toDriver(value: T) {
      return sql`${JSON.stringify(value)}`;
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

export const questions = sqliteTable(
  "questions",
  {
    id: text("id").primaryKey().default(SQL_UUID).notNull(),
    createdAt: date("created_at").default(SQL_NOW).notNull(),
    creatorId: text("creator_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    system: json<System>("system").notNull(),
    category: json<AnyCategory>("category").notNull(),
    subcategory: json<AnySubcategory>("subcategory").notNull(),
    topic: text("topic").notNull(),
    type: json<QuestionType>("type").notNull(),
    step: json<NBMEStep>("step").notNull(),

    question: text("question").notNull(),
    answer: json<QuestionChoice>("answer").notNull(),
    choices: json<Choices>("choices").notNull(),
    explanations: json<Choices>("explanations").notNull(),

    difficulty: json<QuestionDifficulty>("difficulty").notNull(),

    yield: json<YieldType>("yield")
      .default(JSON.stringify("Medium") as YieldType)
      .notNull(),
    rating: json<AuditRating>("rating").notNull(),
  },
  (table) => [
    index("question_system_idx").on(table.system),
    index("question_category_idx").on(table.category),
    index("question_subcategory_idx").on(table.subcategory),
    index("question_topic_idx").on(table.topic),
    index("question_type_idx").on(table.type),
    index("question_difficulty_idx").on(table.difficulty),
    index("question_step_idx").on(table.step),
  ]
);

export const answeredQuestions = sqliteTable(
  "answered_questions",
  {
    id: text("id").primaryKey().default(SQL_UUID).notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    questionId: text("question_id")
      .references(() => questions.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: date("created_at").default(SQL_NOW).notNull(),
    answer: json<QuestionChoice>("answer").notNull(),
  },
  (table) => [
    index("answer_user_idx").on(table.userId),
    index("answer_question_idx").on(table.questionId),
  ]
);

export const qbankSessions = sqliteTable("qbank_sessions", {
  id: text("id").primaryKey().default(SQL_UUID).notNull(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  mode: json<QBankMode>("mode").notNull(),
  questionIds: json<string[]>("question_ids").notNull(),
  answers: json<(QuestionChoice | null)[]>("answers").notNull(),
  flaggedQuestionIds: json<string[]>("flagged_questions").notNull(),
  createdAt: date("created_at").default(SQL_NOW).notNull(),
  inProgress: json<boolean>("in_progress").default(true).notNull(),
});

export const reviewQuestions = sqliteTable(
  "review_questions",
  {
    id: text("id").primaryKey().default(SQL_UUID).notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    questionId: text("question_id")
      .references(() => questions.id, { onDelete: "cascade" })
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

export const foundationalQuestions = sqliteTable("foundational_questions", {
  id: text("id").primaryKey().default(SQL_UUID).notNull(),
  step: json<NBMEStep>("step").notNull(),
  system: text("system").notNull(),
  topic: text("topic").notNull(),
  question: text("question").notNull(),
  expectedAnswer: text("expected_answer").notNull(),
});

export const foundationalFollowUps = sqliteTable("foundational_followups", {
  id: text("id").primaryKey().default(SQL_UUID).notNull(),
  foundationalQuestionId: text("foundational_question_id")
    .references(() => foundationalQuestions.id, { onDelete: "cascade" })
    .notNull(),
  question: text("question").notNull(),
  choices: json<Choices>("choices").notNull(),
  explanations: json<Choices>("explanations").notNull(),
  answer: json<QuestionChoice>("answer").notNull(),
  type: json<QuestionType>("type").notNull(),
});

export const answeredFoundationals = sqliteTable(
  "answered_foundational_questions",
  {
    id: text("id").primaryKey().default(SQL_UUID).notNull(),
    userId: text("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    foundationalQuestionId: text("foundational_question_id")
      .references(() => foundationalQuestions.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: date("created_at").default(SQL_NOW).notNull(),
    shortResponse: text("short_response").notNull(),
    answers: json<FoundationalFollowupAnswer[]>("answers").notNull(),
    isComplete: json<boolean>("is_complete").default(false).notNull(),
  },
  (table) => [
    index("foundational_answer_user_idx").on(table.userId),
    index("foundational_answer_question_idx").on(table.foundationalQuestionId),
  ]
);

// NBME Questions --------------------------------------------------------------

export const nbmeQuestions = sqliteTable("step_one_nbme_questions", {
  id: text("id").primaryKey().default(SQL_UUID).notNull(),
  createdAt: date("created_at").default(SQL_NOW).notNull(),
  systems: json<System[]>("systems").notNull(),
  categories: json<AnyCategory[]>("categories").notNull(),
  topic: text("topic").notNull(),
  competency: text("competency").notNull(),
  concept: text("concept").notNull(),
  question: text("question").notNull(),
  answer: json<QuestionChoice>("answer").notNull(),
  choices: json<Choices>("choices").notNull(),
  explanations: json<Choices>("explanations").notNull(),
  labValues: json<unknown>("lab_values").notNull(),
  difficulty: json<QuestionDifficulty>("difficulty").notNull(),
  yield: json<YieldType>("yield").notNull(),
  rating: json<AuditRating>("rating").notNull(),
  step: json<NBMEStep>("step").notNull(),
});
