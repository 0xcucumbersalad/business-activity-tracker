import { db } from "@/db";
import { eq, sql } from "drizzle-orm";
import {
  insertSales,
  receipts,
  Sales,
  sales,
  sales_category,
} from "@/db/schema";

export const getSales = async () => {
  const sale = await db
    .select()
    .from(receipts)
    .where(eq(receipts.receipt_type, "Sales"));

  return sale;
};

export const getManualSale = async () => {
  const sale = await db
    .select()
    .from(sales)
    .leftJoin(sales_category, eq(sales.category, sales_category.id));

  return sale;
};

export const getManualSaleByMonth = async (
  fromDate: string,
  toDate: string,
) => {
  const sale = await db
    .select()
    .from(sales)
    .where(sql`date BETWEEN ${fromDate} AND ${toDate}`)
    .leftJoin(sales_category, eq(sales.category, sales_category.id))
    .orderBy(sql`date ASC`);

  return sale;
};

export const getMonthlySaleTotals = async () => {
  const currentYear = new Date().getFullYear();
  const result = await db
    .select({
      month: sql`strftime('%Y-%m', ${sales.date})`.as("month"),
      total_sales: sql`SUM(${sales.amount})`.as("total_sales"),
    })
    .from(sales)
    .where(
      sql`${sales.date} BETWEEN ${`${currentYear}-01-01`} AND ${`${currentYear}-12-31`}`,
    )
    .groupBy(sql`strftime('%Y-%m', ${sales.date})`)
    .orderBy(sql`strftime('%Y-%m', ${sales.date}) ASC`);

  return result;
};

export const getTotalSaleByMonth = async () => {
  const currentMonth = sql`strftime('%Y-%m', 'now')`;
  const previousMonth = sql`strftime('%Y-%m', date('now', '-1 month'))`;

  const total = await db
    .select({
      currentMonthCount:
        sql<number>`COUNT(CASE WHEN strftime('%Y-%m', sales.date) = ${currentMonth} THEN 1 END)`.as(
          "currentMonthCount",
        ),
      currentMonthTotal:
        sql<number>`SUM(CASE WHEN strftime('%Y-%m', sales.date) = ${currentMonth} THEN sales.amount ELSE 0 END)`.as(
          "currentMonthTotal",
        ),
      previousMonthCount:
        sql<number>`COUNT(CASE WHEN strftime('%Y-%m', sales.date) = ${previousMonth} THEN 1 END)`.as(
          "previousMonthCount",
        ),
      previousMonthTotal:
        sql<number>`SUM(CASE WHEN strftime('%Y-%m', sales.date) = ${previousMonth} THEN sales.amount ELSE 0 END)`.as(
          "previousMonthTotal",
        ),
    })
    .from(sales);

  return total;
};

export const getTotalSales = async () => {
  const total = await db
    .select({
      count: sql<number>`COUNT(*)`.as("count"),
      total: sql<number>`SUM(sales.amount)`.as("totalAmount"),
    })
    .from(sales);

  return total;
};

export const createManualSale = async (newSale: insertSales) => {
  const [sale] = await db.insert(sales).values(newSale).returning();

  return sale;
};

export const updateManualSale = async (updatedSale: Sales) => {
  const sale = await db
    .update(sales)
    .set(updatedSale)
    .where(eq(sales.id, updatedSale.id));

  return sale;
};

export const deleteManualSale = async (id: number) => {
  const sale = await db.delete(sales).where(eq(sales.id, id));

  return sale;
};
