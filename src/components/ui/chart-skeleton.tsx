import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ChartSkeleton() {
  return (
    <Card className="flex flex-col">
      {/* Card Header */}
      <CardHeader className="items-center pb-0">
        <CardTitle className="h-6 w-3/4 animate-pulse bg-gray-200 rounded"></CardTitle>
      </CardHeader>

      {/* Chart Skeleton */}
      <CardContent className="relative flex justify-center pb-0">
        {/* Circular Skeleton */}
        <div className="w-[300px] h-[300px] relative">
          <div className="absolute inset-0 rounded-full border-8 border-gray-200 animate-pulse"></div>
          <div className="absolute inset-[30px] rounded-full border-8 border-gray-300 animate-pulse"></div>
        </div>

        {/* Centered Total Visitors Skeleton */}
        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center">
          <div className="h-10 w-24 mb-1 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
      </CardFooter>
    </Card>
  );
}
