"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import React from "react";
import Template1 from "@/templates/template1/template1";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { motion } from "framer-motion";
import ContineBtn from "./ContineBtn";
import { Skeleton } from "./ui/skeleton";

const LiveResumePreview = () => {
  const params = useParams();
  const templateDetails = useQuery(api.resume.getTemplateDetails, {
    id: params.id as Id<"resumes">,
  });
  const router = useRouter();
  const pathname = usePathname();
  const sectionType = pathname.split("/section/")[1];

  let sectionArray: string[] = [];
  templateDetails?.sections?.map((item) => sectionArray.push(item.type));
  let currentIndex = sectionArray.findIndex((item) => item === sectionType);

  if (templateDetails === null) {
    return <div>Template not found</div>;
  }

  if (templateDetails === undefined) {
    return <ResumeSkeleton />;
  }
  const backLocation = `/build-resume/${params.id}/tips?sec=${sectionArray[currentIndex]}`;

  const nextLocation = sectionArray[currentIndex + 1]
    ? `/build-resume/${params.id}/tips?sec=${sectionArray[currentIndex + 1]}`
    : `/build-resume/${params.id}/section/final`;

  return (
    <>
      <div className="overflow-hidden w-full fixed h-[100%] mt-8 ">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
        >
          <Template1 obj={templateDetails} isLive isPreview />
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
          className="fixed bottom-10 right-10"
        >
         <div className="flex items-center justify-center gap-24">
         <ContineBtn
            type="outline"
            text="Back"
            path={
              sectionType === "final"
                ? `/build-resume/${params.id}/tips?sec=${sectionArray[sectionArray.length - 1]}`
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
