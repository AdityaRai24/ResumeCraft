"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";
import { item } from "@/lib/motion";
import { poppinsFont } from "@/lib/font";

interface SectionInfoTypes {
  heading: string;
  text: string;
}

const SectionInfo = ({ heading, text }: SectionInfoTypes) => {
  return (
    <motion.div variants={item} initial="hidden" animate="visible">
      <h1
        className={cn(
          "text-[35px] leading-tight  font-extrabold",
          poppinsFont.className
        )}
      >
        {heading}
      </h1>
      <p className="text-md font-light text-gray-700 mb-4">{text}</p>
    </motion.div>
  );
};

export default SectionInfo;
