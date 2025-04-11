"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlusIcon } from "lucide-react";
import { AddForm } from "./add-form";

export default function AddUserDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new account</DialogTitle>
          <DialogDescription>
            You can create an employee account to manage and access the
            dashboard
          </DialogDescription>
        </DialogHeader>
        <AddForm />
      </DialogContent>
    </Dialog>
  );
}
