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

export default function DeleteExpenseDialog({ id }: { id: number }) {
  const { toast } = useToast();
  const router = useRouter();

  const deleteExpense = async (id: number) => {
    const response = await fetch(`/api/expense`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      toast({
        title: "Success: Sales has been removed",
        description: "Your sale has been removed",
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
        <p>Delete Expense</p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            expense and remove from data from the server.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button
              type="submit"
              variant={"destructive"}
              onClick={async () => {
                await deleteExpense(id);
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
