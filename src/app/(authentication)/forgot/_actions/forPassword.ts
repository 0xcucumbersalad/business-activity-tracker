"use server";

import { Resend } from "resend";
import { forgotPasswordEmailTemplate } from "@/lib/password-reset-template";
import createPasswordLink from "@/use-case/password-reset";
import { getUserEmail } from "@/data-access/users";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ForgotPasswordState {
  success: boolean;
  message: string;
}

export async function sendForgotPasswordEmail(
  prevState: ForgotPasswordState | null,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const email = formData.get("email");

  if (!email || typeof email !== "string") {
    return { success: false, message: "Email is required" };
  }

  try {
    const user = await getUserEmail(email);
    if (!user) return { success: false, message: "Email does not exists" };

    const resetLink = await createPasswordLink(user.id);
    const emailHtml = forgotPasswordEmailTemplate(resetLink);

    await resend.emails.send({
      from: "Lapagan Inc. <no-reply@lapagana.jwisnetwork.com>",
      to: user.email,
      subject: "Reset Your Password",
      html: emailHtml,
    });

    return { success: true, message: "Password reset email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send password reset email" };
  }
}
