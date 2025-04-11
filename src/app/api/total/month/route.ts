import {
  getSalesByMonth,
  getExpenseByMonth,
  getIncomeByMonth,
} from "@/use-case/total";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const GET = async function GET() {
  const sales = await getSalesByMonth();
  const expense = await getExpenseByMonth();
  const total = await getIncomeByMonth();

  return Response.json({
    sales,
    expense,
    total,
  });
  //return Response.json({ message: "Not authenticated" }, { status: 401 });
};
