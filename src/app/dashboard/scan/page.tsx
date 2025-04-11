import { DropzoneReceipt } from "@/components/features/scan/drop";
import { AlertHeader } from "@/components/static-ui/alert";
import { Scan } from "lucide-react";

export default async function Dashboard() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center gap-1">
        <Scan />
        <h1 className="text-lg font-semibold md:text-2xl">Scan Receipt</h1>
      </div>
      <AlertHeader />
      <div className="" x-chunk="dashboard-02-chunk-1">
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-lg font-semibold md:text-xl my-10">
            Upload Receipt
          </h1>
        </div>
        <div className="flex flex-col items-center m-2 text-center">
          <DropzoneReceipt />
        </div>
      </div>
    </main>
  );
}
