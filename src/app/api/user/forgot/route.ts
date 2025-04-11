import { forgotPasswordEmailTemplate } from "@/lib/password-reset-template";
import { Resend } from "resend";
import { env } from "@/env";
const resend = new Resend(env.RESEND_API_KEY);
import { NextRequest } from "next/server";
import { getUserEmail } from "@/data-access/users";
import createPasswordLink from "@/use-case/password-reset";

export async function POST(req: NextRequest) {
  const data = await req.json();

  if (data) {
    const email = data.email;
    try {
      const user = await getUserEmail(email);

      if (!user) {
        return Response.json(
          { message: "email does not exists" },
          { status: 404 },
        );
      }

      const resetLink = await createPasswordLink(user.id);

      const { data, error } = await resend.emails.send({
        from: "Lapagan Inc. <no-reply@lapagana.jwisnetwork.com>",
        to: user.email,
        subject: "Reset Your Password",
        html: forgotPasswordEmailTemplate(resetLink),
      });

      if (error) {
        return Response.json({ error }, { status: 500 });
      }

      return Response.json({ data, link: resetLink });
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }
  } else {
    return Response.json({ message: "Error" }, { status: 500 });
  }
}
