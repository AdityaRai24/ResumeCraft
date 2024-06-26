import React from "react";
import { Skeleton } from "./ui/skeleton";

const TipsSkeleton = () => {
  return (
    <div className="flex items-center justify-start max-w-[70%] mx-16">
      <div className="mt-24 w-full">
        <div className="flex flex-col gap-4 w-full">
          <Skeleton className="h-[32px] bg-slate-500/20  w-[70%]" />
          <div>
            <Skeleton className="h-[150px] bg-slate-500/20 w-full" />
            <div className="flex flex-col items-start gap-3 mt-4">
              <Skeleton className="h-[50px] bg-slate-500/20 w-[70%]" />
              <Skeleton className="h-[26px] bg-slate-500/20 w-full" />
            </div>
          </div>
        </div>

        {/* BUTTONS DIV */}
        <div className="flex items-center mt-8 justify-between">
          <Skeleton className="h-[85px] bg-slate-500/20 w-[40%] rounded-full" />
          <Skeleton className="h-[85px] bg-slate-500/20 w-[40%] rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default TipsSkeleton;
