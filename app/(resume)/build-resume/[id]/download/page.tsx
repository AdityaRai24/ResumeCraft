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
import { Loader, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { geologicaFont, interFont, montserratFont, openSansFont, poppinsFont, ralewayFont } from "@/lib/font";

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

  const handlePdfDownload = ()=>{
    window.print()
  }

  return (
    <div className="flex flex-col items-center mx-auto">
      {!resumeOnlyMode && (
        <div id="no-print" className="w-full">
       <Navbar />
          <div  className="my-16">
            <h1
              className={cn("text-6xl font-bold text-center", geologicaFont.className)}
            >
              Your Resume is Ready !!
            </h1>
            <div className="flex items-center justify-center mt-8">
              <Button
                disabled={loading}
                onClick={handlePdfDownload}
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
        </div>
      )}
      <div
       className={cn(
        "resume-container no-scrollbar",
        templateDetails?.globalStyles?.fontFamily === 'Inter' && interFont.className,
        templateDetails?.globalStyles?.fontFamily === 'Montserrat' && montserratFont.className,
        templateDetails?.globalStyles?.fontFamily === 'OpenSans' && openSansFont.className,
      templateDetails?.globalStyles?.fontFamily === 'Poppins' && poppinsFont.className,
        templateDetails?.globalStyles?.fontFamily === 'Geologica' && geologicaFont.className,
        templateDetails?.globalStyles?.fontFamily === 'Raleway' && ralewayFont.className,
      )}
      id="pdf">
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


