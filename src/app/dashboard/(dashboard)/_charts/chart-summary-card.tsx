import SummaryCard from "./summary-card";
import { PhilippinePeso } from "lucide-react";
import {
  getSalesByMonth,
  getExpenseByMonth,
  getIncomeByMonth,
} from "@/use-case/total";
import InteractiveProfitLossCard from "./profit-loss-card";
import SalesCategoryPieChart from "./sales-category-pie-chart";
import ExpenseCategoryPieChart from "./expense-category-pie-chart";

export default async function ChartSummaryCard() {
  const sales = await getSalesByMonth();
  const expense = await getExpenseByMonth();
  const total = await getIncomeByMonth();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
      <SummaryCard
        title="Monthly Sales"
        value={`₱${sales.currenMonthSales.toLocaleString()}`}
        icon={<PhilippinePeso className="h-4 w-4 text-muted-foreground" />}
        trend={
          sales.trends === "Infinity" || sales.trends === "NaN"
            ? 0
            : Number(sales.trends)
        }
      />
      <SummaryCard
        title="Monthly Expense"
        value={`₱${expense.currenMonthExpense.toLocaleString()}`}
        icon={<PhilippinePeso className="h-4 w-4 text-muted-foreground" />}
        trend={
          expense.trends === "Infinity" || expense.trends === "NaN"
            ? 0
            : Number(expense.trends)
        }
      />
      <SummaryCard
        title="Monthly Income"
        value={`₱${total.total.toLocaleString()}`}
        icon={<PhilippinePeso className="h-4 w-4 text-muted-foreground" />}
        trend={total.trends}
      />
      <SalesCategoryPieChart />
      <ExpenseCategoryPieChart />
      <InteractiveProfitLossCard />
    </div>
  );
}
