"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { sendForgotPasswordEmail } from "./_actions/forPassword";
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

interface ForgotPasswordState {
  success: boolean;
  message: string;
}

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [state, formAction] = useFormState<
    ForgotPasswordState | null,
    FormData
  >(sendForgotPasswordEmail, null);
  const { pending } = useFormStatus();

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
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription className="text-gray-500">
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-3 py-2"
              />
            </div>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Sending..." : "Reset Password"}
            </Button>
          </form>
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
