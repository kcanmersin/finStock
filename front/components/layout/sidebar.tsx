"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PieChart, TrendingUp, FileBarChart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { href: "/fonlar", label: "Fonlar", icon: PieChart },
  { href: "/hisseler", label: "Hisseler", icon: TrendingUp },
  { href: "/analizler", label: "Analizler", icon: FileBarChart },
  { href: "/ai-prompt", label: "AI Analiz", icon: Sparkles },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">finStock</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <ThemeToggle />
        <p className="mt-3 px-3 text-xs text-muted-foreground">
          finStock v0.1.0
        </p>
      </div>
    </aside>
  );
}
