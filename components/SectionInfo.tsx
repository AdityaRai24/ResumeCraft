import { cn } from "@/lib/utils";
import { montserrat } from "@/utils/font";
import React from "react";

interface SectionInfoTypes{
    heading: string;
    text: string;
}

const SectionInfo = ({heading,text}: SectionInfoTypes) => {
  return (
    <div>
      <h1 className={cn("text-[35px] font-extrabold", montserrat.className)}>
        {heading}
      </h1>
      <p className="text-md">{text}</p>
    </div>
  );
};

export default SectionInfo;
