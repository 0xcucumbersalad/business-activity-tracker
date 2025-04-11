"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
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
import { Skeleton } from "@/components/ui/skeleton"; // ShadCN Skeleton import
import { useState, useEffect } from "react";

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type Data = {
  month: string;
  total_sales: number;
  total_expenses: number;
};

export default function ReceiptChartDashboard() {
  const [chartData, setChartData] = useState<Data[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    const getReceiptTotal = async () => {
      const res = await fetch("/api/total");
      const data = await res.json();

      // Create an array of all months
      const allMonths = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(currentYear, i);
        return {
          month: date.toISOString(),
          total_sales: 0,
          total_expenses: 0,
        };
      });

      // Merge API data with all months
      const mergedData = allMonths.map((monthData) => {
        const apiData = data?.receiptTotal?.find(
          (d: Data) =>
            new Date(d.month).getMonth() ===
            new Date(monthData.month).getMonth(),
        );
        return apiData || monthData;
      });

      setChartData(mergedData);
      setIsLoading(false); // Set loading to false after data is fetched
    };

    getReceiptTotal();
  }, []);

  // Convert the month to a Date object and format it
  const formattedChartData = chartData?.map((data) => {
    const monthDate = new Date(data.month);
    return {
      ...data,
      month: monthDate.toLocaleString("default", {
        month: "short",
      }),
    };
  });

  const [activeChart, setActiveChart] = React.useState<
    keyof typeof chartConfig | null
  >(null);

  const totals = React.useMemo(() => {
    const sales = formattedChartData.reduce(
      (acc, curr) => acc + (curr?.total_sales || 0),
      0,
    );
    const expenses = formattedChartData.reduce(
      (acc, curr) => acc + (curr?.total_expenses || 0),
      0,
    );
    const netIncome = sales - expenses;
    return { sales, expenses, netIncome };
  }, [formattedChartData]);

  return (
    <div className="container mx-auto p-4">
      <p className="text-2xl font-bold my-2">Receipt Chart</p>
      <Card>
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>By Month</CardTitle>
            <CardDescription>
              {new Date(currentYear, currentMonth).toLocaleString("default", {
                month: "long",
              })}
            </CardDescription>
          </div>
          <div className="flex">
            {["sales", "expenses"].map((key) => {
              const chart = key as keyof typeof chartConfig;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                  onClick={() =>
                    setActiveChart(activeChart === chart ? null : chart)
                  }
                >
                  <span className="text-xs text-muted-foreground">
                    {chartConfig[chart].label}
                  </span>
                  <span className="text-lg font-bold leading-none sm:text-3xl">
                    ₱{totals[chart]?.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[350px] w-full"
          >
            {isLoading ? (
              // Show skeleton loader while data is loading
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formattedChartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 25,
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
                  <Legend
                    formatter={(value) =>
                      value === "total_sales" ? "Total Sales" : "Total Expenses"
                    }
                  />
                  <Bar
                    dataKey="total_sales"
                    name={"Sales"}
                    fill={chartConfig.sales.color}
                    opacity={activeChart === "expenses" ? 0.3 : 1}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="total_expenses"
                    name={"Expenses"}
                    fill={chartConfig.expenses.color}
                    opacity={activeChart === "sales" ? 0.3 : 1}
                    radius={[4, 4, 0, 0]}
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
