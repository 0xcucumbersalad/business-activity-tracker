import { Home } from "lucide-react";
import ReceiptChartDashboard from "./_charts/receipt-chart-dashboard";
import ReceiptChartQuarterDashboard from "./_charts/receipt-chart-quarter-dashboard";
import ChartSummaryCard from "./_charts/chart-summary-card";
import { ExportIncomeStatementDialog } from "@/components/features/export-income/export-income-statement";

import SalesChart from "./_charts/sales-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExpenseChart from "./_charts/expense-chart";
import ExpenseQuarterChart from "./_charts/expense-quarter-chart";
import SalesQuarterChart from "./_charts/sales-quarter-chart";

export const fetchCache = "force-no-store";
export const revalidate = 0;
export const dynamic = "force-dynamic";

function ReceiptChartTabs() {
  return (
    <Tabs defaultValue="total">
      <TabsList>
        <TabsTrigger value="total">Month</TabsTrigger>
        <TabsTrigger value="quarter">Quarter</TabsTrigger>
      </TabsList>
      <TabsContent value="quarter">
        <ReceiptChartQuarterDashboard />
        <SalesQuarterChart />
        <ExpenseQuarterChart />
      </TabsContent>
      <TabsContent value="total">
        <ReceiptChartDashboard />
        <SalesChart />
        <ExpenseChart />
      </TabsContent>
    </Tabs>
  );
}

export default function Dashboard() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between space-x-4 w-full">
        <div className="flex items-center space-x-2">
          <Home />
          <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
        </div>
        <div className="text-center">
          <ExportIncomeStatementDialog />
        </div>
      </div>
      <div className="" x-chunk="dashboard-02-chunk-1">
        <div className="">
          <ChartSummaryCard />
          <ReceiptChartTabs />
        </div>
      </div>
    </main>
  );
}
