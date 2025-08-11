CREATE TABLE `admins` (
	`user_id` text NOT NULL,
	`created_at` TEXT DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `answered_questions` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`user_id` text NOT NULL,
	`question_id` text NOT NULL,
	`created_at` TEXT DEFAULT (datetime('now')) NOT NULL,
	`answer` TEXT NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `answer_user_idx` ON `answered_questions` (`user_id`);--> statement-breakpoint
CREATE INDEX `answer_question_idx` ON `answered_questions` (`question_id`);--> statement-breakpoint
CREATE TABLE `chat_history` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`user_id` text NOT NULL,
	`question_id` text NOT NULL,
	`conversation` TEXT,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `foundational_followups` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`foundational_question_id` text NOT NULL,
	`question` text NOT NULL,
	`choices` TEXT NOT NULL,
	`explanations` TEXT NOT NULL,
	`answer` TEXT NOT NULL,
	`type` TEXT NOT NULL,
	FOREIGN KEY (`foundational_question_id`) REFERENCES `foundational_questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `foundational_questions` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`shelf` text,
	`topic` text NOT NULL,
	`question` text NOT NULL,
	`expected_answer` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `password_resets` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`code` text NOT NULL,
	`valid_until` TEXT NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `password_resets_code_unique` ON `password_resets` (`code`);--> statement-breakpoint
CREATE TABLE `qbank_sessions` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`user_id` text NOT NULL,
	`question_ids` TEXT NOT NULL,
	`answers` TEXT NOT NULL,
	`flagged_questions` TEXT NOT NULL,
	`created_at` TEXT DEFAULT (datetime('now')) NOT NULL,
	`in_progress` TEXT DEFAULT true NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`created_at` TEXT DEFAULT (datetime('now')) NOT NULL,
	`creator_id` text NOT NULL,
	`system` TEXT NOT NULL,
	`category` TEXT NOT NULL,
	`subcategory` TEXT NOT NULL,
	`topic` text NOT NULL,
	`type` TEXT NOT NULL,
	`step` TEXT DEFAULT '"mixed"' NOT NULL,
	`question` text NOT NULL,
	`answer` TEXT NOT NULL,
	`choices` TEXT NOT NULL,
	`explanations` TEXT NOT NULL,
	`sources` TEXT NOT NULL,
	`difficulty` TEXT NOT NULL,
	`yield` TEXT DEFAULT '"Medium"' NOT NULL,
	`rating` TEXT NOT NULL,
	FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `question_system_idx` ON `questions` (`system`);--> statement-breakpoint
CREATE INDEX `question_category_idx` ON `questions` (`category`);--> statement-breakpoint
CREATE INDEX `question_subcategory_idx` ON `questions` (`subcategory`);--> statement-breakpoint
CREATE INDEX `question_topic_idx` ON `questions` (`topic`);--> statement-breakpoint
CREATE INDEX `question_type_idx` ON `questions` (`type`);--> statement-breakpoint
CREATE INDEX `question_difficulty_idx` ON `questions` (`difficulty`);--> statement-breakpoint
CREATE INDEX `question_step_idx` ON `questions` (`step`);--> statement-breakpoint
CREATE TABLE `review_questions` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`user_id` text NOT NULL,
	`question_id` text NOT NULL,
	`created_at` TEXT DEFAULT (datetime('now')) NOT NULL,
	`question` text NOT NULL,
	`answer_criteria` TEXT NOT NULL,
	`passed` TEXT DEFAULT false NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `review_user_idx` ON `review_questions` (`user_id`);--> statement-breakpoint
CREATE INDEX `review_question_idx` ON `review_questions` (`question_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`email` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`grad_year` text DEFAULT '2026' NOT NULL,
	`exam` TEXT DEFAULT 'Step 1' NOT NULL,
	`color` text NOT NULL,
	`password` text NOT NULL,
	`created_at` TEXT DEFAULT (datetime('now')),
	`school` text,
	`study_tools` text,
	`referral` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);