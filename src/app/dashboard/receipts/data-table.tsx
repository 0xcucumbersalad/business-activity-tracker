"use client";
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
//import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, SquareXIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import MonthPicker from "@/components/ui/month-picker";
import { ExportIncomeStatementDialog } from "@/components/features/export-income/export-income-statement";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [month, setMonth] = useState<Date | undefined>();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
  });

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <div className="flex items-center gap-1 sm:gap-2 py-4">
          <Input
            placeholder="Filter delivered to"
            value={
              (table.getColumn("delivered_to")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("delivered_to")
                ?.setFilterValue(event.target.value)
            }
            className="w-full"
          />

          {/* Month Picker Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full sm:w-[240px] pl-3 text-left font-normal",
                  !month && "text-muted-foreground",
                )}
              >
                {month ? format(month, "PPP") : <span>Pick a month</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <MonthPicker
                currentMonth={new Date()}
                onMonthChange={(currentMonth) => {
                  const options: Intl.DateTimeFormatOptions = {
                    timeZone: "Asia/Manila",
                    year: "numeric",
                    month: "2-digit",
                  };
                  const formattedDate = new Intl.DateTimeFormat(
                    "en-PH",
                    options,
                  ).format(currentMonth);
                  const [month, year] = formattedDate.split("/");
                  const formattedDateISO = `${year}-${month}`;
                  setMonth(currentMonth);
                  table.getColumn("date")?.setFilterValue(formattedDateISO);
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Clear Filter Button */}
          <Button
            variant={"outline"}
            className="gap-1 w-full sm:w-auto"
            onClick={() => {
              table.getColumn("date")?.setFilterValue("");
              table.getColumn("delivered_to")?.setFilterValue("");
              setMonth(undefined);
            }}
          >
            <SquareXIcon className="h-4 w-4" />
            Clear Filter
          </Button>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 py-4">
          <ExportIncomeStatementDialog />
        </div>
      </div>
      <div className="border rounded-md overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-4 text-left">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
