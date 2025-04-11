import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowBigDownIcon } from "lucide-react";
import DatePickerForm from "./date-picker";

type ExportType = {
  type: "sales" | "expense" | "receipts";
};

export default function ExportDialog(type: ExportType) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-1 w-full sm:w-auto" variant={"outline"}>
          <ArrowBigDownIcon className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Export as PDF</DialogTitle>
          <DialogDescription>
            Export your monthly financial information into a PDF format. Choose
            range from what month
          </DialogDescription>
        </DialogHeader>
        <DatePickerForm type={type.type} />
      </DialogContent>
    </Dialog>
  );
}
