import "./globals.css";
import RootLayoutClient from "@/components/layout/root-layout";

export const metadata = {
  title: 'HR Management System',
  description: 'A comprehensive HR management system for modern organizations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-background font-sans text-foreground">
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
