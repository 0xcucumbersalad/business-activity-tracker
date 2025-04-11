import { getTotalSaleByMonth } from "@/data-access/sales";
import {
  getTotalReceiptSaleByMonth,
  getTotalReceiptExpenseByMonth,
} from "@/data-access/receipts";
import { getTotalExpenseByMonth } from "@/data-access/expenses";

export const getSalesByMonth = async () => {
  const saleByMonth = await getTotalSaleByMonth();
  const saleReceiptByMonth = await getTotalReceiptSaleByMonth();

  const previousMonthCount =
    saleByMonth[0].previousMonthCount +
    saleReceiptByMonth.previousMonth[0].count;

  const previousMonthSales =
    saleByMonth[0].previousMonthTotal +
    saleReceiptByMonth.previousMonth[0].total;

  const currentMonthCount =
    saleByMonth[0].currentMonthCount + saleReceiptByMonth.currentMonth[0].count;

  const currenMonthSales =
    saleByMonth[0].currentMonthTotal + saleReceiptByMonth.currentMonth[0].total;

  const trends = (
    ((currenMonthSales - previousMonthSales) / previousMonthSales) *
    100
  ).toFixed(2);

  return {
    previousMonthCount,
    previousMonthSales,
    currentMonthCount,
    currenMonthSales,
    trends,
  };
};

export const getExpenseByMonth = async () => {
  const expenseByMonth = await getTotalExpenseByMonth();
  const expenseReceiptByMonth = await getTotalReceiptExpenseByMonth();

  const previousMonthCount =
    expenseByMonth[0].previousMonthCount +
    expenseReceiptByMonth.previousMonth[0].count;

  const previousMonthExpense =
    expenseByMonth[0].previousMonthTotal +
    expenseReceiptByMonth.previousMonth[0].total;

  const currentMonthCount =
    expenseByMonth[0].currentMonthCount +
    expenseReceiptByMonth.currentMonth[0].count;

  const currenMonthExpense =
    expenseByMonth[0].currentMonthTotal +
    expenseReceiptByMonth.currentMonth[0].total;

  const trends = (
    ((currenMonthExpense - previousMonthExpense) / previousMonthExpense) *
    100
  ).toFixed(2);

  return {
    previousMonthCount,
    previousMonthExpense,
    currentMonthCount,
    currenMonthExpense,
    trends,
  };
};

export const getIncomeByMonth = async () => {
  const sales = await getSalesByMonth();
  const expense = await getExpenseByMonth();

  const previousTotal =
    (sales.previousMonthSales || 0) - (expense.previousMonthExpense || 0);
  const total =
    (sales.currenMonthSales || 0) - (expense.currenMonthExpense || 0);

  const trends =
    sales.previousMonthSales === 0
      ? 0
      : (((total - previousTotal) / previousTotal) * 100).toFixed(2);

  return {
    total,
    trends: Number(trends),
  };
};
