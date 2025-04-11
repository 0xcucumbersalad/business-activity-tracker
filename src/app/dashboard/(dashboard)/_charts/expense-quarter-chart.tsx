"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

const chartConfig = {
  expenses: {
    label: "Expenses",
    color: "hsl(162, 47%, 50%)", // Teal color from the previous image
  },
} satisfies ChartConfig;

type MonthlyData = {
  month: string;
  total_expense: number;
};

const quarters = [
  { value: "1", label: "Q1 (Jan-Mar)" },
  { value: "2", label: "Q2 (Apr-Jun)" },
  { value: "3", label: "Q3 (Jul-Sep)" },
  { value: "4", label: "Q4 (Oct-Dec)" },
];

export default function ExpenseQuarterChart() {
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const [selectedQuarter, setSelectedQuarter] = useState("1");
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const getReceiptTotal = async () => {
      try {
        const res = await fetch("/api/total");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();

        // Create an array of all months
        const allMonths = Array.from({ length: 12 }, (_, i) => {
          const date = new Date(currentYear, i);
          return {
            month: date.toISOString(),
            total_expense: 0,
          };
        });

        // Merge API data with all months
        const mergedData = allMonths.map((monthData) => {
          const apiData = data?.totalExpense?.find(
            (d: MonthlyData) =>
              new Date(d.month).getMonth() ===
              new Date(monthData.month).getMonth(),
          );
          return apiData || monthData;
        });

        setChartData(mergedData);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setError("Error loading data.");
        setIsLoading(false);
      }
    };

    getReceiptTotal();
  }, []);

  // Format months to short names (Jan, Feb, etc.)
  const formattedChartData = chartData.map((data) => ({
    ...data,
    month: new Date(data.month).toLocaleString("default", { month: "short" }),
  }));

  // Filter data for selected quarter
  const filteredChartData = formattedChartData.filter((data, index) => {
    const quarter = Math.floor(index / 3) + 1;
    return quarter.toString() === selectedQuarter;
  });

  const totalExpenses = React.useMemo(() => {
    return filteredChartData.reduce(
      (acc, curr) => acc + (curr?.total_expense || 0),
      0,
    );
  }, [filteredChartData]);

  return (
    <div className="container mx-auto p-4">
      <p className="text-2xl font-bold my-2">No Receipt Expense Chart</p>
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>By Quarter</CardTitle>
            <CardDescription>{currentYear}</CardDescription>
          </div>
          <div className="flex items-center px-6">
            <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select quarter" />
              </SelectTrigger>
              <SelectContent>
                {quarters.map((quarter) => (
                  <SelectItem key={quarter.value} value={quarter.value}>
                    {quarter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex">
            <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
              <span className="text-xs text-muted-foreground">
                {chartConfig.expenses.label}
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {error ? (
                  <span className="text-red-500">Error loading data</span>
                ) : isLoading ? (
                  <Skeleton className="h-8 w-40" />
                ) : (
                  `₱${totalExpenses.toLocaleString()}`
                )}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[350px] w-full"
          >
            {isLoading || error ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent className="w-[200px]" />}
                  />
                  <Bar
                    dataKey="total_expense"
                    fill={chartConfig.expenses.color}
                    name="Expenses"
                    radius={[4, 4, 4, 4]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
