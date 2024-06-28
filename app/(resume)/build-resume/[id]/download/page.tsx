"use client";
import { useParams, useSearchParams } from "next/navigation";
import React, { useRef } from "react";
import Template1 from "@/templates/template1/template1";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResumeTemplate } from "@/types/templateTypes";
import Template2 from "@/templates/template2/template2";
import { Button } from "@/components/ui/button";

const LiveResumePreview = () => {
  const params = useParams();
  const templateDetails = useQuery(api.resume.getTemplateDetails, {
    id: params.id as Id<"resumes">,
  });

  const searchParams = useSearchParams();
  const resumeOnlyMode = searchParams.get("resumeonly") === "true";

  if (templateDetails === null) {
    return <div>Template not found</div>;
  }
  if (templateDetails === undefined) {
    return <div>Loading...</div>;
  }

  type TemplateComponentType = React.ComponentType<{
    obj: ResumeTemplate;
    isPreview: boolean;
    isLive?: boolean;
  }>;

  const templateComponents: Record<string, TemplateComponentType> = {
    Template1: Template1,
    Template2: Template2,
  };

  const TemplateComponent = templateComponents[templateDetails.templateName];

  if (!TemplateComponent) {
    console.error(
      `No component found for template: ${templateDetails.templateName}`
    );
    return <div>Error: Template not found</div>;
  }

  const handlePrint = async () => {
    try {
      console.log("Initiating PDF download");
      const response = await fetch(`http://localhost:3000/api/generatePdf`, {
        body: JSON.stringify({ id: params.id }),
        method: "POST",
      });

      console.log("Response received:", response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.error}, details: ${errorData.details}`
        );
      }

      const blob = await response.blob();
      console.log("Blob received, size:", blob.size);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      console.log("PDF download initiated");
    } catch (error) {
      console.error("Failed to download PDF", error);
    }
  };

  return (
    <div className="flex flex-col items-center mx-auto">
    {!resumeOnlyMode && (
      <button
        onClick={handlePrint}
        className="mb-4 px-4 py-2 no-scrollbar bg-blue-500 text-white rounded hover:bg-blue-600 print:hidden"
      >
        Print Resume
      </button>
    )}
    <div className="resume-container no-scrollbar" id="pdf">
      <TemplateComponent obj={templateDetails} />
    </div>
  </div>

  );
};

    // <>
    //   {!resumeOnlyMode ? (
    //     <div
    //       className={`flex justify-between items-center gap-10 max-w-[95%] mx-auto`}
    //     >
    //       <>
    //         {" "}
    //         <div className="self-start mt-[160px]">
    //           <h1 className="text-6xl font-semibold">
    //             Your Resume is ready to download
    //           </h1>
    //           <Button onClick={handlePrint}>Download</Button>
    //         </div>
    //       </>
    //       <div className="">
    //         <div className="resume-container no-scrollbar" id="pdf">
    //           <TemplateComponent obj={templateDetails} />
    //         </div>
    //       </div>
    //     </div>
    //   ) : (
    //     <div className="flex flex-col items-center mx-auto">
    //   <div className="resume-container no-scrollbar" id="pdf">
    //     <TemplateComponent obj={templateDetails} />
    //   </div>
    // </div> 
    //   )}
    // </>
{
  /* <div className="flex flex-col items-center mx-auto">
      {!resumeOnlyMode && (
        <button
          onClick={handlePrint}
          className="mb-4 px-4 py-2 no-scrollbar bg-blue-500 text-white rounded hover:bg-blue-600 print:hidden"
        >
          Print Resume
        </button>
      )}
      <div className="resume-container no-scrollbar" id="pdf">
        <TemplateComponent obj={templateDetails} />
      </div>
    </div> */
}

export default LiveResumePreview;
