import { sqliteTable, AnySQLiteColumn, integer, text, foreignKey, real } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const expenseCategory = sqliteTable("expense_category", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	description: text().notNull(),
});

export const expenses = sqliteTable("expenses", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	amount: real().notNull(),
	expenseCategory: integer("expense_category").notNull().references(() => expenseCategory.id, { onDelete: "cascade" } ),
	description: text().notNull(),
	date: text().notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`"),
});

export const items = sqliteTable("items", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	description: text().notNull(),
	unitPrice: real("unit_price").notNull(),
	amount: real().notNull(),
	receiptId: integer("receipt_id").notNull().references(() => receipts.id, { onDelete: "cascade" } ),
});

export const receipts = sqliteTable("receipts", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	date: text().notNull(),
	deliveredTo: text("delivered_to").notNull(),
	deliveredBy: text("delivered_by").notNull(),
	address: text().notNull(),
	receiptNumber: text("receipt_number").notNull(),
	receiptType: text("receipt_type").notNull(),
	salesCategory: integer("sales_category").references(() => salesCategory.id, { onDelete: "cascade" } ),
	expenseCategory: integer("expense_category").references(() => expenseCategory.id, { onDelete: "cascade" } ),
	total: real().notNull(),
	imageUuid: text("image_uuid").notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`"),
	updatedAt: text("updated_at").default("sql`(CURRENT_TIMESTAMP)`"),
});

export const resetHash = sqliteTable("reset_hash", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	active: integer().default(1).notNull(),
	hash: text().notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: integer("updated_at"),
});

export const sales = sqliteTable("sales", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	amount: real().notNull(),
	salesCategory: integer("sales_category").notNull().references(() => salesCategory.id, { onDelete: "cascade" } ),
	description: text().notNull(),
	date: text().notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`"),
});

export const salesCategory = sqliteTable("sales_category", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	description: text().notNull(),
});

export const users = sqliteTable("users", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	email: text().notNull(),
	password: text().notNull(),
	role: text().notNull(),
	createdAt: text("created_at").default("sql`(CURRENT_TIMESTAMP)`").notNull(),
	updatedAt: integer("updated_at"),
});

export const drizzleMigrations = sqliteTable("__drizzle_migrations", {
});

