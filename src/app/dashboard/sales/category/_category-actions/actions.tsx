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
import { Button } from "@/components/ui/button";
import { SettingsIcon, TrashIcon } from "lucide-react";
import { SalesCategory } from "@/db/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const updateSaleCategory = async (data: SalesCategory) => {
  const res = await fetch("/api/sales/categories", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res;
};

const deleteSaleCategory = async ({ id }: { id: number }) => {
  const res = await fetch("/api/sales/categories", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  return res;
};

export function DeleteDialogCategory({ id }: { id: number }) {
  const router = useRouter();
  return (
    <Dialog>
      <DialogTrigger className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 gap-1 cursor-pointer">
        <TrashIcon className="ml-2 h-4 w-4 gap-2" />
        Delete
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update this category </DialogTitle>
          <DialogDescription className="text-red-500">
            By deleting this category, all of the sales that was references will
            also be deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogClose asChild>
          <Button
            variant={"destructive"}
            onClick={async () => {
              const req = await deleteSaleCategory({ id });
              const res = await req.json();
              if (req.ok) {
                router.refresh();
                toast({
                  title: "SUCCESS",
                  description: <pre>Category has been deleted 🎉🎉🎉</pre>,
                });
              } else {
                toast({
                  title: "FAILED",
                  description: <pre>{res?.message} 🙁</pre>,
                  variant: "destructive",
                });
              }
            }}
          >
            <TrashIcon className="ml-2 h-4 w-4 gap-2" />
            Delete Category
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default function EditDialogCategory({
  id,
  name,
  description,
}: {
  id: number;
  name: string;
  description: string;
}) {
  return (
    <Dialog>
      <DialogTrigger className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 gap-1 cursor-pointer">
        <SettingsIcon className="ml-2 h-4 w-4 gap-2" />
        Edit
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update this category </DialogTitle>
          <DialogDescription className="text-red-500">
            By updating this category, all of the sales that was references will
            also be change by the new name and description
          </DialogDescription>
        </DialogHeader>
        <EditForm id={id} name={name} description={description} />
      </DialogContent>
    </Dialog>
  );
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  description: z.string().min(3, {
    message: "description must be at least 3 characters.",
  }),
});

function EditForm({
  id,
  name,
  description,
}: {
  id: number;
  name: string;
  description: string;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
      description: description,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const new_data = {
      id: id,
      ...data,
    };
    const req = await updateSaleCategory(new_data);
    const res = await req.json();
    if (req.ok) {
      router.refresh();
      toast({
        title: "SUCCESS",
        description: <pre>New category has been updated 🎉🎉🎉</pre>,
      });
    } else {
      toast({
        title: "FAILED",
        description: <pre>{res?.message} 🙁</pre>,
        variant: "destructive",
      });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormDescription>This is your new display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="description" {...field} />
              </FormControl>
              <FormDescription>
                This is your new display description.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogClose asChild>
          <Button type="submit">Submit</Button>
        </DialogClose>
      </form>
    </Form>
  );
}
