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
import SaleForm from "@/components/features/forms/sale-form";

export default function AddSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="gap-1" variant={"default"}>
          <FilePlus2 className="h-4 w-4" />
          Add Sales
        </Button>
      </SheetTrigger>
      <SheetContent className="">
        <SheetHeader>
          <SheetTitle>Add new Sale</SheetTitle>
          <SheetDescription>
            This functions serves as adding new sale without a receipt.
          </SheetDescription>
        </SheetHeader>
        <div className="">
          <SaleForm type="Sale" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
