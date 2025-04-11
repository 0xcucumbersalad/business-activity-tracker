import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, real } from "drizzle-orm/sqlite-core";
//import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  password: text("password").notNull(),
  role: text("role").notNull(),
  createAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updateAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export const reset_hash = sqliteTable("reset_hash", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_id: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  active: integer("active").default(1).notNull(),
  hash: text("hash").notNull(),
  createAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updateAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export const receipt_items = sqliteTable("items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  description: text("description").notNull(),
  unit_price: real("unit_price").notNull(),
  amount: real("amount").notNull(),
  receipt: integer("receipt_id")
    .references(() => receipts.id, { onDelete: "cascade" })
    .notNull(),
});

export const receipts = sqliteTable("receipts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  delivered_to: text("delivered_to").notNull(),
  delivered_by: text("delivered_by").notNull(),
  address: text("address").notNull(),
  receipt_number: text("receipt_number").notNull(),
  receipt_type: text("receipt_type").notNull(),
  sales_category: integer("sales_category").references(
    () => sales_category.id,
    { onDelete: "cascade" },
  ),
  expense_category: integer("expense_category").references(
    () => expense_category.id,
    { onDelete: "cascade" },
  ),
  total: real("total").notNull(),
  image_uuid: text("image_uuid").notNull(),
  createAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updateAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});

//change schema
export const sales_category = sqliteTable("sales_category", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
});

export const sales = sqliteTable("sales", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  amount: real("amount").notNull(),
  category: integer("sales_category")
    .references(() => sales_category.id, { onDelete: "cascade" })
    .notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  createAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const expense_category = sqliteTable("expense_category", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
});

export const expenses = sqliteTable("expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  amount: real("amount").notNull(),
  category: integer("expense_category")
    .references(() => expense_category.id, { onDelete: "cascade" })
    .notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  createAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
export type InsertReceipt = typeof receipts.$inferInsert;
export type Receipt = typeof receipts.$inferSelect;

export type InsertItem = typeof receipt_items.$inferInsert;
export type Item = typeof receipt_items.$inferSelect;

export type SalesCategory = typeof sales_category.$inferSelect;
export type ExpenseCategory = typeof expense_category.$inferSelect;

export type insertSaleCategory = typeof sales_category.$inferInsert;
export type insertExpenseCategory = typeof expense_category.$inferInsert;

export type Expenses = typeof expenses.$inferSelect;
export type Sales = typeof sales.$inferSelect;
export type insertSales = typeof sales.$inferInsert;
export type insertExpense = typeof expenses.$inferInsert;

export type User = typeof users.$inferSelect;
export type insertUser = typeof users.$inferInsert;

export type Hash = typeof reset_hash.$inferSelect;
export type insertHash = typeof reset_hash.$inferInsert;
