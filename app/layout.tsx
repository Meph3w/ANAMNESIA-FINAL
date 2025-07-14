import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ClientLayout } from "./client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AnamnesIA",
  description: "Chat Médico com IA - De médico para médico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
