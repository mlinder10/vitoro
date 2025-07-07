import {
  AnyCategory,
  AnySubcategory,
  AuditRating,
  Checklist,
  Choices,
  NBMEStep,
  QuestionChoice,
  QuestionDifficulty,
  QuestionType,
  System,
} from "@/types";
import { sql } from "drizzle-orm";
import { customType, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
    return new Date(value);
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
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  color: text("color").notNull(),
  password: text("password").notNull(),
  createdAt: date("created_at").default(SQL_NOW),
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

export const questions = sqliteTable("questions", {
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
  step: json<NBMEStep>("step").default("mixed").notNull(),

  question: text("question").notNull(),
  answer: json<QuestionChoice>("answer").notNull(),
  choices: json<Choices>("choices").notNull(),
  explanations: json<Choices>("explanations").notNull(),

  sources: json<string[]>("sources").notNull(),
  difficulty: json<QuestionDifficulty>("difficulty").notNull(),
});

export const audits = sqliteTable("audits", {
  id: text("id").primaryKey().default(SQL_UUID).notNull(),
  questionId: text("question_id")
    .references(() => questions.id, { onDelete: "cascade" })
    .notNull(),

  checklist: json<Checklist>("checklist").notNull(),
  suggestions: json<string[]>("suggestions").notNull(),
  rating: json<AuditRating>("rating").notNull(),
});

export const answeredQuestions = sqliteTable("answered_questions", {
  id: text("id").primaryKey().default(SQL_UUID).notNull(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  questionId: text("question_id")
    .references(() => questions.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: date("created_at").default(SQL_NOW).notNull(),
  answer: json<QuestionChoice>("answer").notNull(),
});

export const reviewQuestions = sqliteTable("review_questions", {
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
});

export const chatHistory = sqliteTable("chat_history", {
  id: text("id").primaryKey().default(SQL_UUID).notNull(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  questionId: text("question_id")
    .references(() => questions.id, { onDelete: "cascade" })
    .notNull(),
  conversation: json<string[]>("conversation"),
});
