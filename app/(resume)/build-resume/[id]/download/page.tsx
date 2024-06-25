"use client";
import { useParams } from "next/navigation";
import React, { useRef } from "react";
import Template1 from "@/templates/template1/template1";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
const LiveResumePreview = () => {
  const params = useParams();
  const templateDetails = useQuery(api.resume.getTemplateDetails, {
    id: params.id as Id<"resumes">,
  });
  const handlePrint = () => {
    window.print();
  };
  if (templateDetails === null) {
    return <div>Template not found</div>;
  }
  if (templateDetails === undefined) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col items-center  mx-auto">
      <button 
        onClick={handlePrint}
        id="hide"
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 print:hidden"
      >
        Print Resume
      </button>
      <div className="resume-container" id="resumeSection">
        <Template1 obj={templateDetails} />
      </div>
    </div>
  );
};
export default LiveResumePreview;