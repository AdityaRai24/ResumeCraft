import React from "react";
import { Skeleton } from "./ui/skeleton";

const HeaderSkeleton = () => {
  return (
    <div className="my-24 mx-16">
      <div className="flex flex-col gap-6">
        <Skeleton className="h-[32px] bg-slate-500/20 w-full" />
        <Skeleton className="h-[25px] bg-slate-500/20  w-[70%]" />
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
  );
};

export default HeaderSkeleton;
