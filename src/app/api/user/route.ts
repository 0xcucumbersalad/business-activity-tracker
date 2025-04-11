import {
  getUserEmail,
  updateUserEmail,
  createUser,
  deleteUserById,
} from "@/data-access/users";
import { DrizzleError } from "drizzle-orm";
import { hashPassword } from "@/util/hashPassword";
import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { decrypt } from "@/auth/stateless-session";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const GET = async function GET() {
  const headersList = headers();
  const session = headersList.get("Authorization")?.split(" ")[1];
  const cookie = cookies().get("session")?.value;

  const user = await decrypt(session || cookie);

  return Response.json({
    id: user?.userId,
    email: user?.email,
    expiresAt: user?.expiresAt,
  });
};

export const POST = async function POST(req: NextRequest) {
  const data = await req.json();

  data.password = hashPassword(data.password);

  if (data) {
    const isExist = await getUserEmail(data.email);
    if (isExist)
      return Response.json(
        { message: "Email already existed" },
        { status: 400 },
      );
    const user = await createUser(data);
    return Response.json(user);
  }
  return Response.json({ message: "Not authenticated" }, { status: 401 });
};

export const PATCH = async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data?.password)
      return Response.json({ message: "Empty password" }, { status: 400 });

    const user = await getUserEmail(data.email);

    data.password = hashPassword(data.password);

    if (data?.id != user?.id)
      return Response.json(
        { message: "This email  already exist." },
        { status: 400 },
      );

    if (user) {
      const result = await updateUserEmail(data);
      return Response.json(result);
    }
  } catch (error) {
    if (error instanceof DrizzleError) {
      return Response.json({ message: error.message }, { status: 400 });
    } else {
      return Response.json({ message: "unknown error" });
    }
  }
  return Response.json({ message: "Not authenticated" }, { status: 401 });
};

export const DELETE = async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (id) {
      const result = await deleteUserById(id);
      return Response.json(result);
    }
  } catch (error) {
    if (error instanceof DrizzleError) {
      return Response.json({ message: error.message }, { status: 400 });
    } else {
      return Response.json({ message: "unknown error" });
    }
  }
  return Response.json({ message: "Not authenticated" }, { status: 401 });
};
