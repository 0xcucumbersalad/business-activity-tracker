"use client";
import Link from "next/link";
import { Crown } from "lucide-react";
import { usePathname } from "next/navigation";
import { Navigation } from "@/constant/constant";

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Crown className="h-6 w-6" />
            <span className="">La Pagana Inc.</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {Navigation.map((navigation, key) => {
              return (
                <Link
                  prefetch={false}
                  href={`${navigation.link}`}
                  className={`hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all  ${
                    pathname == navigation.link ? "bg-muted text-primary" : ""
                  }`}
                  key={key}
                  passHref
                >
                  {navigation.icon}
                  {navigation.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
