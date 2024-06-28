import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ConvexAndClerk from "@/providers/ConvexAndClerk";
import { fontMap } from "@/utils/font";
import { Toaster } from "react-hot-toast";


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
      <body className={fontMap.Poppins.className}>
        <ConvexAndClerk>
            <Toaster />
          {children}</ConvexAndClerk>
      </body>
    </html>
  );
}
