"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { SaleWithCategory } from "@/data-access/type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import DeleteSaleDialog from "../_actions/delete-dialog";
import EditSaleDialog from "../_actions/edit-dialog";

export const SaleColumns: ColumnDef<SaleWithCategory>[] = [
  {
    accessorKey: "sales.id",
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
    accessorKey: "sales_category.name",
    header: "Category",
  },
  {
    accessorKey: "sales.description",
    header: "Description",
    id: "description",
  },
  {
    accessorKey: "sales.amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "sales.date",
    id: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateValue = row.original.sales.date;
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
      const id = row.original.sales.id;
      const amount = row.original.sales.amount;
      const description = row.original.sales.description;
      const date = row.original.sales.date;
      const category = row.original.sales.category;
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
              <EditSaleDialog
                id={id}
                amount={amount || 0}
                description={description || ""}
                date={date || ""}
                category={category || 0}
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-1" asChild></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <DeleteSaleDialog id={id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
