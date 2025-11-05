CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" varchar(255) NOT NULL,
	"correct_answers" jsonb NOT NULL,
	"answers" jsonb NOT NULL,
	"explanations" jsonb NOT NULL,
	"language" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
