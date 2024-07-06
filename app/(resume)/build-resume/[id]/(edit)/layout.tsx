import LiveResumePreview from "@/components/LiveResumePreview";
import VerticalTimeline from "@/components/VerticalTimeline";
import { fontMap } from "@/lib/font";
import { cn } from "@/lib/utils";
import React from "react";

const ResumeBuilderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex min-h-screen w-full">
        <div className="flex flex-1 overflow-hidden">
          {/* STATUS */}
          <div className="w-[150px] bg-primary flex-shrink-0">
            <VerticalTimeline />
          </div>

          {/* FORM */}
          <div
            className={cn(
              "flex-grow overflow-y-auto",
              fontMap.Geologica.className
            )}
          >
            {children}
          </div>
        </div>

        {/* PREVIEW */}
        <div className="w-[35vw]">
          <LiveResumePreview />
        </div>
      </div>
    </>
  );
};

export default ResumeBuilderLayout;
