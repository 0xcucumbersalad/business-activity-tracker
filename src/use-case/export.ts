import { getManualSaleByMonth } from "@/data-access/sales";
import { getManualExpenseByMonth } from "@/data-access/expenses";
import { getReceiptsbyDate } from "@/data-access/receipts";

export const exportIncomeStatementByDate = async (
  fromDate: string,
  toDate: string,
) => {
  const sales = await getManualSaleByMonth(fromDate, toDate);
  const expense = await getManualExpenseByMonth(fromDate, toDate);
  const receipts = await getReceiptsbyDate(fromDate, toDate);

  return { sales, expense, receipts };
};
