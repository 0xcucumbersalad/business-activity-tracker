import { exportIncomeStatementByDate } from "@/use-case/export";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const GET = async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  const exportIncomeStatement = await exportIncomeStatementByDate(from, to);

  return Response.json(exportIncomeStatement);
};
