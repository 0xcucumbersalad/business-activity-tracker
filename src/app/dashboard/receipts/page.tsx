import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getReceipts } from "@/data-access/receipts";
import { Receipt } from "lucide-react";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function Products() {
  const receipts = await getReceipts();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center gap-1">
        <Receipt />
        <h1 className="text-lg font-semibold md:text-2xl">Receipts</h1>
      </div>
      <div className="" x-chunk="dashboard-02-chunk-1">
        <div className="">
          <DataTable columns={columns} data={receipts} />
        </div>
      </div>
    </main>
  );
}
