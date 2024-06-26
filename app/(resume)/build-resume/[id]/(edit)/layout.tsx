import LiveResumePreview from "@/components/LiveResumePreview";
import React from "react";

const ResumeBuilderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full items-center justify-between">
      {/* STATUS */}
      <div className="max-w-[150px] min-w-[150px]  self-start h-full bg-primary"></div>

      {/* FORM */}
      <div className="grow  h-full">{children}</div>

      {/* PREVIEW */}
      <div className="self-end h-full w-[35vw]">
        <LiveResumePreview />
      </div>
    </div>
  );
};

export default ResumeBuilderLayout;