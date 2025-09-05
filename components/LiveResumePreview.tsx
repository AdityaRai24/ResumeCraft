"use client";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";
import ContineBtn from "./ContineBtn";
import { Skeleton } from "./ui/skeleton";
import { ResumeTemplate } from "@/types/templateTypes";
import { cn } from "@/lib/utils";
import { getFontClass } from "@/lib/font";
import { templateComponents } from "@/templates/templateStructures";
import toast from "react-hot-toast";
import { useChatBotStore } from "@/store";

interface LiveResumePreviewProps {
  isCollapsed?: boolean;
}

const LiveResumePreview: React.FC<LiveResumePreviewProps> = ({
  isCollapsed = false,
}) => {
  const params = useParams();
  const getResume = useChatBotStore((state) => state.getResume);
  const templateDetails = getResume(params.id as string);
  const pathname = usePathname();
  const sectionType = pathname.split("/section/")[1];

  let sectionArray: string[] = [];
  templateDetails?.sections?.map((item: any) => sectionArray.push(item.type));
  let currentIndex = sectionArray.findIndex((item) => item === sectionType);

  if (templateDetails === null) {
    console.log("Template not found")
    return <div>Template not found</div>;
  }

  if (templateDetails === undefined) {
    console.log("template details undefined.")
    return <ResumeSkeleton isCollapsed={isCollapsed} />;
  }

  const backLocation = `/build-resume/${params.id}/tips?sec=${sectionArray[currentIndex]}`;
  const nextLocation =
    sectionType === "custom"
      ? `/build-resume/${params.id}/section/final`
      : sectionArray[currentIndex + 1]
        ? `/build-resume/${params.id}/tips?sec=${sectionArray[currentIndex + 1]}`
        : `/build-resume/${params.id}/section/custom`;

  const TemplateComponent = templateComponents[templateDetails.templateName];

  if (!TemplateComponent) {
    toast.error(
      `No component found for template: ${templateDetails.templateName}`
    );
    return <div>Error: Template not found</div>;
  }


  // Don't render content when collapsed
  if (isCollapsed) {
    return null;
  }




  return (
    <>
      <div className="overflow-hidden w-full fixed h-[100%] mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
          className={cn(
            getFontClass(templateDetails?.globalStyles?.fontFamily)
          )}
        >
          <TemplateComponent
            obj={templateDetails as ResumeTemplate}
            size="md"
            textSize={
              (templateDetails?.globalStyles?.textSize || "md") as
                | "sm"
                | "md"
                | "lg"
            }
            marginSize={
              (templateDetails?.globalStyles?.margin || "md") as
                | "sm"
                | "md"
                | "lg"
            }
            isPreview
          />
        </motion.div>
        
      </div>

      {sectionType && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="fixed bottom-5 right-10"
        >
          <div className="flex items-center justify-center gap-16">
            <ContineBtn
              type="outline"
              text="Back"
              path={
                sectionType === "final"
                  ? `/build-resume/${params.id}/tips?sec=custom`
                  : backLocation
              }
            />
            <ContineBtn
              type="default"
              text="Next"
              path={
                sectionType === "final"
                  ? `/build-resume/${params.id}/download`
                  : nextLocation
              }
            />
          </div>
        </motion.div>
      )}
    </>
  );
};

interface ResumeSkeletonProps {
  isCollapsed?: boolean;
}

const ResumeSkeleton: React.FC<ResumeSkeletonProps> = ({
  isCollapsed = false,
}) => {
  if (isCollapsed) {
    return null;
  }

  return (
    <div className="overflow-hidden w-full h-[80%] mt-8">
      <Skeleton className="h-full bg-slate-500/20 w-[80%]" />
    </div>
  );
};

export default LiveResumePreview;
