import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

export default function ViewReceipt({ image }: { image: string }) {
  return (
    <Dialog>
      <DialogTrigger className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 gap-1 cursor-pointer">
        <ImageIcon />
        View Image
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Receipt Preview</DialogTitle>
          <DialogDescription>
            This dialog displays a clear and concise preview of a scanned or
            photographed receipt.
          </DialogDescription>
          <div className="flex justify-center">
            <Image
              src={image}
              width={400}
              height={400}
              alt="image"
              className="border rounded"
            />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
