import { getExpenseCategory } from "@/data-access/category";
import {
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
} from "@/data-access/category";
import { DrizzleError } from "drizzle-orm";
export const dynamic = "force-dynamic";

export const GET = async function GET() {
  const categories = await getExpenseCategory();
  return Response.json(categories);
};

export const POST = async function POST(req: Request) {
  try {
    const data = await req.json();

    const category = await createExpenseCategory(data);

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

export const PATCH = async function PATCH(req: Request) {
  try {
    const data = await req.json();

    const category = await updateExpenseCategory(data);

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

    const category = await deleteExpenseCategory(id);

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
