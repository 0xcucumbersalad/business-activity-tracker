import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RocketIcon } from "lucide-react";

export function AlertHeader() {
  return (
    <Alert className="animate-in">
      <RocketIcon className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        Feel free to modify the scanned records to ensure accuracy.
      </AlertDescription>
    </Alert>
  );
}
