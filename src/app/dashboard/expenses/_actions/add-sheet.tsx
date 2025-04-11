import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FilePlus2 } from "lucide-react";
import ExpenseForm from "@/components/features/forms/expense-form";

export default function AddSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="gap-1" variant={"default"}>
          <FilePlus2 className="h-4 w-4" />
          Add Expense
        </Button>
      </SheetTrigger>
      <SheetContent className="">
        <SheetHeader>
          <SheetTitle>Add new Expense</SheetTitle>
          <SheetDescription>
            This functions serves as adding new expense without a receipt.
          </SheetDescription>
        </SheetHeader>
        <div className="">
          <ExpenseForm type="Expense" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
