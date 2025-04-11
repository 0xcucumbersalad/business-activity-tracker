import { relations } from "drizzle-orm/relations";
import { expenseCategory, expenses, receipts, items, salesCategory, users, resetHash, sales } from "./schema";

export const expensesRelations = relations(expenses, ({one}) => ({
	expenseCategory: one(expenseCategory, {
		fields: [expenses.expenseCategory],
		references: [expenseCategory.id]
	}),
}));

export const expenseCategoryRelations = relations(expenseCategory, ({many}) => ({
	expenses: many(expenses),
	receipts: many(receipts),
}));

export const itemsRelations = relations(items, ({one}) => ({
	receipt: one(receipts, {
		fields: [items.receiptId],
		references: [receipts.id]
	}),
}));

export const receiptsRelations = relations(receipts, ({one, many}) => ({
	items: many(items),
	expenseCategory: one(expenseCategory, {
		fields: [receipts.expenseCategory],
		references: [expenseCategory.id]
	}),
	salesCategory: one(salesCategory, {
		fields: [receipts.salesCategory],
		references: [salesCategory.id]
	}),
}));

export const salesCategoryRelations = relations(salesCategory, ({many}) => ({
	receipts: many(receipts),
	sales: many(sales),
}));

export const resetHashRelations = relations(resetHash, ({one}) => ({
	user: one(users, {
		fields: [resetHash.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	resetHashes: many(resetHash),
}));

export const salesRelations = relations(sales, ({one}) => ({
	salesCategory: one(salesCategory, {
		fields: [sales.salesCategory],
		references: [salesCategory.id]
	}),
}));