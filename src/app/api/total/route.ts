import {
  getTotalReceiptExpense,
  getTotalReceiptExpenseByMonth,
  getMonthlyTotals,
} from "@/data-access/receipts";
import { getMonthlySaleTotals } from "@/data-access/sales";
import { getMonthlyExpenseTotals } from "@/data-access/expenses";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const GET = async function GET() {
  const total = await getTotalReceiptExpense();
  const month = await getTotalReceiptExpenseByMonth();
  const receiptTotal = await getMonthlyTotals();
  const totalSales = await getMonthlySaleTotals();
  const totalExpense = await getMonthlyExpenseTotals();

  return Response.json({
    total,
    month,
    receiptTotal,
    totalSales,
    totalExpense,
  });
};
