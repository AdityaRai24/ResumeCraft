import type { Metadata } from "next";
import "./globals.css";
import ConvexAndClerk from "@/providers/ConvexAndClerk";
import { Toaster } from "react-hot-toast";
import { fontMap } from "@/lib/font";

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
