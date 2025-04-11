"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SheetClose } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SalesCategory } from "@/db/schema";
import { CirclePlus } from "lucide-react";
import { useRouter } from "next/navigation";

type SalesFormData = {
  id: number;
  amount: number;
  category: number;
  description: string;
  date: string;
};

const updateSale = async (data: SalesFormData) => {
  const res = await fetch("/api/sales", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res;
};

export function EditSaleForm({
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
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setLoading] = useState(false);
  const [categories, setCategory] = useState<SalesCategory[]>([]);
  const form = useForm<SalesFormData>({
    defaultValues: {
      id: id,
      amount: amount,
      category: category,
      description: description,
      date: date,
    },
  });

  async function onSubmit(data: SalesFormData) {
    //console.log(data.id);
    setLoading(true);
    const res = await updateSale(data);
    if (res.ok) {
      setLoading(false);
      router.refresh();
      toast({
        title: "SUCCESS: Sale has been recorded",
        description: "Sale has been recorded successfully 🥳🥳🥳",
      });
    } else {
      const error = await res.json();
      setLoading(false);
      toast({
        title: "FAILED: Sale has not been recorded",
        description: error?.message,
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    const getCategory = async () => {
      try {
        setLoading(true);
        const req = await fetch("/api/sales/categories");
        const res = await req.json();
        setLoading(false);
        return setCategory(res);
      } catch {
        console.log("error");
        setLoading(false);
      }
    };
    getCategory();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <LoaderCircle className="animate-spin mr-2" />
          <span>Processing...</span>
        </div>
      ) : (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Edit Sale</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          max={new Date().toISOString().split("T")[0]}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <div>
                      <FormLabel>Sale Category</FormLabel>
                      <FormItem className="flex items-center gap-2">
                        {/* Aligning Add Button after the Select Component */}
                        <div className="flex items-center gap-2 w-full">
                          <Select
                            onValueChange={(selectedName) => {
                              const selectedCategory = categories.find(
                                (category) => category.name === selectedName,
                              );
                              field.onChange(Number(selectedCategory?.id));
                            }}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full h-10">
                                <SelectValue placeholder="Select a sales category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.name}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Link
                            href="/dashboard/sales/category"
                            className={`${buttonVariants({
                              variant: "default",
                            })} h-10 flex items-center justify-center whitespace-nowrap`}
                          >
                            <CirclePlus />
                          </Link>
                        </div>
                      </FormItem>
                      <FormMessage />
                    </div>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Amount</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex gap-2">
                <SheetClose asChild>
                  <Button type="reset" variant={"destructive"}>
                    Cancel
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button type="submit">Save Sale</Button>
                </SheetClose>
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}
    </>
  );
}
