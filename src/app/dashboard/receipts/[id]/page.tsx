import { getReceiptById } from "@/data-access/receipts";
import { getItemsById } from "@/data-access/receipt_items";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import EditableReceipt from "@/components/features/scan/receipt";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function Page(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const data = await getReceiptById(params.id);
  const items = await getItemsById(params.id);

  const receipt = {
    ...data,
    items: [...items],
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Receipt</h1>
      </div>
      <div
        className="rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="my-5">
          {data == undefined ? (
            <div className="flex justify-center items-center flex-col gap-5">
              <span>Receipt Not Found</span>
              <Link
                href={"/dashboard/receipts"}
                className={buttonVariants({ variant: "outline" })}
              >
                Go Back to Receipts
              </Link>
            </div>
          ) : (
            <EditableReceipt initialData={receipt} />
          )}
        </div>
      </div>
    </main>
  );
}
