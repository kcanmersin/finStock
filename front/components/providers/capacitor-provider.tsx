"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { hideSplash, setStatusBarColor, isNative } from "@/lib/capacitor";

/**
 * Capacitor native ozelliklerini baslatan bileşen.
 * Status bar rengini tema ile senkronize eder.
 * Splash screen'i gizler.
 * Layout icine <CapacitorInit /> olarak eklenir.
 */
export function CapacitorInit() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    hideSplash();
  }, []);

  useEffect(() => {
    if (!isNative()) return;
    if (resolvedTheme === "dark") {
      setStatusBarColor("#020817", false);
    } else {
      setStatusBarColor("#ffffff", true);
    }
  }, [resolvedTheme]);

  return null;
}
