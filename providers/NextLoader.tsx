"use client";
import useMobile from "@/lib/useMobile";
import { usePathname } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import React from "react";
const NextLoader = () => {
  const pathname = usePathname();
  const isInBuildResume = pathname.includes("build-resume");
  const isMobile = useMobile();

  return (
    <NextTopLoader
      color={isInBuildResume && isMobile ? "#fff" : "#E11D48"} // Blue for build-resume, Red for others
      height={5}
      speed={150}
      zIndex={10000}
      showSpinner={false}
    />
  );
};

export default NextLoader;
