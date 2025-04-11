"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircleIcon } from "lucide-react";
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
import { useRouter } from "next/navigation";

type Category = {
  id: number;
  name: string;
  description: string;
};

const receiptItemSchema = z.object({
  id: z.number(),
  description: z.string().min(1, "Description is required"),
  unit_price: z.number(),
  amount: z.number().min(0, "Amount must be non-negative"),
  receipt: z.number(),
});

const receiptSchema = z.object({
  id: z.number(),
  date: z.string(),
  delivered_to: z.string(),
  delivered_by: z.string(),
  address: z.string(),
  receipt_number: z.string(),
  sales_category: z.number().optional().nullable(),
  expense_category: z.number().optional().nullable(),
  receipt_type: z.string().min(1, "Receipt type is required"),
  total: z.number().min(0, "Total must be non-negative"),
  image_uuid: z.string(),
  items: z.array(receiptItemSchema),
});

export type ReceiptFormData = z.infer<typeof receiptSchema>;

export default function EditableReceipt({
  initialData = {},
}: {
  initialData?: Partial<ReceiptFormData>;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [expenseCategory, setExpenseCategory] = useState<Category[]>();
  const [salesCategory, setSalesCategory] = useState<Category[]>();

  useEffect(() => {
    const getCategories = async () => {
      const salesCategoryRequest = (
        await fetch("/api/sales/categories")
      ).json();
      const expenseCategoryRequest = (
        await fetch("/api/expense/categories")
      ).json();

      setExpenseCategory(await expenseCategoryRequest);
      setSalesCategory(await salesCategoryRequest);
    };

    getCategories();
  }, []);

  const form = useForm<ReceiptFormData>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      ...initialData,
      items: initialData.items || [],
      total: initialData.total || undefined,
      sales_category: initialData?.sales_category || null,
      expense_category: initialData?.expense_category || null,
      receipt_type: initialData.receipt_type,
    },
  });

  const handleCategoryChange = (
    field: keyof ReceiptFormData,
    value: string | undefined,
    clearField: keyof ReceiptFormData,
  ) => {
    form.setValue(field, value ? Number(value) : null);
    if (value) {
      form.setValue(clearField, null); // Clear the opposite field
    }
  };

  const { fields } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    const total = calculateTotal(form.watch("items"));
    form.setValue("total", total);
  }, [form.watch("items")]);

  const calculateTotal = (items: { amount: number }[]) => {
    return items.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  async function onSubmit(data: ReceiptFormData) {
    setLoading(true);

    const calculatedTotal = calculateTotal(data.items);

    const formattedData = {
      ...data,
      expense_category:
        data.expense_category === null ? null : data.expense_category,
      sales_category: data.sales_category === null ? null : data.sales_category,
      total: calculatedTotal,
    };

    await updateReceipt(formattedData);
    setLoading(false);
  }

  const updateReceipt = async (body: ReceiptFormData) => {
    const response = await fetch("/api/receipt", {
      method: "PATCH",
      body: JSON.stringify(body),
    });

    if (response.ok) {
      router.refresh();
      router.replace("/dashboard/receipts");
      toast({
        title: "Success: Receipt has been updated",
        description: "Success: receipt has been updated successfully",
      });
    } else {
      router.refresh();
      router.back();
      toast({
        title: "Failed: Receipt update has been failed",
        description: "Failed: Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center">
          <LoaderCircleIcon className="animate-spin" />
          <span>Loading ...</span>
        </div>
      ) : (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Receipt</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value || ""}
                            max={new Date().toISOString().split("T")[0]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="receipt_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Receipt Number</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="delivered_to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivered To</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="delivered_by"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivered By</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="receipt_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receipt Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a verified email to display" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Expense">Expense</SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("receipt_type") === "Sales" ? (
                  <FormField
                    control={form.control}
                    name="sales_category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sales Category</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            handleCategoryChange(
                              "sales_category",
                              value,
                              "expense_category",
                            )
                          }
                          value={
                            field.value ? field.value.toString() : undefined
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {salesCategory?.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="expense_category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expense Category</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            handleCategoryChange(
                              "expense_category",
                              value,
                              "sales_category",
                            )
                          }
                          value={
                            field.value ? field.value.toString() : undefined
                          }
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {expenseCategory?.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="items"
                  render={() => (
                    <FormItem>
                      <FormLabel>Items</FormLabel>
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="grid grid-cols-2 gap-2 mt-2"
                        >
                          <FormField
                            control={form.control}
                            name={`items.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} placeholder="Description" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`items.${index}.amount`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="Amount"
                                    {...field}
                                    onChange={(e) => {
                                      const amount = parseFloat(e.target.value);
                                      field.onChange(
                                        isNaN(amount) ? 0 : amount,
                                      );
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="total"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          value={calculateTotal(form.watch("items")).toFixed(2)}
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex gap-2">
                <Link
                  href={"/dashboard/receipts"}
                  className={buttonVariants({ variant: "destructive" })}
                >
                  Cancel
                </Link>
                <Button type="submit">Save Receipt</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}
    </>
  );
}
