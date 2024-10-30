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
import useMobile from "@/lib/useMobile";

const LiveResumePreview = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const templateDetails = useQuery(api.resume.getTemplateDetails, {
    id: params.id as Id<"resumes">,
  }) as ResumeTemplate | undefined | null;

  const searchParams = useSearchParams();
  const resumeOnlyMode = searchParams.get("resumeonly") === "true";
  const isMobile = useMobile();

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
    size: "md" | "sm" | "lg";
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
    <div className="max-h-screen flex flex-col">
      <div id="no-print">
        <Navbar />
      </div>

      <div className="flex flex-col lg:flex-row w-full">
        {!resumeOnlyMode && (
          <div
            id="no-print"
            className="w-full lg:w-full max-w-[85%] mx-auto ] pt-8 lg:pt-32 pb-8 lg:pb-0"
          >
            <h1
              className={cn(
                "text-3xl sm:text-4xl lg:text-5xl font-bold text-left",
                geologicaFont.className
              )}
            >
              Your Resume is Ready !!
            </h1>

            <div className="flex flex-col gap-4 mt-6 lg:mt-8 md:max-w-[50%]">
              <div className="flex items-start gap-3 text-gray-600">
                <CheckCircle className="w-6 h-6 shrink-0 mt-1" />
                <p className="text-sm sm:text-base">
                  Your resume has been professionally formatted and is ready for
                  download.
                </p>
              </div>

              <div className="flex items-start gap-3 text-gray-600">
                <CheckCircle className="w-6 h-6 shrink-0 mt-1" />
                <p className="text-sm sm:text-base">
                  When downloading, select &apos;Save as Pdf&apos; and Paper
                  Size &apos;ISO A4&apos; to ensure the resume text remains
                  selectable, allowing easy copy-pasting by recruiters.
                </p>
              </div>

              <div className="flex items-start gap-3 text-gray-600">
                <CheckCircle className="w-6 h-6 shrink-0 mt-1" />
                <p className="text-sm sm:text-base">
                  Take a moment to review your resume one last time before
                  sharing it with potential employers.
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

        <div
          className={cn(
            "scale-[0.5] fixed left-3/4 -translate-x-1/2 top-[55%] -translate-y-1/2",
            "print:scale-100 print:left-0 print:top-0 print:translate-x-0 print:translate-y-0",
            isMobile && "hidden print:block"
          )}
          id="hello"
        >
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
                size="lg"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveResumePreview;
