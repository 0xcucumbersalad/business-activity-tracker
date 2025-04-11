import { CreditCard } from "lucide-react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getExpense, getManualExpense } from "@/data-access/expenses";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseDataTable } from "./_no-receipt/data-table";
import { ExpenseColumns } from "./_no-receipt/columns";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function Expense() {
  const receiptExpense = await getExpense();
  const manualExpense = await getManualExpense();
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center gap-1">
        <CreditCard />
        <h1 className="text-lg font-semibold md:text-2xl">Expenses</h1>
      </div>
      <div className="" x-chunk="dashboard-02-chunk-1">
        <div className="">
          <Tabs defaultValue="receipt_expense" className="">
            <TabsList>
              <TabsTrigger value="receipt_expense">With receipt</TabsTrigger>
              <TabsTrigger value="manual_expense">Without receipt</TabsTrigger>
            </TabsList>
            <TabsContent value="receipt_expense">
              <DataTable columns={columns} data={receiptExpense} />
            </TabsContent>
            <TabsContent value="manual_expense">
              <ExpenseDataTable columns={ExpenseColumns} data={manualExpense} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
