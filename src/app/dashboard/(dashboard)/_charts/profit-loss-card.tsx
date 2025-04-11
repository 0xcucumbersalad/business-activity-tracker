"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component

// Define types for data
type ReceiptData = {
  month: string;
  total_sales: number;
  total_expenses: number;
};

type SalesData = {
  month: string;
  total_sales: number;
};

type ExpenseData = {
  month: string;
  total_expense: number;
};

function mergeReceiptData(
  receiptTotal: ReceiptData[],
  totalSales: SalesData[],
  totalExpense: ExpenseData[],
): ReceiptData[] {
  return receiptTotal.map((receipt) => {
    const matchingSales = totalSales.find(
      (sale) => sale.month === receipt.month,
    );
    const matchingExpense = totalExpense.find(
      (expense) => expense.month === receipt.month,
    );

    return {
      ...receipt,
      total_sales: receipt.total_sales + (matchingSales?.total_sales || 0),
      total_expenses:
        receipt.total_expenses + (matchingExpense?.total_expense || 0),
    };
  });
}

export default function InteractiveProfitLossCard() {
  const currentMonth = new Date().toISOString().slice(0, 7); // Get the current month in YYYY-MM format
  const [period, setPeriod] = useState<string>(currentMonth); // Default to current month
  const [isLoading, setIsLoading] = useState(false);
  const [mergedData, setMergedData] = useState<ReceiptData[]>([]);

  useEffect(() => {
    const getTotal = async () => {
      setIsLoading(true);
      const req = await fetch("api/total");
      const data = await req.json();
      const receiptTotal = data?.receiptTotal;
      const totalSales = data?.totalSales;
      const totalExpense = data?.totalExpense;

      const merged = mergeReceiptData(receiptTotal, totalSales, totalExpense);

      setMergedData(merged);
      setIsLoading(false);
    };
    getTotal();
  }, []);

  const selectedData = mergedData.find((data) => data.month === period);

  // Calculate the percentage change from the previous month
  const previousMonthData = mergedData.find(
    (data) => data.month === getPreviousMonth(period),
  );

  const percentageChange = previousMonthData
    ? (((selectedData?.total_sales || 0) - previousMonthData.total_sales) /
        previousMonthData.total_sales) *
      100
    : 0;

  function getPreviousMonth(currentMonth: string): string {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().slice(0, 7); // Return previous month in YYYY-MM format
  }

  return (
    <Card className="w-full max-w-md">
      {isLoading ? (
        // Skeleton Loader
        <div className="space-y-4 p-4">
          <Skeleton className="h-8 w-3/5" />
          <Skeleton className="h-6 w-2/5" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      ) : (
        <>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <CardTitle className="text-2xl font-bold">
              PROFIT AND LOSS
            </CardTitle>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {mergedData.map((data) => (
                  <SelectItem key={data.month} value={data.month}>
                    {new Date(data.month).toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          {selectedData && (
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div
                  className={`text-4xl font-bold ${
                    selectedData.total_sales - selectedData.total_expenses >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedData.total_sales - selectedData.total_expenses >= 0
                    ? "+"
                    : "-"}
                  ₱
                  {Math.abs(
                    selectedData.total_sales - selectedData.total_expenses,
                  ).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Net income for{" "}
                  {new Date(selectedData.month).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>

              {/* Display Percentage Change */}
              {previousMonthData && (
                <div
                  className={`flex items-center space-x-1 ${
                    percentageChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  <span className={`font-bold`}>
                    {percentageChange >= 0 ? "↑" : "↓"}{" "}
                    {Math.abs(percentageChange).toFixed(2)}% from last month
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Income</span>
                    <span className="text-sm font-medium">
                      ₱{selectedData.total_sales.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={
                      (selectedData.total_sales /
                        Math.max(
                          selectedData.total_sales,
                          selectedData.total_expenses,
                        )) *
                      100
                    }
                    className="h-2 bg-secondary"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Expenses</span>
                    <span className="text-sm font-medium">
                      ₱{selectedData.total_expenses.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={
                      (selectedData.total_expenses /
                        Math.max(
                          selectedData.total_sales,
                          selectedData.total_expenses,
                        )) *
                      100
                    }
                    className="h-2 bg-secondary"
                  />
                </div>
              </div>
            </CardContent>
          )}
        </>
      )}
    </Card>
  );
}
