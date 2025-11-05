CREATE TABLE "answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"answer_text" text NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "questions" RENAME COLUMN "correct_answers" TO "difficulty";--> statement-breakpoint
ALTER TABLE "questions" ALTER COLUMN "question" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "explanation" text NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "category" varchar(50);--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "answers_question_idx" ON "answers" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "provider_account_idx" ON "accounts" USING btree ("provider","provider_account_id");--> statement-breakpoint
CREATE INDEX "password_reset_expires_idx" ON "password_reset_tokens" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "questions_language_idx" ON "questions" USING btree ("language");--> statement-breakpoint
CREATE INDEX "questions_category_idx" ON "questions" USING btree ("category");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
ALTER TABLE "questions" DROP COLUMN "answers";--> statement-breakpoint
ALTER TABLE "questions" DROP COLUMN "explanations";--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "user_provider_unique" UNIQUE("user_id","provider");