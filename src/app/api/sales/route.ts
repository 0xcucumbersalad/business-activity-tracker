import { DrizzleError } from "drizzle-orm";
import {
  getManualSale,
  createManualSale,
  updateManualSale,
  deleteManualSale,
  getManualSaleByMonth,
} from "@/data-access/sales";
import { LibsqlError } from "@libsql/client";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const GET = async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  const second = req.nextUrl.searchParams.get("second");
  if (true) {
    //removed auth check
    if (date && second) {
      const sales = await getManualSaleByMonth(date, second);
      return Response.json(sales);
    } else {
      const sales = await getManualSale();
      return Response.json(sales);
    }
  }
  return Response.json({ message: "Not authenticated" }, { status: 401 });
};

export const POST = async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const category = await createManualSale(data);
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

export const PATCH = async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();

    const category = await updateManualSale(data);

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

export const DELETE = async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    const category = await deleteManualSale(id);

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
