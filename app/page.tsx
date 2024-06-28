"use client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { fontMap } from "@/utils/font";
import Link from "next/link";
import { motion } from "framer-motion";
import { container, item } from "@/lib/motion";

export default function Home() {
  return (
    <>
      <Navbar />
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className={`my-24 w-[80%] mx-auto flex items-center justify-between ${fontMap.Geologica.className}`}
      >
        <div className="max-w-[70%]">
          <motion.h1
            className="text-6xl font-medium leading-tight"
            variants={item}
          >
            Craft Job-Ready, High-ATS Professional Resumes
          </motion.h1>
          <motion.p variants={item} className="font-normal text-md py-3">
            Create standout resumes that pass ATS screenings and impress
            employers. Our user-friendly builder offers customizable templates
            and real-time previews to ensure your resume is job-ready.
          </motion.p>
          <motion.div variants={item}>
            <Link href={"/build-resume/steps"}>
              <Button className="my-4 py-[30px] hover:scale-[1.03] active:scale-[0.97] transition duration-300 ease-in-out text-lg rounded-xl px-8">
                Create Your Resume
              </Button>
            </Link>
          </motion.div>
        </div>
        <div></div>
      </motion.div>
    </>
  );
}
