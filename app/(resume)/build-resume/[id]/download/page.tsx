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
    return <div>Template not found</div>;
  }
  if (templateDetails === undefined) {
    return <div>Loading...</div>;
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
    return <div>Error: Template not found</div>;
  }

  const handlePdfDownload = () => {
    window.print();
  };

  return (
    <>
      <div id="no-print">
        <Navbar />
      </div>
      <div className="flex mx-auto ">
        {!resumeOnlyMode && (
          <div id="no-print" className="max-w-[50%] pt-32 pl-16">
            <h1
              className={cn(
                "text-5xl font-bold text-left",
                geologicaFont.className
              )}
            >
              Your Resume is Ready !!
            </h1>
            <div className="flex flex-col justify-center gap-2 mt-4">
              <p className="flex items-center gap-2 text-gray-600 ">
                <CheckCircle /> Your resume has been professionally formatted
                and is ready for download.
              </p>
              <p className="flex items-center gap-2 text-gray-600 ">
                <CheckCircle size={32} /> When downloading, select Save as Pdf
                to ensure the resume text remains selectable, allowing easy
                copy-pasting by recruiters.
              </p>
              <p className="flex items-center gap-2 text-gray-600 ">
                <CheckCircle /> Take a moment to review your resume one last
                time before sharing it with potential employers.
              </p>
            </div>
            <div className="flex items-center mt-4">
              <Button
                disabled={loading}
                onClick={handlePdfDownload}
                className="py-[30px] px-16  text-base flex items-center gap-2 hover:gap-4 active:scale-[0.97] transition-all duration-300 ease-out"
              >
                {loading ? (
                  <>
                    Downloading... <Loader2 className="ml-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Download <Download className="mt-[2.5px]" />{" "}
                  </>
                )}
              </Button>
            </div>
            {loading && (
              <p className="text-center my-2 text-muted-foreground">
                Downloading may take few seconds so kindly be patient...
              </p>
            )}{" "}
          </div>
        )}
        <div className="scale-[0.5] fixed right-0 -top-48" id="hello">
          <div
            className={cn(
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
    </>
  );
};

export default LiveResumePreview;
