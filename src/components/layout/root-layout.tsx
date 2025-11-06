"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { AuthProvider } from "@/contexts/auth-context";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <AuthProvider>
      {isLoginPage ? (
        children
      ) : (
        <div className="relative flex h-screen overflow-hidden">
          <div className="hidden w-64 shrink-0 border-r border-border bg-background/95 backdrop-blur-sm md:flex">
            <Sidebar />
          </div>
          <div className="flex w-full flex-1 flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top,rgba(93,52,127,0.4),transparent_50%)]">
            <Navbar />
            <main className="relative flex-1 overflow-y-auto px-6 py-8">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="relative mx-auto max-w-7xl">
                {children}
              </div>
            </main>
          </div>
        </div>
      )}
    </AuthProvider>
  );
}