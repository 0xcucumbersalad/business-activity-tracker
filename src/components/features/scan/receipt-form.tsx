"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Send, LoaderIcon } from "lucide-react";
import ViewReceipt from "./view-receipt";
import { useRouter } from "next/navigation";

type Category = {
  id: number;
  name: string;
  description: string;
};

const itemSchema = z.object({
  amount: z.number().min(0),
  description: z.string().min(1),
  unit_price: z.number().min(0),
});

const formSchema = z.object({
  address: z.string(),
  delivered_by: z.string(),
  date: z.string().min(1),
  delivered_to: z.string(),
  items: z.array(itemSchema),
  receipt_number: z.string(),
  sales_category: z.string().optional().nullable(),
  expense_category: z.string().optional().nullable(),
  receipt_type: z.string(),
  total: z.number(),
  image_uuid: z.string().optional(),
});

const formSchema1 = z.object({
  address: z.string(),
  delivered_by: z.string(),
  date: z.string().min(1),
  delivered_to: z.string(),
  items: z.array(itemSchema),
  receipt_number: z.string(),
  sales_category: z.number().optional(),
  expense_category: z.number().optional(),
  receipt_type: z.string(),
  total: z.number(),
  image_uuid: z.string(),
});

export type ReceiptFormValues = z.infer<typeof formSchema>;
export type ReceiptFormValuesNew = z.infer<typeof formSchema1>;

export default function HorizontalEditableReceiptForm(props: {
  data: ReceiptFormValues | undefined;
  image: string;
  setDone: React.Dispatch<React.SetStateAction<boolean>>;
  imageFile: File | undefined;
}) {
  const { image, data, setDone, imageFile } = props;
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

  const form = useForm<ReceiptFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...data,
      sales_category: data?.sales_category || null,
      expense_category: data?.expense_category || null,
    },
  });

  const handleCategoryChange = (
    field: keyof ReceiptFormValues,
    value: string | undefined,
    clearField: keyof ReceiptFormValues
  ) => {
    form.setValue(field, value || "");
    if (value) {
      form.setValue(clearField, ""); // Clear the opposite field
    }
  };

  const uploadImageFile = async () => {
    const uploadImageFile = await fetch("/api/receipt/upload", {
      method: "POST",
      body: imageFile,
    });

    const result = await uploadImageFile.json();

    return result;
  };

  const create = async (data: ReceiptFormValues) => {
    const image = await uploadImageFile();

    const image_uuid = image?.id;

    const res = await fetch("/api/receipt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, image_uuid }),
    });
    return res;
  };

  async function onSubmit(data: ReceiptFormValues) {
    setLoading(true);

    // Calculate the total from items
    const calculatedTotal = data.items.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    // Check if the calculated total matches the input total
    if (Number(calculatedTotal.toFixed(2)) !== data.total) {
      toast({
        title: "Total mismatch",
        description: "The sum of item amounts does not match the total.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const formattedData = {
      ...data,
      expense_category:
        data.expense_category === "" ? null : data.expense_category,
      sales_category: data.sales_category === "" ? null : data.sales_category,
    };

    const req = await create(formattedData);
    if (!req.ok) {
      router.refresh();
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
      setLoading(false);
    } else {
      router.refresh();

      toast({
        title: "Successful!",
        description: "Your receipt data and image has been saved!",
      });
      setDone(false);
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardTitle className="text-2xl font-bold m-4">Edit Receipt</CardTitle>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-4">
              <div className="grid grid-cols-2 gap-2">
                {/* Existing form fields */}
                <FormField
                  control={form.control}
                  name="receipt_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receipt Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  name="delivered_by"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivered By</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="delivered_to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivered To</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select receipt type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Expense">Expense</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                        </SelectContent>
                      </Select>
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
                              "expense_category"
                            )
                          }
                          defaultValue={
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
                              "sales_category"
                            )
                          }
                          defaultValue={
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
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Image
                className="rounded border-1 shadow-md items-center"
                alt="receipt"
                width={150}
                height={100}
                src={image}
              />
              <ViewReceipt image={image} />
            </div>
          </CardHeader>
          <CardContent>
            {/* Table for items */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {form.watch("items").map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea {...field} rows={2} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.unit_price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                disabled
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                disabled
                                {...field}
                                onChange={(e) => {
                                  const newAmount = parseFloat(e.target.value);
                                  field.onChange(newAmount);
                                  const newTotal = form
                                    .getValues()
                                    .items.reduce(
                                      (sum, item) => sum + (item.amount || 0),
                                      0
                                    );
                                  form.setValue(
                                    "total",
                                    Number(newTotal.toFixed(2))
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="flex items-center gap-5">
              <span className="text-sm font-bold">Total</span>
              <FormField
                control={form.control}
                name="total"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Button type="submit" className="items-center text-center gap-1">
                {isLoading ? (
                  <LoaderIcon size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
                Save Changes
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
