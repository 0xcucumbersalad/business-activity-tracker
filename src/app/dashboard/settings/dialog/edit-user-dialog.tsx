"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PencilIcon } from "lucide-react";
import { EditForm } from "./edit-form";

export default function EditUserDialog({
  id,
  email,
}: {
  id: number;
  email: string;
}) {
  return (
    <Dialog>
      <DialogTrigger className="flex gap-1 items-center">
        <PencilIcon className="h-4 w-4" />
        <span className="text-sm">Edit User</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit existing account</DialogTitle>
          <DialogDescription>Edit existing account</DialogDescription>
        </DialogHeader>
        <EditForm id={id} email={email} />
      </DialogContent>
    </Dialog>
  );
}
