import { getSaleCategory } from "@/data-access/category";
import {
  createSaleCategory,
  deleteSaleCategory,
  updateSaleCategory,
} from "@/data-access/category";
import { DrizzleError } from "drizzle-orm";
import { LibsqlError } from "@libsql/client";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const GET = async function GET() {
  const categories = await getSaleCategory();
  return new Response(JSON.stringify(categories));
};

export const POST = async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const category = await createSaleCategory(data);

    revalidatePath("/dashboard/sales/category");
    return new Response(
      JSON.stringify({
        message: category,
      }),
    );
  } catch (error) {
    if (error instanceof LibsqlError) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 400,
      });
    } else {
      console.log(error);
      return new Response(JSON.stringify({ message: "unknown error" }));
    }
  }
};

export const PATCH = async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();

    const category = await updateSaleCategory(data);

    return new Response(
      JSON.stringify({
        message: category,
      }),
    );
  } catch (error) {
    if (error instanceof DrizzleError) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 400,
      });
    } else {
      console.log(error);
      return new Response(JSON.stringify({ message: "unknown error" }));
    }
  }
};

export const DELETE = async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    const category = await deleteSaleCategory(id);

    return new Response(
      JSON.stringify({
        message: category,
      }),
    );
  } catch (error) {
    if (error instanceof DrizzleError) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 400,
      });
    } else {
      console.log(error);
      return new Response(JSON.stringify({ message: "unknown error" }));
    }
  }
};
