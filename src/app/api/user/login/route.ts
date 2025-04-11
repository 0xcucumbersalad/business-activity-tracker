import { getUserEmail } from "@/data-access/users";
import { NextRequest } from "next/server";
import { verifyPassword } from "@/util/hashPassword";
import { createSessionMobile } from "@/auth/stateless-session";
import { LoginFormSchema } from "@/auth/definition";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const POST = async function POST(req: NextRequest) {
  const errorMessage = { message: "Invalid login credentials." };
  const data = await req.json();

  if (data) {
    const validatedFields = LoginFormSchema.safeParse({
      email: data.email,
      password: data.password,
    });

    if (!validatedFields.success) {
      return Response.json(validatedFields.error.flatten().fieldErrors);
    }

    const user = await getUserEmail(validatedFields.data.email);

    if (!user) return Response.json(errorMessage, { status: 404 });

    const isPasswordMatch = verifyPassword(
      validatedFields.data.password,
      user.password,
    );

    if (!isPasswordMatch) return Response.json(errorMessage, { status: 404 });

    const userId = user.id.toString();
    const session = await createSessionMobile(userId, user.email);

    return Response.json({ session });
  }
  return Response.json({ message: "Not authenticated" }, { status: 401 });
};
