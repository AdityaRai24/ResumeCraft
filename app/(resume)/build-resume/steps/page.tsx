"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Computer, LayoutTemplate, PencilLine } from "lucide-react";
import Link from "next/link";
import React from "react";
import { poppinsFont } from "@/lib/font";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

const Page = () => {
  return (
    <>
      <Navbar />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className={`flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-3 w-[90%] lg:max-w-[85%] mx-auto h-[85vh] py-8 lg:py-0 ${poppinsFont.className}`}
      >
        {/* Left section */}
        <motion.div className="w-full lg:w-[50%] lg:order-1">
          <motion.div className="lg:pl-6 flex flex-col gap-4 lg:gap-2 text-left md:text-center lg:text-left">
            <motion.p
              variants={item}
              className="text-primary font-semibold text-lg lg:text-xl"
            >
              Say hello to ResumeCraft
            </motion.p>

            <motion.h1
              variants={item}
              className="text-3xl lg:text-5xl max-w-full font-[650] tracking-wide leading-[1.15]"
            >
              Get your resume ready in 3 steps
            </motion.h1>

            <motion.p
              variants={item}
              className="max-w-full lg:max-w-[70%] text-sm lg:text-base mx-auto lg:mx-0"
            >
              Resume Craft gives you the tools and guidance you need to create a
              truly professional resume that highlights your skills and
              experience.
            </motion.p>

            <motion.div
              variants={item}
              className="hidden md:flex mt-4 items-center max-w-full lg:max-w-[70%] justify-between flex-col sm:flex-row gap-4 sm:gap-6"
            >
              <Link href={"/"} className="w-full sm:w-[45%]">
                <Button
                  variant={"outline"}
                  className="py-6 lg:py-[28px] w-full px-6 border-primary border-2 active:scale-[0.97] hover:bg-primary/5 transition-all duration-300 ease"
                >
                  Back
                </Button>
              </Link>
              <Link
                href={"/build-resume/templates"}
                className="w-full sm:w-[45%]"
              >
                <Button className="py-6 lg:py-[28px] w-full px-6 flex items-center gap-2 hover:gap-4 active:scale-[0.97] transition-all duration-300 ease-out">
                  Next <ArrowRight size={18} className="mb-[2px]" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right section */}
        <motion.div
          variants={container}
          className="flex flex-col gap-6 w-full lg:w-[48%] order-1 lg:order-2"
        >
          <motion.div
            variants={item}
            whileHover={{ scale: 1.01 }}
            className="bg-primary/5 cursor-pointer border-2 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-3 p-4 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <div className="bg-primary/10 p-5 rounded-full mx-auto sm:mx-0">
              <Computer />
            </div>
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <h1 className="font-semibold tracking-wide text-lg lg:text-xl">
                Step-1: Start with a great template
              </h1>
              <p className="text-sm lg:text-base">
                Choose from our collection of pre-designed templates tailored
                for various industries and career levels.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            whileHover={{ scale: 1.01 }}
            className="bg-primary/5 cursor-pointer border-2 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-3 p-4 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <div className="bg-primary/10 p-5 rounded-full mx-auto sm:mx-0">
              <LayoutTemplate />
            </div>
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <h1 className="font-semibold tracking-wide text-lg lg:text-xl">
                Step-2: Add compelling content
              </h1>
              <p className="text-sm lg:text-base">
                Utilize our AI-powered content suggestions to effectively
                describe your skills, experience, and achievements.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            whileHover={{ scale: 1.01 }}
            className="bg-primary/5 cursor-pointer border-2 shadow-md flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-3 p-4 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <div className="bg-primary/10 p-5 rounded-full mx-auto sm:mx-0">
              <PencilLine />
            </div>
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <h1 className="font-semibold tracking-wide text-lg lg:text-xl">
                Step-3: Customize and polish
              </h1>
              <p className="text-sm lg:text-base">
                Fine-tune your resume&apos;s layout, style, and content to make
                it uniquely yours and stand out to employers.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="flex md:hidden mt-4 items-center max-w-full lg:max-w-[70%] justify-between flex-col sm:flex-row gap-4 sm:gap-6"
          >
            <Link href={"/"} className="w-full sm:w-[45%]">
              <Button
                variant={"outline"}
                className="py-6 lg:py-[28px] w-full px-6 border-primary border-2 active:scale-[0.97] hover:bg-primary/5 transition-all duration-300 ease"
              >
                Back
              </Button>
            </Link>
            <Link
              href={"/build-resume/templates"}
              className="w-full sm:w-[45%]"
            >
              <Button className="py-6 lg:py-[28px] w-full px-6 flex items-center gap-2 hover:gap-4 active:scale-[0.97] transition-all duration-300 ease-out">
                Next <ArrowRight size={18} className="mb-[2px]" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Page;
