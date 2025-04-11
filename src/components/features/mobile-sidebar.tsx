"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Crown, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MobileNavigation } from "@/constant/constant";

export default function MobileSidebar() {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Crown className="h-6 w-6" />
            <span className="">La Pagana Inc.</span>
          </Link>
          {MobileNavigation.map((navigation, key) => {
            return (
              <Link
                href={navigation.link}
                className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground ${
                  pathname == navigation.link ? "bg-muted text-primary" : ""
                }`}
                key={key}
              >
                {navigation.icon}
                {navigation.name}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
