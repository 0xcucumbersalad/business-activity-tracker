import { db } from "@/db";
import { eq, sql } from "drizzle-orm";
import { receipts } from "@/db/schema";
import {
  expenses,
  expense_category,
  insertExpense,
  Expenses,
} from "@/db/schema";

export const getExpense = async () => {
  const expense = await db
    .select()
    .from(receipts)
    .where(eq(receipts.receipt_type, "Expense"));

  return expense;
};

export const getManualExpense = async () => {
  const expense = await db
    .select()
    .from(expenses)
    .leftJoin(expense_category, eq(expenses.category, expense_category.id));

  return expense;
};

export const getManualExpenseByMonth = async (
  fromDate: string,
  toDate: string,
) => {
  const sale = await db
    .select()
    .from(expenses)
    .where(sql`date BETWEEN ${fromDate} AND ${toDate}`)
    .leftJoin(expense_category, eq(expenses.category, expense_category.id))
    .orderBy(sql`date ASC`);

  return sale;
};

export const getTotalExpenseByMonth = async () => {
  const currentMonth = sql`strftime('%Y-%m', 'now')`;
  const previousMonth = sql`strftime('%Y-%m', date('now', '-1 month'))`;

  const total = await db
    .select({
      currentMonthCount:
        sql<number>`COUNT(CASE WHEN strftime('%Y-%m', expenses.date) = ${currentMonth} THEN 1 END)`.as(
          "currentMonthCount",
        ),
      currentMonthTotal:
        sql<number>`SUM(CASE WHEN strftime('%Y-%m', expenses.date) = ${currentMonth} THEN expenses.amount ELSE 0 END)`.as(
          "currentMonthTotal",
        ),
      previousMonthCount:
        sql<number>`COUNT(CASE WHEN strftime('%Y-%m', expenses.date) = ${previousMonth} THEN 1 END)`.as(
          "previousMonthCount",
        ),
      previousMonthTotal:
        sql<number>`SUM(CASE WHEN strftime('%Y-%m', expenses.date) = ${previousMonth} THEN expenses.amount ELSE 0 END)`.as(
          "previousMonthTotal",
        ),
    })
    .from(expenses);

  return total;
};

export const getMonthlyExpenseTotals = async () => {
  const currentYear = new Date().getFullYear();
  const result = await db
    .select({
      month: sql`strftime('%Y-%m', ${expenses.date})`.as("month"),
      total_expense: sql`SUM(${expenses.amount})`.as("total_sales"),
    })
    .from(expenses)
    .where(
      sql`${expenses.date} BETWEEN ${`${currentYear}-01-01`} AND ${`${currentYear}-12-31`}`,
    )
    .groupBy(sql`strftime('%Y-%m', ${expenses.date})`)
    .orderBy(sql`strftime('%Y-%m', ${expenses.date}) ASC`);
  return result;
};

export const getTotalExpense = async () => {
  const total = await db
    .select({
      count: sql<number>`COUNT(*)`.as("count"),
      total: sql<number>`SUM(expenses.amount)`.as("totalAmount"),
    })
    .from(expenses);

  return total;
};

export const createExpenseSale = async (newExpense: insertExpense) => {
  const [expense] = await db.insert(expenses).values(newExpense).returning();

  return expense;
};

export const updateExpenseSale = async (updatedExpense: Expenses) => {
  const expense = await db
    .update(expenses)
    .set(updatedExpense)
    .where(eq(expenses.id, updatedExpense.id));

  return expense;
};

export const deleteExpenseSale = async (id: number) => {
  const expense = await db.delete(expenses).where(eq(expenses.id, id));

  return expense;
};
