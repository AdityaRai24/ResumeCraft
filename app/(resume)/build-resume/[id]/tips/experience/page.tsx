"use client"
import ContineBtn from "@/components/ContineBtn";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { montserrat } from "@/utils/font";
import { WandSparkles } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const experience = () => {

  const router = useRouter()
  const params = useParams()
  const resumeId = params.id

  return (
    <div className="flex items-center justify-start max-w-[70%] mx-16">
      <div className="mt-24 flex flex-col gap-4">
        <h2 className="text-lg">  Great progress! Next up → Experience</h2>
        <h1 className={cn("text-6xl font-extrabold leading-[1.25]",montserrat.className)}>Add details about your work experience</h1>
        <div className="flex items-center gap-5">
          <WandSparkles size={48} className=""/>
          <div>
            <h2 className="font-bold text-2xl">Our AI now makes writing easier!</h2>
            <p className="font-medium text-xl">
              With writing help you can fix mistakes or rephrase sentences to
              suit your needs.
            </p>
          </div>
        </div>
        <div className="flex items-center mt-8 justify-between">
          <ContineBtn path={`/build-resume/${resumeId}/section/header`} text="Back" type={"outline"} />
          <ContineBtn path={`/build-resume/${resumeId}/section/experience`} text="Continue" type={"default"} />
        </div>
      </div>
    </div>
  );
};

export default experience;
