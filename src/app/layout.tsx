import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Academic Management Dashboard",
  description: "A comprehensive academic management system for tracking students, courses, and faculty performance.",
  keywords: ["academic", "management", "dashboard", "students", "courses", "faculty", "grades"],
  authors: [{ name: "Academic Management Team" }],
  openGraph: {
    title: "Academic Management Dashboard",
    description: "Manage students, courses, and academic performance efficiently",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
