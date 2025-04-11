import type { Metadata } from "next";
import "../globals.css";
import Sidebar from "@/components/features/web-sidebar";
import { Header } from "@/components/features/header";
import { Toaster } from "@/components/ui/toaster";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "La Pagana Dashboard",
  description: "La Pagana Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <Toaster />
        {children}
      </div>
    </div>
  );
}
