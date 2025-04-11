import { LoginForm } from "./form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="w-16 h-16 mx-auto mb-6">
            <Image
              src="https://cdn.jwisnetwork.com/logo.png"
              alt="Company Logo"
              className="w-full h-full object-contain"
              width={100}
              height={100}
            />
          </div>
          <CardTitle className="text-3xl font-bold text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-6 text-center text-sm">
            Don&apos;t have an account? <span>Contact Administrator</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
