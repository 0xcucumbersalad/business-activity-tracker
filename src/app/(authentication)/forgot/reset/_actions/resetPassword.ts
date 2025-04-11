"use server";

import { getUserbyHash, updateHash } from "@/use-case/password-reset";
import { updateUserPasswordById } from "@/data-access/users";
import { hashPassword } from "@/util/hashPassword";

interface ResetPasswordState {
  success: boolean;
  message: string;
}

export async function ResetPassword(
  prevState: ResetPasswordState | null,
  formData: FormData,
): Promise<ResetPasswordState> {
  const password = formData.get("password");
  const hash = formData.get("hash");

  if (!hash || typeof hash !== "string") {
    return { success: false, message: "Hash is required" };
  }
  if (!password || typeof password !== "string") {
    return { success: false, message: "Password is required" };
  }

  try {
    const userHash = await getUserbyHash(hash);
    if (!userHash)
      return { success: false, message: "Hash is invalid or expired" };

    if (!userHash.active)
      return { success: false, message: "Hash is invalid or expired" };

    const updatePassword = await updateUserPasswordById(
      userHash.user_id,
      hashPassword(password),
    );

    if (!updatePassword) {
      return { success: false, message: "Unable to update password" };
    }

    await updateHash(userHash.id, 0);

    return { success: true, message: "Password has been successfully reset" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to reset password" };
  }
}
