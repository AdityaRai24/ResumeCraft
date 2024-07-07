"use client";
import { useParams, useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import Template1 from "@/templates/template1/template1";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResumeTemplate } from "@/types/templateTypes";
import Template2 from "@/templates/template2/template2";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Loader, Loader2 } from "lucide-react";
import { fontMap } from "@/lib/font";
import Navbar from "@/components/Navbar";

const LiveResumePreview = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const templateDetails = useQuery(api.resume.getTemplateDetails, {
    id: params.id as Id<"resumes">,
  }) as ResumeTemplate | undefined | null;

  const searchParams = useSearchParams();
  const resumeOnlyMode = searchParams.get("resumeonly") === "true";

  if (templateDetails === null) {
    return <div>Template not found</div>;
  }
  if (templateDetails === undefined) {
    return <div>Loading...</div>;
  }

  console.log(templateDetails)

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
      setLoading(true);
      console.log("Initiating PDF download");
      const response = await fetch(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/generatePdf`, {
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
      setLoading(false);
      toast.success("Pdf download started successfully");
    } catch (error) {
      setLoading(false);
      toast.error("Failed to download PDF");
      console.error("Failed to download PDF", error);
    }
  };

  return (
    <div className="flex flex-col items-center mx-auto">
      <Navbar />
      {!resumeOnlyMode && (
        <>
          <div className="my-16">
            <h1
              className={cn("text-6xl font-bold", fontMap.Geologica.className)}
            >
              Your Resume is Ready !!
            </h1>
            <div className="flex items-center justify-center mt-8">
              <Button
                disabled={loading}
                onClick={handlePrint}
                className="hover:scale-[1.02] active:scale-[0.98] transition duration-300 ease-out text-xl py-8 px-32"
              >
                {loading ? (
                  <>
                    Downloading... <Loader2 className="ml-4 animate-spin" />
                  </>
                ) : (
                  <>Download</>
                )}
              </Button>
            </div>
            {loading && (
              <p className="text-center my-2 text-muted-foreground">
                Downloading may take few seconds so kindly be patient...
              </p>
            )}{" "}
          </div>
        </>
      )}
      <div className="resume-container no-scrollbar" id="pdf">
      {templateDetails && (
          <TemplateComponent 
            obj={templateDetails} 
            isPreview={false} 
            isLive={true} 
          />
        )}
      </div>
    </div>
  );
};

export default LiveResumePreview;


