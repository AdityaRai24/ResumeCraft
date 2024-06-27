"use client";
import ContineBtn from "@/components/ContineBtn";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { tipsData } from "@/lib/tipsData";
import { cn } from "@/lib/utils";
import { montserrat } from "@/utils/font";
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

  const nextSection = sec === 'introduction' ? 'header' : sectionArray[index];
  const prevSection = sectionArray[index - 1]
    ? sectionArray[index - 1]
    : "header";

  const nexturl = sec === 'introduction' ? `/build-resume/${resumeId}/tips?sec=header` : `/build-resume/${resumeId}/section/${nextSection}`

  return (
    <div className="flex items-center justify-start max-w-[70%] mx-16">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mt-24"
      >
        <div className="flex flex-col gap-4">
          <motion.h2 variants={item} className="text-lg">
            {" "}
            {currentTips?.topText}
          </motion.h2>
          <motion.div variants={item}>
            <h1
              className={cn(
                "text-6xl font-extrabold leading-[1.10]",
                montserrat.className
              )}
            >
              {currentTips?.mainText}
            </h1>
            <div className="flex flex-col items-start gap-1 mt-4">
              <h2 className="font-bold text-2xl">
                {currentTips?.bottomMainText}
              </h2>
              <p className="font-medium text-md">{currentTips?.bottomText}</p>
            </div>
          </motion.div>
        </div>

        {/* BUTTONS DIV */}
        <motion.div
          variants={item}
          className="flex items-center mt-8 justify-between"
        >
          <ContineBtn
            path={`/build-resume/${resumeId}/section/${prevSection}`}
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
