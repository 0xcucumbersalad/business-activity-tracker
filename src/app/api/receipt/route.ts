import {
  createReceiptUseCase,
  deleteReceiptUseCase,
  updateReceiptUseCase,
} from "@/use-case/receipt";
import {
  getReceiptsbyDate,
  getReceipts,
  getReceiptsbyDateType,
} from "@/data-access/receipts";
import { DrizzleError } from "drizzle-orm";
import { NextRequest } from "next/server";
import { getReceiptById } from "@/data-access/receipts";
import { getItemsById } from "@/data-access/receipt_items";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const GET = async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const id = searchParams.get("id");

  if (type && from && to) {
    if (type == "All") {
      const receipts = await getReceiptsbyDate(from, to);
      console.log(receipts);
      return Response.json(receipts);
    }
    const receipts = await getReceiptsbyDateType(type, from, to);
    return Response.json(receipts);
  }
  if (id) {
    const receipt = await getReceiptById(Number(id));
    const items = await getItemsById(Number(id));

    const formattedReceipt = {
      ...receipt,
      items: [...items],
    };

    if (receipt) {
      return Response.json(formattedReceipt);
    }
    return Response.json({});
  }
  const receipts = await getReceipts();
  return Response.json(receipts);
};

export const POST = async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const receipt = await createReceiptUseCase(data);

    return Response.json({
      message: receipt,
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

export const PATCH = async function PATCH(req: NextRequest) {
  const data = await req.json();
  const result = await updateReceiptUseCase(data);
  return Response.json({ message: result });
};

export const DELETE = async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const image_uuid = req.nextUrl.searchParams.get("image_uuid");

  if (id && image_uuid) {
    const remove = await deleteReceiptUseCase({ id, image_uuid });
    if (remove) {
      return Response.json({ message: { remove } }, { status: 200 });
    } else if (!remove) {
      return Response.json(
        { message: "Receipt does not exist" },
        { status: 400 },
      );
    }
  } else {
    return Response.json({ message: "No id provided" }, { status: 400 });
  }
};
