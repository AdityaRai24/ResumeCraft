"use client"
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";

const ConvexAndClerk = ({ children }: { children: React.ReactNode }) => {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

  return (
    <>
      <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </>
  );
};

export default ConvexAndClerk;
