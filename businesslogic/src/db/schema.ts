import { pgEnum, pgTable, text, timestamp, varchar, numeric, serial, uuid } from 'drizzle-orm/pg-core';
import { desc, relations } from 'drizzle-orm';



// Enum for the user roles
export const userRolesEnum = pgEnum("user_roles", ["admin", "user"]);

// Enum for the transaction types
export const transactionTypesEnum = pgEnum("transaction_types", ["income", "expense"]);

// User table definition
export const users = pgTable("users", {
    id: text("id").primaryKey(),
    name: varchar("name"),
    email: varchar("email").notNull().unique(),
    role: userRolesEnum("role").notNull().default("user"),
    createdAt: timestamp("created_at", {mode: "date"}).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", {mode: "date"}).notNull().defaultNow()
})

// Transaction table definition
export const transactions = pgTable("transactions", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }), // Foreign key referencing users table
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }), // Foreign key referencing categories table
    name: varchar("name").notNull(),
    amount: numeric({ precision: 100, scale: 20 }).notNull(), // example: 12345678901234567890.12345678901234567890
    type: transactionTypesEnum("type").notNull(),
    description: text("description"),
    date: timestamp("date", { mode: "date" }).notNull(), // example: 2023-01-01, 
    createdAt: timestamp("created_at", {mode: "date"}).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", {mode: "date"}).notNull().defaultNow(), 
});

// Category table definition
export const categories = pgTable("categories", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade"}), // Foreign key referencing users table, when a user is deleted, their categories will also be deleted
    name: varchar("name").notNull(),
    color: varchar("color").notNull(), // example: #FF5733
});
// Relations between tables
export const usersRelations = relations(users, ({ many }) => ({
    transactions: many(transactions), // A user can have many transactions
    categories: many(categories), // A user can have many categories
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
    user: one(users, { fields: [transactions.userId], references: [users.id] }), // A transaction belongs to one user
    category: one(categories, { fields: [transactions.categoryId], references: [categories.id] }), // A transaction belongs to one category
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
    user: one(users, { fields: [categories.userId], references: [users.id] }), // A category belongs to one user
    transactions: many(transactions), // A category can have many transactions
}));

// Types
export type User = typeof users.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Category = typeof categories.$inferSelect;

export type NewUser = typeof users.$inferInsert;
export type NewTransaction = typeof transactions.$inferInsert;
export type NewCategory = typeof categories.$inferInsert;
