CREATE TABLE "difficulty_levels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"language" varchar(10) NOT NULL,
	"level_name" varchar(20) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_level" UNIQUE("language","level_name")
);
--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "difficulty_level_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "target_level_id" uuid;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_difficulty_level_id_difficulty_levels_id_fk" FOREIGN KEY ("difficulty_level_id") REFERENCES "public"."difficulty_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_target_level_id_difficulty_levels_id_fk" FOREIGN KEY ("target_level_id") REFERENCES "public"."difficulty_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" DROP COLUMN "difficulty";