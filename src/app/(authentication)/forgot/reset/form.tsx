"use client";

import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { ResetPassword } from "./_actions/resetPassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

interface ForgotPasswordState {
  success: boolean;
  message: string;
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [hash, setHash] = useState<string | null>(null);
  const [state, formAction] = useFormState<
    ForgotPasswordState | null,
    FormData
  >(ResetPassword, null);
  const { pending } = useFormStatus();

  useEffect(() => {
    const urlHash = params.get("hash");
    setHash(urlHash);
  }, [params]);

  if (state?.success) {
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="w-16 h-16 mx-auto mb-6">
            <Image
              src="https://cdn.jwisnetwork.com/logo.png"
              alt="Company Logo"
              className="w-full h-full object-contain"
              width={100}
              height={100}
            />
          </div>

          <CardTitle className="text-2xl font-bold">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-gray-500">
            Enter your new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hash ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Invalid Reset Hash or Password Link
              </AlertDescription>
            </Alert>
          ) : (
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hash" className="text-sm font-medium">
                  Password Reset Hash
                </Label>
                <Input
                  type="text"
                  id="hash"
                  name="hash"
                  value={hash}
                  required
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100"
                />

                <Label htmlFor="password" className="text-sm font-medium">
                  New Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your new password"
                  className="w-full px-3 py-2"
                />
              </div>
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </CardContent>
        {state && (
          <CardFooter>
            <Alert
              variant={state.success ? "default" : "destructive"}
              className="w-full"
            >
              <AlertTitle>{state.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
