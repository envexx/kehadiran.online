"use client";

import "@/styles/globals.css";
import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Button } from "@heroui/button";
import { List } from "phosphor-react";

import { Providers } from "./providers";
import { Sidebar } from "@/components/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <html suppressHydrationWarning lang="en" style={{ fontFamily: '"SN Pro", sans-serif' }}>
      <head>
        <title>Kehadiran - Sistem Presensi Digital</title>
        <meta name="description" content="Kehadiran - Sistem presensi digital modern untuk sekolah" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=SN+Pro:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{__html: `
          * { font-family: "SN Pro", sans-serif !important; }
          html, body { font-family: "SN Pro", sans-serif !important; }
        `}} />
      </head>
      <body 
        className={clsx(
          "min-h-screen text-foreground bg-background antialiased"
        )}
        style={{ fontFamily: '"SN Pro", sans-serif !important' }}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          {isLandingPage ? (
            <main className="min-h-screen">
              {children}
            </main>
          ) : (
            <div className="flex h-screen overflow-hidden">
              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
              
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header with Menu Button */}
                <div className="lg:hidden bg-background border-b border-divider/50 p-4 flex items-center gap-3">
                  <Button
                    isIconOnly
                    variant="light"
                    onPress={() => setSidebarOpen(true)}
                  >
                    <List size={24} />
                  </Button>
                  <h1 className="text-lg font-bold">Kehadiran</h1>
                </div>

                <main className="flex-1 overflow-y-auto">
                  {children}
                </main>
              </div>
            </div>
          )}
        </Providers>
      </body>
    </html>
  );
}
