"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data for different time periods
const timePeriodsData = {
  "30": [
    { name: "6010 Online Marketing", value: 10000 },
    { name: "6020 Subscriptions", value: 6000 },
    { name: "6090 Depreciation", value: 2000 },
  ],
  "90": [
    { name: "6010 Online Marketing", value: 25000 },
    { name: "6020 Subscriptions", value: 18000 },
    { name: "6090 Depreciation", value: 6000 },
  ],
  "365": [
    { name: "6010 Online Marketing", value: 120000 },
    { name: "6020 Subscriptions", value: 72000 },
    { name: "6090 Depreciation", value: 24000 },
  ],
};

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
];

export default function ExpensesCard() {
  const [period, setPeriod] = useState("30");
  const data = timePeriodsData[period as keyof typeof timePeriodsData];
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold">EXPENSES</CardTitle>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-4xl font-bold text-foreground">
              ${total.toLocaleString()}.00
            </div>
            <div className="text-lg text-muted-foreground">Total expenses</div>
          </div>

          <div className="grid grid-cols-[1fr,200px] gap-4">
            <div className="space-y-4">
              {data.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-xl font-semibold">
                      ${item.value.toLocaleString()}.00
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.name}
                  </div>
                </div>
              ))}
            </div>

            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
