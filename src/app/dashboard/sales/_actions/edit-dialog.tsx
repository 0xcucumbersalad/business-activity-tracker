import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SettingsIcon } from "lucide-react";
import { EditSaleForm } from "./edit-sale-form";

export default function EditSaleDialog({
  id,
  description,
  amount,
  date,
  category,
}: {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: number;
}) {
  return (
    <Dialog>
      <DialogTrigger className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 gap-1 cursor-pointer">
        <SettingsIcon className=" w-4" />
        <p>Edit Sale</p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Salea</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently modify your
            sale.
          </DialogDescription>
        </DialogHeader>
        <div>
          <EditSaleForm
            id={id}
            amount={amount}
            date={date}
            description={description}
            category={category}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
