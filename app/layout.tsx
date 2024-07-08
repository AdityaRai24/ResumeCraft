import type { Metadata } from "next";
import "./globals.css";
import ConvexAndClerk from "@/providers/ConvexAndClerk";
import { Toaster } from "react-hot-toast";
import { poppinsFont } from "@/lib/font";

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
            <Toaster />
          {children}</ConvexAndClerk>
      </body>
    </html>
  );
}
