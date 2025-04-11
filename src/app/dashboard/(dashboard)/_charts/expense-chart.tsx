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
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import { useState, useEffect } from "react";

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

const chartConfig = {
  sales: {
    label: "Expense",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Data = {
  month: string;
  total_expense: number;
};

export default function ExpenseChart() {
  const [chartData, setChartData] = useState<Data[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const getReceiptTotal = async () => {
      setIsLoading(true);
      const res = await fetch("/api/total");
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
          (d: Data) =>
            new Date(d.month).getMonth() ===
            new Date(monthData.month).getMonth(),
        );
        return apiData || monthData;
      });

      setChartData(mergedData);
      setIsLoading(false);
    };

    getReceiptTotal();
  }, []);

  // Convert the month to a Date object and format it
  const formattedChartData = chartData?.map((data) => {
    const monthDate = new Date(data.month);
    return {
      ...data,
      month: monthDate.toLocaleString("default", {
        month: "long",
      }),
    };
  });

  const totalSales = React.useMemo(() => {
    return formattedChartData.reduce(
      (acc, curr) => acc + (curr?.total_expense || 0),
      0,
    );
  }, [formattedChartData]);

  return (
    <div className="container mx-auto p-4">
      <p className="text-2xl font-bold my-2">No Receipt Expense</p>
      {isLoading ? (
        // Skeleton Loader
        <Card>
          <CardHeader className="p-6">
            <Skeleton className="h-6 w-1/3 mb-4" /> {/* Title Skeleton */}
            <Skeleton className="h-4 w-1/4" /> {/* Year Skeleton */}
          </CardHeader>
          <CardContent className="px-6">
            <Skeleton className="h-8 w-1/2 mb-6" />{" "}
            {/* Total Expense Skeleton */}
            <Skeleton className="h-56 w-full" /> {/* Chart Skeleton */}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <CardTitle>Total Expense</CardTitle>
              <CardDescription>
                {new Date(currentYear, currentMonth).toLocaleString("default", {
                  year: "numeric",
                })}
              </CardDescription>
            </div>
            <div className="flex">
              <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
                <span className="text-xs text-muted-foreground">
                  {chartConfig.sales.label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  ₱{totalSales.toLocaleString()}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[350px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formattedChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent className="w-[200px]" />}
                  />
                  <Bar
                    dataKey="total_expense"
                    name={"Expenses"}
                    fill={chartConfig.sales.color}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
