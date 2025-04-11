import { DrizzleError } from "drizzle-orm";
import {
  getManualExpense,
  createExpenseSale,
  updateExpenseSale,
  deleteExpenseSale,
  getManualExpenseByMonth,
} from "@/data-access/expenses";
import { LibsqlError } from "@libsql/client";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const GET = async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const date = searchParams.get("date");
  const second = searchParams.get("second");
  if (date && second) {
    const expense = await getManualExpenseByMonth(date, second);
    return Response.json(expense);
  } else {
    const expense = await getManualExpense();
    return Response.json(expense);
  }
};

export const POST = async function POST(req: Request) {
  try {
    const data = await req.json();
    const category = await createExpenseSale(data);
    return Response.json({
      message: category,
    });
  } catch (error) {
    if (error instanceof LibsqlError) {
      return Response.json({ message: error.message }, { status: 400 });
    } else {
      console.log(error);
      return Response.json({ message: "unknown error" });
    }
  }
};

export const PATCH = async function PATCH(req: Request) {
  try {
    const data = await req.json();

    const category = await updateExpenseSale(data);

    return Response.json({
      message: category,
    });
  } catch (error) {
    if (error instanceof DrizzleError) {
      return Response.json({ message: error.message }, { status: 400 });
    } else {
      console.log(error);
      return Response.json({ message: "unknown error" });
    }
  }
};

export const DELETE = async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    const category = await deleteExpenseSale(id);

    return Response.json({
      message: category,
    });
  } catch (error) {
    if (error instanceof DrizzleError) {
      return Response.json({ message: error.message }, { status: 400 });
    } else {
      console.log(error);
      return Response.json({ message: "unknown error" });
    }
  }
};
