"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const deleteUserById = async ({ id }: { id: number }) => {
  const req = await fetch("/api/user", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });

  return req;
};

export default function DeleteUserDialog({ id }: { id: number }) {
  const router = useRouter();
  const { toast } = useToast();
  return (
    <Dialog>
      <DialogTrigger className="flex gap-1 items-center">
        <TrashIcon className="h-4 w-4" />a
        <span className="text-sm">Delete User</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete existing account</DialogTitle>
          <DialogDescription>This operation cannot be undone</DialogDescription>

          <DialogClose asChild>
            <Button
              onClick={async () => {
                const deleteUser = await deleteUserById({ id });

                if (deleteUser.ok) {
                  toast({
                    title: "SUCCESS",
                    description: "User has been deleted",
                  });
                  router.refresh();
                } else {
                  toast({
                    title: "FAILED",
                    description: "Error occured",
                    variant: "destructive",
                  });
                  router.refresh();
                }
              }}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
