"use client";
import ContineBtn from "@/components/ContineBtn";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { tipsData } from "@/lib/tipsData";
import { cn } from "@/lib/utils";
import { fontMap } from "@/utils/font";
import { useQuery } from "convex/react";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";
import {container, item} from "@/lib/motion"
import TipsSkeleton from "@/components/TipsSkeleton";

const page = () => {
  const searchParams = useSearchParams();
  const sec = searchParams.get("sec");

  const params = useParams();
  const resumeId = params.id;
  const resume = useQuery(api.resume.getTemplateDetails, {
    id: resumeId as Id<"resumes">,
  });

  if (resume === null) {
    return <div>no document</div>;
  }

  if (resume === undefined) {
    return <TipsSkeleton />;
  }

  let sectionArray: string[] = [];
  resume?.sections?.map((item) => sectionArray.push(item.type));

  const index = sectionArray.findIndex((item) => item === sec);
  const currentTips = tipsData.find((item) => item.sec === sec);

  const nextSection = sectionArray[index];

  const prevSection = sectionArray[index - 1]
    ? sectionArray[index - 1]
    : "header";

  const nexturl =  `/build-resume/${resumeId}/section/${nextSection}`
  const prevurl = sec === 'header' ? `/build-resume/${resumeId}/tips?sec=header` : `/build-resume/${resumeId}/section/${prevSection}`

  return (
    <div className="flex items-center justify-start max-w-[80%] mx-16">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className={cn("mt-24",fontMap.Geologica.className)}
      >
        <div className="flex flex-col gap-4">
          <motion.h2 variants={item} className="text-lg">
            {currentTips?.topText}
          </motion.h2>
          <motion.div variants={item}>
            <h1
              className={cn(
                "text-6xl font-bold leading-[1.10]",
              )}
            >
              {currentTips?.mainText}
            </h1>
            <div className="flex flex-col items-start gap-1 mt-4">
              <h2 className="font-normal text-2xl">
                {currentTips?.bottomMainText}
              </h2>
              <p className="font-normal text-base">{currentTips?.bottomText}</p>
            </div>
          </motion.div>
        </div>

        {/* BUTTONS DIV */}
        <motion.div
          variants={item}
          className="flex items-center mt-8 justify-between"
        >
          <ContineBtn
            path={prevurl}
            text="Back"
            type={"outline"}
          />
          <ContineBtn
            path={nexturl}
            text="Continue"
            type={"default"}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};




export default page;
