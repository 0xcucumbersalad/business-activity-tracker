import { BadgeDollarSign } from "lucide-react";
import { getManualSale, getSales } from "@/data-access/sales";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SaleColumns } from "./_no-receipt/columns";
import { SaleDataTable } from "./_no-receipt/data-table";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function Dashboard() {
  const sales = await getSales();
  const manualSales = await getManualSale();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center gap-1">
        <BadgeDollarSign />
        <h1 className="text-lg font-semibold md:text-2xl">Sales</h1>
      </div>
      <div className="" x-chunk="dashboard-02-chunk-1">
        <div className="flex flex-col">
          <Tabs defaultValue="receipt_sale" className="">
            <div className="flex justify-between">
              <TabsList>
                <TabsTrigger value="receipt_sale">With receipt</TabsTrigger>
                <TabsTrigger value="manual_sale">Without receipt</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="receipt_sale">
              <DataTable columns={columns} data={sales} />
            </TabsContent>
            <TabsContent value="manual_sale">
              <SaleDataTable columns={SaleColumns} data={manualSales} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
