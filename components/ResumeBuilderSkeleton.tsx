import React from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { geologicaFont } from "@/lib/font";

const ResumeBuilderSkeleton = () => {
  return (
    <>
      {/* Mobile Timeline Skeleton */}
      <div className="flex shrink-0 z-100000! bg-primary w-full md:hidden">
        <div className="flex items-center justify-center w-full py-4">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-full bg-slate-500/20" />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Header Skeleton */}
      <div className="relative pt-6 w-full px-4 flex md:hidden items-center justify-between">
        <Skeleton className="h-10 w-16 bg-slate-500/20" />
        <Skeleton className="h-10 w-24 bg-slate-500/20" />
      </div>

      <div className="flex h-screen w-full">
        <div className="flex flex-1 h-screen overflow-hidden">
          {/* Desktop Timeline Skeleton */}
          <div className="bg-primary md:block w-20 flex items-center justify-center shrink-0 border-r border-gray-200">
            <div className="flex flex-col space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-full bg-slate-500/20" />
              ))}
            </div>
          </div>

          {/* Chatbot Skeleton */}
          <div className="bg-white hidden md:block shrink-0 border-l border-gray-200">
            <div className="p-4 space-y-4">
              <Skeleton className="h-8 w-32 bg-slate-500/20" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-slate-500/20" />
                <Skeleton className="h-4 w-3/4 bg-slate-500/20" />
                <Skeleton className="h-4 w-1/2 bg-slate-500/20" />
              </div>
              <Skeleton className="h-10 w-full bg-slate-500/20" />
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div
            className={cn(
              "grow overflow-y-auto overflow-x-hidden no-scrollbar mx-auto transition-all duration-300 ease-in-out",
              geologicaFont.className,
              "max-w-[80%]"
            )}
          >
            {/* Content Area Skeleton */}
            <div className="my-24 mx-16">
              <div className="flex flex-col gap-6">
                <Skeleton className="h-[32px] bg-slate-500/20 w-full" />
                <Skeleton className="h-[25px] bg-slate-500/20 w-[70%]" />
              </div>
              <div className="grid grid-cols-2 max-w-[85%] gap-8 mt-8">
                <Skeleton className="h-[50px] bg-slate-500/20 w-full" />
                <Skeleton className="h-[50px] bg-slate-500/20 w-full" />
                <Skeleton className="h-[50px] bg-slate-500/20 w-full" />
                <Skeleton className="h-[50px] bg-slate-500/20 w-full" />
                <Skeleton className="h-[50px] bg-slate-500/20 w-full" />
                <Skeleton className="h-[50px] bg-slate-500/20 w-full" />
              </div>
              <Skeleton className="mt-8 h-[120px] bg-slate-500/20 w-full" />
            </div>

            {/* Navigation Buttons Skeleton */}
            <div className="flex mb-32 md:mb-0 flex-col md:flex-row w-full md:max-w-[90%] px-4 md:px-16 items-center mt-4 justify-between">
              <Skeleton className="h-[85px] bg-slate-500/20 w-[40%] rounded-full" />
              <Skeleton className="h-[85px] bg-slate-500/20 w-[40%] rounded-full" />
            </div>
          </div>
        </div>

        {/* Preview Section Skeleton */}
        <div className="hidden md:flex relative transition-all duration-300 ease-in-out w-[30vw]">
          {/* Toggle Button Skeleton */}
          <div className="absolute top-4 left-0 z-10 bg-white p-3 rounded-full shadow-lg">
            <Skeleton className="h-6 w-6 bg-slate-500/20" />
          </div>

          {/* Eye Button Skeleton */}
          <div className="absolute top-4 right-12 z-10 bg-white p-3 rounded-full shadow-lg">
            <Skeleton className="h-6 w-6 bg-slate-500/20" />
          </div>

          {/* Preview Content Skeleton */}
          <div className="w-full p-4 space-y-4">
            <Skeleton className="h-8 w-32 bg-slate-500/20" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-slate-500/20" />
              <Skeleton className="h-4 w-3/4 bg-slate-500/20" />
              <Skeleton className="h-4 w-1/2 bg-slate-500/20" />
            </div>
            <Skeleton className="h-32 w-full bg-slate-500/20" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-slate-500/20" />
              <Skeleton className="h-4 w-5/6 bg-slate-500/20" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeBuilderSkeleton;
