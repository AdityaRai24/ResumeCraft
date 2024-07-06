"use client"
import { cn } from "@/lib/utils";
import React from "react";
import {motion} from "framer-motion"
import { item } from "@/lib/motion";
import { fontMap } from "@/lib/font";

interface SectionInfoTypes{
    heading: string;
    text: string;
}

const SectionInfo = ({heading,text}: SectionInfoTypes) => {
  return (
    <motion.div variants={item} initial="hidden" animate="visible">
      <h1 className={cn("text-[35px] font-extrabold", fontMap.Poppins.className)}>
        {heading}
      </h1>
      <p className="text-md">{text}</p>
    </motion.div>
  );
};

export default SectionInfo;
