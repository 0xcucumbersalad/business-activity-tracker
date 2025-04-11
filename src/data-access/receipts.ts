import { db } from "@/db";
import { eq, and, between, sql } from "drizzle-orm";
import { receipts } from "@/db/schema";
import { InsertReceipt } from "@/db/schema";

/**
type ReceiptType = {
  name: string;
  address: string;
  items: string;
  receipt_number: number;
  total: number;
  tax: number;
  accuracy: number;
  image_uuid: string;
};
*/

export const getReceipts = async () => {
  const receipt = await db.select().from(receipts);

  return receipt;
};

export const getReceiptsbyDate = async (fromDate: string, toDate: string) => {
  const receipt = await db
    .select()
    .from(receipts)
    .where(and(between(receipts.date, fromDate, toDate)))
    .orderBy(sql`date ASC`);

  return receipt;
};

export const getReceiptsbyDateType = async (
  type: string,
  fromDate: string,
  toDate: string,
) => {
  const receipt = await db
    .select()
    .from(receipts)
    .where(
      and(
        eq(receipts.receipt_type, type),
        between(receipts.date, fromDate, toDate),
      ),
    );

  return receipt;
};

export const getTotalReceiptExpense = async () => {
  const total = await db
    .select({
      count: sql<number>`COUNT(*)`.as("count"),
      total: sql<number>`SUM(receipts.total)`.as("totalAmount"),
    })
    .from(receipts)
    .where(eq(receipts.receipt_type, "Expense"));

  return total;
};

export const getTotalSaleExpense = async () => {
  const total = await db
    .select({
      count: sql<number>`COUNT(*)`.as("count"),
      total: sql<number>`SUM(receipts.total)`.as("totalAmount"),
    })
    .from(receipts)
    .where(eq(receipts.receipt_type, "Sales"));

  return total;
};

export const getTotalReceiptSaleByMonth = async () => {
  const currentMonth = await db
    .select({
      count: sql<number>`COUNT(*)`.as("count"),
      total: sql<number>`SUM(receipts.total)`.as("totalAmount"),
    })
    .from(receipts)
    .where(
      sql`strftime('%Y-%m', receipts.date) = strftime('%Y-%m', 'now') AND receipts.receipt_type = 'Sales'`,
    );
  const previousMonth = await db
    .select({
      count: sql<number>`COUNT(*)`.as("count"),
      total: sql<number>`SUM(receipts.total)`.as("totalAmount"),
    })
    .from(receipts)
    .where(
      sql`strftime('%Y-%m', receipts.date) = strftime('%Y-%m', date('now', '-1 month')) AND receipts.receipt_type = 'Sales'`,
    );

  return { currentMonth, previousMonth };
};

export const getTotalReceiptExpenseByMonth = async () => {
  const currentMonth = await db
    .select({
      count: sql<number>`COUNT(*)`.as("count"),
      total: sql<number>`SUM(receipts.total)`.as("totalAmount"),
    })
    .from(receipts)
    .where(
      sql`strftime('%Y-%m', receipts.date) = strftime('%Y-%m', 'now') AND receipts.receipt_type = 'Expense'`,
    );
  const previousMonth = await db
    .select({
      count: sql<number>`COUNT(*)`.as("count"),
      total: sql<number>`SUM(receipts.total)`.as("totalAmount"),
    })
    .from(receipts)
    .where(
      sql`strftime('%Y-%m', receipts.date) = strftime('%Y-%m', date('now', '-1 month')) AND receipts.receipt_type = 'Expense'`,
    );

  return { currentMonth, previousMonth };
};

// get monthly total expense and sales
export const getMonthlyTotals = async () => {
  const currentYear = new Date().getFullYear();
  const result = await db
    .select({
      month: sql`strftime('%Y-%m', ${receipts.date})`.as("month"),
      total_sales:
        sql`SUM(CASE WHEN ${receipts.receipt_type} = 'Sales' THEN ${receipts.total} ELSE 0 END)`.as(
          "total_sales",
        ),
      total_expenses:
        sql`SUM(CASE WHEN ${receipts.receipt_type} = 'Expense' THEN ${receipts.total} ELSE 0 END)`.as(
          "total_expenses",
        ),
    })
    .from(receipts)
    .where(
      sql`${receipts.date} BETWEEN ${`${currentYear}-01-01`} AND ${`${currentYear}-12-31`}`,
    )
    .groupBy(sql`strftime('%Y-%m', ${receipts.date})`)
    .orderBy(sql`strftime('%Y-%m', ${receipts.date}) ASC`);
  return result;
};

export const getReceiptById = async (receipt_id: number) => {
  const [receipt] = await db
    .select()
    .from(receipts)
    .where(eq(receipts.id, receipt_id));

  return receipt;
};

export const createReceipt = async (newReceipt: InsertReceipt) => {
  const [receipt] = await db.insert(receipts).values(newReceipt).returning();

  return receipt;
};

export const updateReceipt = async (
  receipt_id: number,
  updatedReceipt: InsertReceipt,
) => {
  const receipt = await db
    .update(receipts)
    .set(updatedReceipt)
    .where(eq(receipts.id, receipt_id))
    .returning();

  return receipt;
};

export const deleteReceipt = async (receipt_id: number) => {
  const receipt = await db.delete(receipts).where(eq(receipts.id, receipt_id));

  return receipt;
};
