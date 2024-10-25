"use client";
import ContineBtn from "@/components/ContineBtn";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { tipsData } from "@/lib/tipsData";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";
import { container, item } from "@/lib/motion";
import TipsSkeleton from "@/components/TipsSkeleton";
import { geologicaFont, poppinsFont } from "@/lib/font";

const Page = () => {
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

  const currentTips = tipsData.find((item) => item.sec === sec);

  return (
    <div className="flex items-center justify-start w-full md:max-w-[95%] px-4 md:px-16">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className={cn("mt-16 md:mt-24", poppinsFont.className)}
      >
        <div className="flex flex-col gap-3 md:gap-4">
          <motion.h2 variants={item} className="text-lg">
            {currentTips?.topText}
          </motion.h2>
          <motion.div variants={item}>
            <h1 className={cn("text-4xl md:text-6xl font-bold leading-[1.20]")}>
              {currentTips?.mainText}
            </h1>
            <div className="flex flex-col items-start gap-1 mt-4">
              <h2 className="font-medium text-base md:text-xl">
                {currentTips?.bottomMainText}
              </h2>
              <p className="font-normal text-gray-500 text-sm md:text-base">
                {currentTips?.bottomText}
              </p>
            </div>
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
};

export default Page;
