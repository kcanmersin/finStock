import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Toaster } from "sonner";
import { CapacitorInit } from "@/components/providers/capacitor-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "finStock - Fon & Hisse Analiz",
  description: "Turkiye yatirim fonlari ve hisse senetleri analiz platformu",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "finStock",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020817" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CapacitorInit />
          <div className="flex h-[100dvh] overflow-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <MobileHeader />
              <main className="flex-1 overflow-y-auto overscroll-contain scroll-smooth">
                <div className="container mx-auto px-4 py-4 pb-20 lg:px-8 lg:py-8 lg:pb-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
          <BottomNav />
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
