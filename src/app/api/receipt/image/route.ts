import { NextRequest } from "next/server";
import { getFileUrl, deleteFileUrl } from "@/lib/files";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("image_uuid");

  if (id) {
    const image = await getFileUrl(id);
    return Response.json({ message: image });
  } else {
    return Response.json({ message: "No uuid provided" });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("image_uuid");

  if (id) {
    const status = await deleteFileUrl(id);

    if (status == 204) {
      return Response.json({ status: status });
    } else {
      return Response.json({ status: status });
    }
  } else {
    return Response.json({ message: "No uuid provided" }, { status: 400 });
  }
}
