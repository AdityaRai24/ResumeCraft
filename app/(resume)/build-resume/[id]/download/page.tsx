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
import { CheckCircle2Icon, Download, Loader, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  geologicaFont,
  interFont,
  montserratFont,
  openSansFont,
  poppinsFont,
  ralewayFont,
} from "@/lib/font";
import { motion } from "framer-motion";

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
      <div className="flex items-start mx-auto max-w-[85%] max-h-screen">
        {!resumeOnlyMode && (
          <div id="no-print" className="max-w-[80%] mx-auto ">
            <div className=" mt-24 ml-4">
              <motion.h1 className="text-5xl text-left font-semibold leading-tight tracking-normal">
                Your Resume Is Ready !!
              </motion.h1>
              <div>
                <h2 className="font-medium text-md text-gray-800  text-left pt-1 pb-4">
                  Your resume is looking great! Here's what you can do next:
                </h2>
                <ul className="flex flex-col gap-3">
                  <li className="flex max-w-[80%]  items-center text-gray-700 gap-2">
                    <CheckCircle2Icon className="text-primary" size={24} />
                    Review your resume for any final touches.
                  </li>
                  <li className="flex max-w-[80%] items-center text-gray-700 gap-2">
                    <CheckCircle2Icon className="text-primary" size={31} />
                    When downloading, select destination as "Save as PDF" to
                    ensure the resume text remains selectable.
                  </li>
                  <li className="flex max-w-[80%]  items-center text-gray-700 gap-2">
                    <CheckCircle2Icon className="text-primary" size={24} />
                    Share the resume with your potential employers.
                  </li>
                </ul>
              </div>
              <div className="flex items-center mt-8">
                <Button
                  disabled={loading}
                  onClick={handlePdfDownload}
                  className="py-[34px] px-8 hover:scale-[1.03] text-base flex items-center gap-2 hover:gap-4 active:scale-[0.97] transition-all duration-300 ease-out"
                >
                  {loading ? (
                    <>
                      Downloading... <Loader2 className="ml-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      Download Resume
                      <Download size={18} />{" "}
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
          </div>
        )}
        <div className="max-w-[85%] mx-auto flex ">
          <div
            className={cn(
              "relative group inline-block w-[477px] h-[500px] mt-8",
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
                isPreview={true}
                downloadPreview={true}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveResumePreview;
