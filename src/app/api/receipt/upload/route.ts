import { NextResponse } from "next/server";
import { uploadFileToBucketFile } from "@/lib/files";
import { createUUID } from "@/util/uuid";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const blob = await req.blob();

    const uuid = createUUID();
    console.log(uuid);

    const upload = await uploadFileToBucketFile(blob, uuid);

    if (upload) {
      return NextResponse.json({ id: uuid });
    } else {
      return NextResponse.json(
        { status: "failed" },
        {
          status: 500,
        },
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: "fail", error: e });
  }
}
