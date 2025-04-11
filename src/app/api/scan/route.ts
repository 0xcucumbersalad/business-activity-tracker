import { GoogleGenerativeAIError } from "@google/generative-ai";
import { ScanReceipt } from "@/use-case/scan-receipt";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const GET = async function GET() {
  return Response.json({ message: "Not authenticated" }, { status: 401 });
};

export const POST = async function POST(req: NextRequest) {
  const { image } = await req.json();
  if (!image)
    return Response.json({ message: "No image supplied" }, { status: 404 });
  try {
    const scan = await ScanReceipt(image);

    return Response.json({ message: scan });
  } catch (error) {
    if (error instanceof GoogleGenerativeAIError) {
      return Response.json({ message: error.message }, { status: 403 });
    } else {
      return Response.json({ message: "unknown error" });
    }
  }
};
