"use client";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Circle } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import ChartSkeleton from "@/components/ui/chart-skeleton";

type CategoryTotal = {
  name: string;
  total: number;
};

export default function ExpenseCategoryPieChart() {
  const [chartData, setChartData] = useState<CategoryTotal[]>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getTotal = async () => {
      const getData = await (
        await fetch("/api/expense/categories/analytics?month=true")
      ).json();

      setChartData(getData);
      setLoading(false);
    };

    getTotal();
  }, []);

  function getRandomColor() {
    const hue = Math.floor(Math.random() * 360); // Random hue (0-360)
    return `hsl(${hue}, 70%, 50%)`;
  }

  const chartDataWithColors = chartData?.map((data) => ({
    ...data,
    color: getRandomColor(),
  }));

  const totalExpenseCount = chartData?.reduce(
    (total, entry) => total + entry.total,
    0,
  );

  if (loading) {
    return <ChartSkeleton />;
  }

  return (
    <Card className="flex flex-col">
      {/* Card Header */}
      <CardHeader className="items-center pb-0">
        <CardTitle>Monthly Expense Distribution Chart</CardTitle>
      </CardHeader>

      {/* Chart */}
      <CardContent className="relative flex justify-center pb-0">
        {/* Enlarged Pie Chart */}
        <PieChart width={300} height={300}>
          <Pie
            data={chartDataWithColors}
            dataKey="total"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={3}
            strokeWidth={3}
          >
            {chartDataWithColors?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>

          <Tooltip formatter={(value, name) => [`${value} `, name]} />
        </PieChart>

        {/* Centered Total Visitors */}
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center">
          <p className="text-4xl font-bold">
            {totalExpenseCount?.toLocaleString()}
          </p>
          <p className="text-muted-foreground text-sm">Expense</p>
        </div>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex">
          {chartDataWithColors?.map((item, key) => {
            return (
              <div key={key} className="flex justify-center items-center">
                <div className="items-center flex p-1 gap-1">
                  <Circle color={`${item.color}`} />
                  <span className="font-mono">
                    {item.name.split(/sales/gi)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total expense distribution this month.
        </div>
      </CardFooter>
    </Card>
  );
}
