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
  integer,
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
// LANGUAGES
// ------------------------

export const languages = pgTable(
  "languages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 10 }).notNull().unique(), // e.g., 'ja', 'en', 'ko'
    name: varchar("name", { length: 50 }).notNull(), // e.g., 'Japanese', 'English', 'Korean'
    nativeName: varchar("native_name", { length: 50 }), // e.g., '日本語', 'English', '한국어'
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    codeIndex: index("languages_code_idx").on(t.code),
  })
);

// ------------------------
// CATEGORIES
// ------------------------

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    languageId: uuid("language_id").notNull().references(() => languages.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 50 }).notNull(), // e.g., 'Vocabulary', 'Grammar', 'Reading'
    description: text("description"),
    sortOrder: integer("sort_order").default(0),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    uniqueCategory: unique("unique_category").on(t.languageId, t.name),
    languageIndex: index("categories_language_idx").on(t.languageId),
  })
);

// ------------------------
// LABELS
// ------------------------

export const labels = pgTable(
  "labels",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 50 }).notNull().unique(),
    color: varchar("color", { length: 7 }).default("#6B7280"), // Hex color code
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

// ------------------------
// QUESTION LABELS
// ------------------------

export const questionLabels = pgTable(
  "question_labels",
  {
    questionId: uuid("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
    labelId: uuid("label_id").notNull().references(() => labels.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    primaryKey: unique("question_labels_pk").on(t.questionId, t.labelId),
    questionIndex: index("question_labels_question_idx").on(t.questionId),
    labelIndex: index("question_labels_label_idx").on(t.labelId),
  })
);

// ------------------------
// DIFFICULTY LEVELS
// ------------------------

export const difficultyLevels = pgTable(
  "difficulty_levels",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    languageId: uuid("language_id").notNull().references(() => languages.id),
    levelName: varchar("level_name", { length: 20 }).notNull(), // e.g., 'N5', 'Topik 1'
    description: text("description"), // Optional description
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    uniqueLevel: unique("unique_level").on(t.languageId, t.levelName),
    languageIndex: index("difficulty_levels_language_idx").on(t.languageId),
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

    languageId: uuid("language_id").notNull().references(() => languages.id),

    // Optional fields for better categorization
    difficultyLevelId: uuid("difficulty_level_id").references(
      () => difficultyLevels.id
    ),
    categoryId: uuid("category_id").references(() => categories.id),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    languageIndex: index("questions_language_idx").on(t.languageId),
    categoryIndex: index("questions_category_idx").on(t.categoryId),
  })
);

export const questionsRelations = relations(questions, ({ one, many }) => ({
  answers: many(answers),
  language: one(languages, {
    fields: [questions.languageId],
    references: [languages.id],
  }),
  category: one(categories, {
    fields: [questions.categoryId],
    references: [categories.id],
  }),
  difficultyLevel: one(difficultyLevels, {
    fields: [questions.difficultyLevelId],
    references: [difficultyLevels.id],
  }),
  labels: many(questionLabels),
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

export const languagesRelations = relations(languages, ({ many }) => ({
  categories: many(categories),
  difficultyLevels: many(difficultyLevels),
  questions: many(questions),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  language: one(languages, {
    fields: [categories.languageId],
    references: [languages.id],
  }),
  questions: many(questions),
}));

export const labelsRelations = relations(labels, ({ many }) => ({
  questions: many(questionLabels),
}));

export const questionLabelsRelations = relations(questionLabels, ({ one }) => ({
  question: one(questions, {
    fields: [questionLabels.questionId],
    references: [questions.id],
  }),
  label: one(labels, {
    fields: [questionLabels.labelId],
    references: [labels.id],
  }),
}));

export const difficultyLevelsRelations = relations(
  difficultyLevels,
  ({ one, many }) => ({
    language: one(languages, {
      fields: [difficultyLevels.languageId],
      references: [languages.id],
    }),
    questions: many(questions),
    users: many(users),
  })
);
