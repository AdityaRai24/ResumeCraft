import LiveResumePreview from "@/components/LiveResumePreview";
import React from "react";

const ResumeBuilderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-start justify-start w-full h-screen">
      {/* STATUS */}
      <div className="w-[150px] self-start h-full bg-primary"></div>

      {/* FORM */}
      <div className="grow">{children}</div>

      {/* PREVIEW */}
      <div className="self-center">
        <LiveResumePreview />
      </div>
    </div>
  );
};

export default ResumeBuilderLayout;
