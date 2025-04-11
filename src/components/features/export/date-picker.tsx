"use client";
import MonthPicker from "@/components/ui/month-picker";
import { Popover } from "@/components/ui/popover-dialog";
import { PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircleIcon } from "lucide-react";
import SalesFinanceCard from "../statement/sales-finance-card";
import ExpenseFinanceCard from "../statement/expense-finance-card";

type ExportType = {
  type: "sales" | "expense" | "receipts";
};

type Data = {
  id: number;
  amount: number;
  category: number;
  description: string;
  date: string;
  createAt: string;
};

type Category = {
  id: number;
  name: string;
  description: string;
};

export type SalesDataStructure = {
  sales: Data;
  sales_category: Category;
};

export type ExpenseDataStructure = {
  expenses: Data;
  expense_category: Category;
};

export default function ExportPicker(type: ExportType) {
  const { toast } = useToast();
  const [firstMonth, setFirstMonth] = useState<Date | undefined>();
  const [secondMonth, setSecondMonth] = useState<Date | undefined>();
  const [firstDate, setFirstDate] = useState("");
  const [secondDate, setSecondDate] = useState("");
  const [salesData, setSalesData] = useState<SalesDataStructure[]>();
  const [expenseData, setExpenseData] = useState<ExpenseDataStructure[]>();
  const [isDone, setDone] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const exportDataByMonth = async (firstDate: string, secondDate: string) => {
    try {
      setLoading(true);
      const req = await fetch(
        `/api/${type.type}?date=${firstDate}&second=${secondDate}`
      );
      setLoading(false);

      const data = await req.json();
      if (req.ok) {
        if (type.type == "sales") {
          if (!data.length) {
            setSalesData([]);
            toast({
              title: "FAILED: No sales found",
              description: "No sales found on the selected month.",
              variant: "destructive",
            });
          }
          setDone(true);
          setSalesData(data);
        } else {
          if (!data.length) {
            setExpenseData([]);
            toast({
              title: "FAILED: No sales found",
              description: "No sales found on the selected month.",
              variant: "destructive",
            });
          }
          setDone(true);
          setExpenseData(data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex gap-2 flex-col">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("", !firstMonth && "text-muted-foreground")}
          >
            {firstMonth ? (
              format(firstMonth, "MMMM-yyyy")
            ) : (
              <span>Pick a month</span>
            )}
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
                options
              ).format(currentMonth);
              const [month, year] = formattedDate.split("/");
              const formattedDateISO = `${year}-${month}-01`;
              setFirstMonth(currentMonth);
              setFirstDate(formattedDateISO);
            }}
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("", !secondMonth && "text-muted-foreground")}
          >
            {secondMonth ? (
              format(secondMonth, "MMMM-yyyy")
            ) : (
              <span>Pick a month</span>
            )}
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
                options
              ).format(currentMonth);
              const [month, year] = formattedDate.split("/");
              const formattedDateISO = `${year}-${month}-31`;
              setSecondMonth(currentMonth);
              setSecondDate(formattedDateISO);
            }}
          />
        </PopoverContent>
      </Popover>
      {!isDone ? (
        <Button
          className="flex-1"
          variant={"outline"}
          onClick={async () => {
            await exportDataByMonth(firstDate, secondDate);
          }}
        >
          {isLoading ? <LoaderCircleIcon className="animate-spin" /> : ""}
          Save
        </Button>
      ) : (
        <div className="flex flex-col">
          {type.type == "sales" ? (
            <>
              {salesData?.length == 0 ? (
                <Button
                  variant={"outline"}
                  onClick={async () => {
                    await exportDataByMonth(firstDate, secondDate);
                  }}
                >
                  {isLoading ? (
                    <LoaderCircleIcon className="animate-spin" />
                  ) : (
                    ""
                  )}
                  Save
                </Button>
              ) : (
                <SalesFinanceCard data={salesData || []} />
              )}
            </>
          ) : (
            <>
              {expenseData?.length == 0 ? (
                <Button
                  variant={"outline"}
                  onClick={async () => {
                    await exportDataByMonth(firstDate, secondDate);
                  }}
                >
                  {isLoading ? (
                    <LoaderCircleIcon className="animate-spin" />
                  ) : (
                    ""
                  )}
                  Save
                </Button>
              ) : (
                <ExpenseFinanceCard data={expenseData || []} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
