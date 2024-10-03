import type { Metadata } from "next";
import "./globals.css";
import ConvexAndClerk from "@/providers/ConvexAndClerk";
import { Toaster } from "react-hot-toast";
import { poppinsFont } from "@/lib/font";
import ScreenProvider from "@/providers/ScreenProvider";
import React from "react";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: "Resume Craft",
  description: "Craft a winning resume in minutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppinsFont.className}>
        <ConvexAndClerk>
          <ScreenProvider>
            <Analytics />
            <SpeedInsights />
            {" "}
            <Toaster />
            {children}
          </ScreenProvider>
        </ConvexAndClerk>
      </body>
    </html>
  );
}
