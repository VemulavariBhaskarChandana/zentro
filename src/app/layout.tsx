import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Suspense, type ReactNode } from "react";
import { NavigationFeedback } from "@/components/navigation-feedback";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZENTRO — Find Your Direction. Build Your Future.",
  description:
    "Discover projects, explore technologies and get the guidance you need to build with confidence.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Suspense fallback={null}>
          <NavigationFeedback />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
