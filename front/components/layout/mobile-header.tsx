"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80 lg:hidden">
      <Link href="/" className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <span className="text-lg font-bold">finStock</span>
      </Link>
      <ThemeToggle compact />
    </header>
  );
}
