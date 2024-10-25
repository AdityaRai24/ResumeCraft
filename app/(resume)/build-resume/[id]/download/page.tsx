"use client";
import { useParams, useSearchParams } from "next/navigation";
import React, { useRef, useState } from "react";
import Template1 from "@/templates/template1/Template1";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ResumeTemplate } from "@/types/templateTypes";
import Template2 from "@/templates/template2/Template2";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  CheckCircle,
  Download,
  DownloadCloud,
  Loader,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  geologicaFont,
  interFont,
  montserratFont,
  openSansFont,
  poppinsFont,
  ralewayFont,
} from "@/lib/font";

const LiveResumePreview = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const templateDetails = useQuery(api.resume.getTemplateDetails, {
    id: params.id as Id<"resumes">,
  }) as ResumeTemplate | undefined | null;

  const searchParams = useSearchParams();
  const resumeOnlyMode = searchParams.get("resumeonly") === "true";

  if (templateDetails === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Template not found</p>
      </div>
    );
  }
  if (templateDetails === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  type TemplateComponentType = React.ComponentType<{
    obj: ResumeTemplate;
    isPreview: boolean;
    isLive?: boolean;
    downloadPreview?: boolean;
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Error: Template not found</p>
      </div>
    );
  }

  const handlePdfDownload = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div id="no-print">
        <Navbar />
      </div>
      
      <div className="flex w-full">
        {!resumeOnlyMode && (
          <div 
            id="no-print" 
            className="w-full lg:w-1/2 px-4 sm:px-6 lg:px-16 pt-8 lg:pt-32 pb-8 lg:pb-0"
          >
            <h1
              className={cn(
                "text-3xl sm:text-4xl lg:text-5xl font-bold text-left",
                geologicaFont.className
              )}
            >
              Your Resume is Ready !!
            </h1>
            
            <div className="flex flex-col gap-4 mt-6 lg:mt-8">
              <div className="flex items-start gap-3 text-gray-600">
                <CheckCircle className="w-6 h-6 shrink-0 mt-1" />
                <p className="text-sm sm:text-base">
                  Your resume has been professionally formatted and is ready for download.
                </p>
              </div>
              
              <div className="flex items-start gap-3 text-gray-600">
                <CheckCircle className="w-6 h-6 shrink-0 mt-1" />
                <p className="text-sm sm:text-base">
                  When downloading, select Save as Pdf to ensure the resume text remains selectable, 
                  allowing easy copy-pasting by recruiters.
                </p>
              </div>
              
              <div className="flex items-start gap-3 text-gray-600">
                <CheckCircle className="w-6 h-6 shrink-0 mt-1" />
                <p className="text-sm sm:text-base">
                  Take a moment to review your resume one last time before sharing it with potential employers.
                </p>
              </div>
            </div>
            
            <div className="mt-6 lg:mt-8">
              <Button
                disabled={loading}
                onClick={handlePdfDownload}
                className="w-full sm:w-auto py-6 px-8 sm:px-16 text-base flex items-center justify-center gap-2 hover:gap-4 active:scale-[0.97] transition-all duration-300 ease-out"
              >
                {loading ? (
                  <>
                    Downloading... <Loader2 className="ml-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Download <Download className="mt-[2.5px]" />
                  </>
                )}
              </Button>
              
              {loading && (
                <p className="text-center mt-4 text-sm text-muted-foreground">
                  Downloading may take few seconds so kindly be patient...
                </p>
              )}
            </div>
          </div>
        )}
        
        <div className="scale-[0.3] md:!scale-[0.5] fixed left-1/2  -translate-x-1/2  md:-top-48" id="hello">
          <div
            className={cn(
              "w-full h-full",
              templateDetails?.globalStyles?.fontFamily === "Inter" &&
                interFont.className,
              templateDetails?.globalStyles?.fontFamily === "Montserrat" &&
                montserratFont.className,
              templateDetails?.globalStyles?.fontFamily === "OpenSans" &&
                openSansFont.className,
              templateDetails?.globalStyles?.fontFamily === "Poppins" &&
                poppinsFont.className,
              templateDetails?.globalStyles?.fontFamily === "Geologica" &&
                geologicaFont.className,
              templateDetails?.globalStyles?.fontFamily === "Raleway" &&
                ralewayFont.className
            )}
            id="pdf"
          >
            {templateDetails && (
              <TemplateComponent
                obj={templateDetails}
                isLive
                isPreview={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveResumePreview;