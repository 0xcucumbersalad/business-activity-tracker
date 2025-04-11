import { LoaderCircleIcon } from "lucide-react";
export default function Loading() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Receipts</h1>
      </div>
      <div
        className="flex flex-1 items-center rounded-lg border border-dashed shadow-sm justify-around"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex gap-1">
          <LoaderCircleIcon className="animate-spin" />
          <span>Loading ...</span>
        </div>
      </div>
    </main>
  );
}
