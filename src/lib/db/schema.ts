import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  text,
  boolean,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ------------------------
// ENUMS
// ------------------------

export const userRoleEnum = pgEnum("user_role", [
  "guest",
  "authenticated-user",
  "admin",
]);

export const userPlanEnum = pgEnum("user_plan", [
  "free-plan",
  "express",
  "premium",
]);

// ------------------------
// USERS
// ------------------------

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Email stays varchar but normalized to lowercase in application layer
    email: varchar("email", { length: 255 }).notNull().unique(),

    hashedPassword: varchar("hashed_password", { length: 255 }),

    role: userRoleEnum("role").notNull().default("authenticated-user"),
    plan: userPlanEnum("plan").notNull().default("free-plan"),

    targetLevelId: uuid("target_level_id").references(
      () => difficultyLevels.id
    ),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    emailIndex: index("users_email_idx").on(t.email),
  })
);

export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  passwordResetTokens: many(passwordResetTokens),
  targetLevel: one(difficultyLevels, {
    fields: [users.targetLevelId],
    references: [difficultyLevels.id],
  }),
}));

// ------------------------
// ACCOUNTS (OAuth Providers)
// ------------------------

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    pk: [t.provider, t.providerAccountId],

    userProviderUnique: unique("user_provider_unique").on(
      t.userId,
      t.provider
    ),

    providerAccountIndex: index("provider_account_idx").on(
      t.provider,
      t.providerAccountId
    ),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

// ------------------------
// PASSWORD RESET TOKENS
// ------------------------

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    token: varchar("token", { length: 255 }).unique().notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    expiresIndex: index("password_reset_expires_idx").on(t.expiresAt),
  })
);

export const passwordResetTokensRelations = relations(
  passwordResetTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [passwordResetTokens.userId],
      references: [users.id],
    }),
  })
);

// ------------------------
// DIFFICULTY LEVELS
// ------------------------

export const difficultyLevels = pgTable(
  "difficulty_levels",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    language: varchar("language", { length: 10 }).notNull(), // e.g., 'ja', 'ko'
    levelName: varchar("level_name", { length: 20 }).notNull(), // e.g., 'N5', 'Topik 1'
    description: text("description"), // Optional description
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    uniqueLevel: unique("unique_level").on(t.language, t.levelName),
  })
);

// ------------------------
// QUESTIONS
// ------------------------

export const questions = pgTable(
  "questions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    question: text("question").notNull(),
    explanation: text("explanation").notNull(),

    language: varchar("language", { length: 10 }).notNull(),

    // Optional fields for better categorization
    difficultyLevelId: uuid("difficulty_level_id").references(
      () => difficultyLevels.id
    ),
    category: varchar("category", { length: 50 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    languageIndex: index("questions_language_idx").on(t.language),
    categoryIndex: index("questions_category_idx").on(t.category),
  })
);

export const questionsRelations = relations(questions, ({ one, many }) => ({
  answers: many(answers),
  difficultyLevel: one(difficultyLevels, {
    fields: [questions.difficultyLevelId],
    references: [difficultyLevels.id],
  }),
}));

// ------------------------
// ANSWERS
// ------------------------

export const answers = pgTable(
  "answers",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),

    answerText: text("answer_text").notNull(),
    isCorrect: boolean("is_correct").notNull().default(false),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    questionIndex: index("answers_question_idx").on(t.questionId),
  })
);

export const answersRelations = relations(answers, ({ one }) => ({
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}));

export const difficultyLevelsRelations = relations(
  difficultyLevels,
  ({ many }) => ({
    questions: many(questions),
    users: many(users),
  })
);
