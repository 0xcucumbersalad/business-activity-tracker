import { deleteSession } from "@/auth/stateless-session";
import { Button } from "@/components/ui/button";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        deleteSession();
      }}
    >
      <Button variant={"ghost"}>Sign Out</Button>
    </form>
  );
}
