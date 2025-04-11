import { db } from "@/db";
import { expense_category } from "@/db/schema";
import { sales_category } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  insertSaleCategory,
  insertExpenseCategory,
  SalesCategory,
  ExpenseCategory,
} from "@/db/schema";

export const getExpenseCategory = async () => {
  const category = await db.select().from(expense_category);

  return category;
};

export const getExpenseCategoryById = async (id: number) => {
  const [expense] = await db
    .select()
    .from(expense_category)
    .where(eq(expense_category.id, id));
  return expense;
};

export const getSaleCategory = async () => {
  const category = await db.select().from(sales_category);

  //console.log(category);
  return category;
};

export const getSaleCategoryById = async (id: number) => {
  const [expense] = await db
    .select()
    .from(sales_category)
    .where(eq(sales_category.id, id));
  return expense;
};

export const createSaleCategory = async (newCategory: insertSaleCategory) => {
  const [category] = await db
    .insert(sales_category)
    .values(newCategory)
    .returning();

  return category;
};

export const createExpenseCategory = async (
  newCategory: insertExpenseCategory,
) => {
  const [category] = await db
    .insert(expense_category)
    .values(newCategory)
    .returning();

  return category;
};

export const updateSaleCategory = async (updatedCategory: SalesCategory) => {
  const category = await db
    .update(sales_category)
    .set(updatedCategory)
    .where(eq(sales_category.id, updatedCategory.id))
    .returning();

  return category;
};

export const updateExpenseCategory = async (
  updatedCategory: ExpenseCategory,
) => {
  const category = await db
    .update(expense_category)
    .set(updatedCategory)
    .where(eq(expense_category.id, updatedCategory.id))
    .returning();

  return category;
};

export const deleteSaleCategory = async (category_id: number) => {
  const category = await db
    .delete(sales_category)
    .where(eq(sales_category.id, category_id));

  return category;
};

export const deleteExpenseCategory = async (category_id: number) => {
  const category = await db
    .delete(expense_category)
    .where(eq(expense_category.id, category_id));

  return category;
};
