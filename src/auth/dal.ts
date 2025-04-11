import "server-only";
import { cache } from "react";
import { verifySession } from "./stateless-session";
import { getUserById } from "@/data-access/users";

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const user = await getUserById(session.userId);

    return user;
  } catch (error) {
    console.log(error);
    console.log("Failed to fetch user");
    return null;
  }
});
