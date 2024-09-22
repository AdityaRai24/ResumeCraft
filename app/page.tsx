"use client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { container, item } from "@/lib/motion";
import { geologicaFont, poppinsFont } from "@/lib/font";
import { ArrowRight, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className={`my-12 w-[80%] mx-auto flex items-center justify-between ${poppinsFont.className}`}
      >
        <div className="max-w-[80%] block mx-auto">
          <motion.h1
            className="text-6xl text-center font-semibold leading-tight tracking-normal"
            variants={item}
          >
            Craft Job-Ready, High-ATS Scoring Professional Resumes
          </motion.h1>

          <motion.p
            variants={item}
            className="font-normal text-md max-w-[77%] mx-auto text-center pt-3 pb-4"
          >
            Create standout resumes and impress employers. Our user-friendly
            builder offers customizable templates to ensure your resume is
            job-ready.
          </motion.p>

          <motion.div
            variants={item}
            className="flex items-center gap-8 justify-center"
          >
            <Link href={"/build-resume/steps"}>
              <Button className="py-[28px] px-6 hover:scale-[1.03] active:scale-[0.97] transition duration-300 ease">
                Create Resume <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href={"/build-resume/steps"}>
              <Button
                variant={"outline"}
                className="py-[28px] px-6 hover:border-primary border-2 hover:scale-[1.03] active:scale-[0.97] transition duration-300 ease"
              >
                Try it free
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
      <div className="">
        <img src="./image.png" alt="" className="block w-[80%] border-2 rounded-lg cursor-pointer border-primary mx-auto" />
      </div>
    </>
  );
}
