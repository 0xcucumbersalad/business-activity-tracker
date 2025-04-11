import { db } from "@/db";
import { expense_category, expenses, receipts } from "@/db/schema";
import { sales_category, sales } from "@/db/schema";
import { sql } from "drizzle-orm";

export const getExpenseCategoryMonthlyTotal = async () => {
  //expense
  const result = await db
    .select({
      name: expense_category.name,
      total: sql<number>`COUNT(${expenses.id})`.as("expenses_count"),
    })
    .from(expense_category)
    .leftJoin(expenses, sql`${expense_category.id} = ${expenses.category}`)
    .where(sql`strftime('%Y-%m', expenses.date) = strftime('%Y-%m', 'now')`)
    .groupBy(expense_category.id, expense_category.name);

  //receipt expense
  const receiptResult = await db
    .select({
      name: expense_category.name,
      total: sql`COUNT(${receipts.id})`.as("sales_count"),
    })
    .from(expense_category)
    .leftJoin(
      receipts,
      sql`${expense_category.id} = ${receipts.expense_category}`,
    )
    .where(sql`strftime('%Y-%m', receipts.date) = strftime('%Y-%m', 'now')`)
    .groupBy(expense_category.id, expense_category.name);

  const receiptMap = new Map(receiptResult.map((r) => [r.name, r.total]));

  const combinedResults = result.map((expense) => {
    const receiptCount = receiptMap.get(expense.name) || 0;
    return {
      name: expense.name,
      total: expense.total + Number(receiptCount),
    };
  });

  return combinedResults;
};

export const getExpenseCategoryTotal = async () => {
  //expense
  const result = await db
    .select({
      name: expense_category.name,
      total: sql<number>`COUNT(${expenses.id})`.as("expenses_count"),
    })
    .from(expense_category)
    .leftJoin(expenses, sql`${expense_category.id} = ${expenses.category}`)
    .groupBy(expense_category.id, expense_category.name);

  //receipt expense
  const receiptResult = await db
    .select({
      name: expense_category.name,
      total: sql`COUNT(${receipts.id})`.as("sales_count"),
    })
    .from(expense_category)
    .leftJoin(
      receipts,
      sql`${expense_category.id} = ${receipts.expense_category}`,
    )
    .groupBy(expense_category.id, expense_category.name);

  const receiptMap = new Map(receiptResult.map((r) => [r.name, r.total]));

  const combinedResults = result.map((expense) => {
    const receiptCount = receiptMap.get(expense.name) || 0;
    return {
      name: expense.name,
      total: expense.total + Number(receiptCount),
    };
  });

  return combinedResults;
};

export const getSaleCategoryMonthlyTotal = async () => {
  const result = await db
    .select({
      name: sales_category.name,
      total: sql<number>`COUNT(${sales.id})`.as("sales_count"),
    })
    .from(sales_category)
    .leftJoin(sales, sql`${sales_category.id} = ${sales.category}`)
    .where(sql`strftime('%Y-%m', sales.date) = strftime('%Y-%m', 'now')`)
    .groupBy(sales_category.id, sales_category.name);

  const receiptResult = await db
    .select({
      name: sales_category.name,
      total: sql`COUNT(${receipts.id})`.as("sales_count"),
    })
    .from(sales_category)
    .leftJoin(receipts, sql`${sales_category.id} = ${receipts.sales_category}`)
    .where(sql`strftime('%Y-%m', receipts.date) = strftime('%Y-%m', 'now')`)
    .groupBy(sales_category.id, sales_category.name);

  const receiptMap = new Map(receiptResult.map((r) => [r.name, r.total]));

  const combinedResults = result.map((sale) => {
    const receiptCount = receiptMap.get(sale.name) || 0;
    return {
      name: sale.name,
      total: sale.total + Number(receiptCount),
    };
  });

  return combinedResults;
};

export const getSalesCategoryTotal = async () => {
  const result = await db
    .select({
      name: sales_category.name,
      total: sql<number>`COUNT(${sales.id})`.as("sales_count"),
    })
    .from(sales_category)
    .leftJoin(sales, sql`${sales_category.id} = ${sales.category}`)
    .groupBy(sales_category.id, sales_category.name);

  const receiptResult = await db
    .select({
      name: sales_category.name,
      total: sql`COUNT(${receipts.id})`.as("sales_count"),
    })
    .from(sales_category)
    .leftJoin(receipts, sql`${sales_category.id} = ${receipts.sales_category}`)
    .groupBy(sales_category.id, sales_category.name);

  const receiptMap = new Map(receiptResult.map((r) => [r.name, r.total]));

  const combinedResults = result.map((sale) => {
    const receiptCount = receiptMap.get(sale.name) || 0;
    return {
      name: sale.name,
      total: sale.total + Number(receiptCount),
    };
  });

  return combinedResults;
};
