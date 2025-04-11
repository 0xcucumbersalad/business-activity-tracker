"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
import { DrawerClose } from "@/components/ui/drawer";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  description: z.string().min(3, {
    message: "name must be at least 3 characters.",
  }),
});

const createSaleCategory = async (data: z.infer<typeof FormSchema>) => {
  const res = await fetch("/api/sales/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res;
};

const createExpenseCategory = async (data: z.infer<typeof FormSchema>) => {
  const res = await fetch("/api/expense/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res;
};

export default function CategoryForm({ type }: { type: string }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (type == "sale") {
      const req = await createSaleCategory(data);
      const res = await req.json();
      if (req.ok) {
        router.refresh();
        toast({
          title: "SUCCESS",
          description: <pre>New category has been added 🎉🎉🎉</pre>,
        });
      } else {
        toast({
          title: "FAILED",
          description: <pre>{res?.message} 🙁</pre>,
          variant: "destructive",
        });
      }
    } else {
      const req = await createExpenseCategory(data);
      const res = await req.json();
      if (req.ok) {
        router.refresh();
        toast({
          title: "SUCCESS",
          description: <pre>New category has been added 🎉🎉🎉</pre>,
        });
      } else {
        toast({
          title: "FAILED",
          description: <pre>{res?.message} 🙁</pre>,
          variant: "destructive",
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="category name" {...field} />
              </FormControl>
              <FormDescription>
                This will be the name of the category
              </FormDescription>
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
                This will be the description of the category
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DrawerClose asChild>
          <Button type="submit">Submit</Button>
        </DrawerClose>
      </form>
    </Form>
  );
}
