"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PieChart, TrendingUp, FileBarChart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { hapticImpact } from "@/lib/capacitor";

const navItems = [
  { href: "/fonlar", label: "Fonlar", icon: PieChart },
  { href: "/hisseler", label: "Hisseler", icon: TrendingUp },
  { href: "/analizler", label: "Analizler", icon: FileBarChart },
  { href: "/ai-prompt", label: "AI Analiz", icon: Sparkles },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/80 lg:hidden">
      <div className="flex items-center justify-around pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => hapticImpact("light")}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium",
                "transition-all duration-200 active:scale-90",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-primary"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isActive && "scale-110"
                )}
              />
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary transition-all duration-300" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
