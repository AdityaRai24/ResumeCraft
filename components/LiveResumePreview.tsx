"use client";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "framer-motion";
import ContineBtn from "./ContineBtn";
import { Skeleton } from "./ui/skeleton";
import { ResumeTemplate } from "@/types/templateTypes";
import Template1 from "@/templates/template1/Template1";
import Template2 from "@/templates/template2/Template2";
import { cn } from "@/lib/utils";
import {
  geologicaFont,
  interFont,
  montserratFont,
  openSansFont,
  poppinsFont,
  ralewayFont,
  robotoFont,
} from "@/lib/font";
import { templateComponents } from "@/templates/templateStructures";
import toast from "react-hot-toast";
import { useChatBotStore } from "@/store";

const LiveResumePreview = () => {
  const params = useParams();
  const templateDetails = useChatBotStore((state) => state.resume);
  const pathname = usePathname();
  const sectionType = pathname.split("/section/")[1];

  let sectionArray: string[] = [];
  templateDetails?.sections?.map((item: any) => sectionArray.push(item.type));
  let currentIndex = sectionArray.findIndex((item) => item === sectionType);
  console.log(templateDetails)
  if (templateDetails === null) {
    return <div>Template not found</div>;
  }

  if (templateDetails === undefined) {
    return <ResumeSkeleton />;
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

  return (
    <>
      <div className="overflow-hidden  w-full fixed h-[100%] mt-8 ">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
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
              ralewayFont.className,
            templateDetails?.globalStyles?.fontFamily === "Roboto" &&
              robotoFont.className
          )}
        >
          <TemplateComponent
            obj={templateDetails as ResumeTemplate}
            size="md"
            textSize={(templateDetails?.globalStyles?.textSize || "md") as "sm" | "md" | "lg"}
            marginSize={(templateDetails?.globalStyles?.margin || "md") as "sm" | "md" | "lg"}
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

const ResumeSkeleton = () => {
  return (
    <div className="overflow-hidden w-full h-[80%] mt-8 ">
      <Skeleton className="h-full bg-slate-500/20 w-[80%]" />
    </div>
  );
};

export default LiveResumePreview;
