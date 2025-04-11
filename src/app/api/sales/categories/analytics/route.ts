import { getSalesCategoryTotal, getSaleCategoryMonthlyTotal } from "@/data-access/category_analytics";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const GET = async function GET(req: NextRequest) {
    const month = req.nextUrl.searchParams.get('month');

     if(month) {
            const total = await getSaleCategoryMonthlyTotal();
            return Response.json(total);
        }
    const total = await getSalesCategoryTotal();
    return Response.json(total);
  };