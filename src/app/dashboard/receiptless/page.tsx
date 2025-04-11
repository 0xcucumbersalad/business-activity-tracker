import { getManualExpense } from "@/data-access/expenses";
import { getManualSale } from "@/data-access/sales";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseDataTable } from "../expenses/_no-receipt/data-table";
import { ExpenseColumns } from "../expenses/_no-receipt/columns";
import { SaleDataTable } from "../sales/_no-receipt/data-table";
import { SaleColumns } from "../sales/_no-receipt/columns";
import { DiamondPercent } from "lucide-react";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function ReceiptlessPage() {
  const manualExpense = await getManualExpense();
  const manualSale = await getManualSale();
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center gap-1">
        <DiamondPercent />
        <h1 className="text-lg font-semibold md:text-2xl">
          Receiptless Transaction
        </h1>
      </div>
      <div className="" x-chunk="dashboard-02-chunk-1">
        <div className="">
          <Tabs defaultValue="sale" className="">
            <TabsList>
              <TabsTrigger value="sale">Sales</TabsTrigger>
              <TabsTrigger value="expense">Expenses</TabsTrigger>
            </TabsList>
            <TabsContent value="sale">
              <SaleDataTable columns={SaleColumns} data={manualSale} />
            </TabsContent>
            <TabsContent value="expense">
              <ExpenseDataTable columns={ExpenseColumns} data={manualExpense} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
