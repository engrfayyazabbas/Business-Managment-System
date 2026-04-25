import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "GoldenPhoenix Noodles BMS",
  description: "Business Management System for GoldenPhoenix Noodles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <Header />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
