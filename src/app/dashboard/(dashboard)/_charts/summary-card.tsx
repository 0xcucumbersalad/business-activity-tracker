import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, MinusIcon } from "lucide-react";
export default function SummaryCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: number;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p
          className={`text-xs ${
            trend > 0
              ? "text-green-500"
              : trend < 0
                ? "text-red-500"
                : "text-gray-500"
          } flex items-center`}
        >
          {trend > 0 ? (
            <TrendingUp className="mr-1 h-4 w-4" />
          ) : trend < 0 ? (
            <TrendingDown className="mr-1 h-4 w-4" />
          ) : (
            <MinusIcon className="mr-1 h-4 w-4" />
          )}
          {Math.abs(trend)}% from last month
        </p>
      </CardContent>
    </Card>
  );
}
