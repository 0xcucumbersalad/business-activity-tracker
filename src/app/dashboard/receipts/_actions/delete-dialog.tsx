import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function DeleteDialog({
  id,
  image_uuid,
}: {
  id: number;
  image_uuid: string | null;
}) {
  const { toast } = useToast();
  const router = useRouter();

  const deleteReceipt = async (image_uuid: string | null, id: number) => {
    const response = await fetch(
      `/api/receipt?image_uuid=${image_uuid}&id=${id}`,
      {
        method: "DELETE",
      },
    );

    if (response.ok) {
      toast({
        title: "Success: Receipt has been removed",
        description: "Your receipt has been removed",
      });
    } else {
      toast({
        title: "Failed: Request failed",
        description: response.status,
      });
    }
  };
  return (
    <Dialog>
      <DialogTrigger className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 gap-1 cursor-pointer">
        <TrashIcon color="red" className=" w-4" />
        <p>Delete Receipt</p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            receipt and remove from data from the server.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button
              type="submit"
              variant={"destructive"}
              onClick={async () => {
                await deleteReceipt(image_uuid, id);
                router.refresh();
              }}
            >
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
