import { ListTodo } from "lucide-react";
import { getExpenseCategory } from "@/data-access/category";
export const dynamic = "force-dynamic";

export default async function ItemsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center gap-1">
        <ListTodo />
        <h1 className="text-lg font-semibold md:text-2xl">Expense Category</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div>{/* table here*/}</div>
      </div>
    </main>
  );
}
