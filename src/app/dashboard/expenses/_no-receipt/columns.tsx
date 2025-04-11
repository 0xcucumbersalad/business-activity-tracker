"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { ExpenseWithCategory } from "@/data-access/type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import EditExpenseDialog from "../_actions/edit-dialog";
import DeleteExpenseDialog from "../_actions/delete-dialog";

export const ExpenseColumns: ColumnDef<ExpenseWithCategory>[] = [
  {
    accessorKey: "expenses.id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "expense_category.name",
    header: "Category",
  },
  {
    accessorKey: "expenses.description",
    header: "Description",
    id: "description",
  },
  {
    accessorKey: "expenses.amount",
    header: "Total Amount",
  },
  {
    accessorKey: "expenses.date",
    header: "Date",
    id: "date",
    cell: ({ row }) => {
      const dateValue = row.original.expenses.date;
      if (!dateValue) {
        return <div>No Date</div>;
      }

      const date = new Date(dateValue);

      if (isNaN(date.getTime())) {
        return <div>Invalid Date</div>;
      }
      const displayOptions: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "2-digit",
      };
      const formattedDisplayDate = date.toLocaleDateString(
        "en-US",
        displayOptions,
      );
      return <div>{formattedDisplayDate}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.expenses.id;
      const amount = row.original.expenses.amount;
      const description = row.original.expenses.description;
      const date = row.original.expenses.date;
      const category = row.original.expenses.category;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem className="gap-1" asChild>
              <EditExpenseDialog
                amount={amount || 0}
                description={description || ""}
                date={date || ""}
                category={category || 0}
                id={id}
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-1" asChild></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <DeleteExpenseDialog id={id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
