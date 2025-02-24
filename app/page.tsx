"use client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { motion, stagger } from "framer-motion";
import { container, item } from "@/lib/motion";
import { geologicaFont, poppinsFont } from "@/lib/font";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { temp2Obj } from "@/templates/template2/temp2obj";
import { useRouter } from "next/navigation";
import temp1Obj from "@/templates/template1/temp1obj";
import useMobile from "@/lib/useMobile";
import temp3obj from "@/templates/template3/temp3obj";
import Image from "next/image";
import dynamic from "next/dynamic";
import Template1 from "@/templates/template1/Template1";

const Template2 = dynamic(() => import("@/templates/template2/Template2"), {
  ssr: false,
});

const Template3 = dynamic(() => import("@/templates/template3/Template3"), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();
  const isMobile = useMobile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const features = [
    {
      icon: <Sparkles className="text-primary shrink-0" size={32} />,
      msg: "ATS-optimized resumes",
    },
    {
      icon: (
        <Image
          alt="businessman"
          src={"/businessman.png"}
          className="text-primary shrink-0"
          width={32}
          height={32}
        />
      ),
      msg: "Professional templates to industry standards",
    },
    {
      icon: (
        <Image
          alt="pencil"
          src={"/pencil.png"}
          className="text-primary shrink-0"
          width={32}
          height={32}
        />
      ),
      msg: "Customizable layouts for personal branding",
    },
    {
      icon: (
        <Image
          alt="stopwatch"
          src={"/stopwatch.png"}
          className="text-primary shrink-0"
          width={32}
          height={32}
        />
      ),
      msg: "Real-time preview to ensure perfection",
    },
    {
      icon: (
        <Image
          alt="subscriber"
          src={"/subscriber.png"}
          className="text-primary shrink-0"
          width={32}
          height={32}
        />
      ),
      msg: "300+ Resumes Created !!",
    },
  ];

  const featureListVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const featureItemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const template2Variants = {
    hidden: {
      opacity: 0,
      x: 100,
      rotate: -6,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotate: -6,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };

  const template3Variants = {
    hidden: {
      opacity: 0,
      x: 100,
      rotate: 6,
    },
    visible: {
      opacity: 1,
      x: 0,
      rotate: 6,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.5,
      },
    },
  };

  return (
    <>
      <div className="h-screen overflow-x-hidden">
        <Navbar />
        <div className="relative w-full px-4 md:px-0">
          <div className="flex flex-col md:flex-row relative items-center justify-between w-full md:max-w-[85%] mx-auto">
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className={`w-full md:w-1/2 my-12 md:my-24 ${poppinsFont.className}`}
            >
              <div className="w-full md:pr-8 mt-16 md:mt-0">
                <motion.h1
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] text-center md:text-left leading-[1.1]! font-semibold mb-2"
                  variants={item}
                >
                  Transform Your Experience into an Impactful Resume
                </motion.h1>

                <motion.p
                  className="text-sm md:text-base font-medium text-gray-700 text-center md:text-left mb-4"
                  variants={item}
                >
                  {!isMobile && (
                    <span>Create standout resumes and impress employers. </span>
                  )}
                  Our user-friendly builder offers customizable templates to
                  ensure your resume is job-ready.
                </motion.p>

                <motion.ul
                  className={`flex flex-col gap-2 mb-6 ${
                    isMobile ? "pl-0" : "hidden md:flex pl-0!"
                  }`}
                  variants={featureListVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {features.map((feature, index) => (
                    <motion.li
                      key={index}
                      variants={featureItemVariants}
                      className={`flex items-center text-gray-600 gap-2 text-sm lg:text-base ${
                        isMobile ? "justify-start max-w-[90%] px-6" : ""
                      }`}
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.2 + 0.5 }}
                      >
                        {feature.icon}
                      </motion.div>
                      {feature.msg}
                    </motion.li>
                  ))}
                </motion.ul>

                <motion.div
                  className="flex gap-4 justify-center md:justify-start"
                  variants={item}
                >
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      variant="default"
                      className="px-8 shadow-md group shadow-primary/30 py-7"
                      onClick={() => router.push("/build-resume/steps")}
                    >
                      Create Free Resume
                      <ArrowRight
                        size={18}
                        className="ml-2 group-hover:ml-4 transition-all mt-[2.5px]"
                      />
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      variant="outline"
                      className="px-8 shadow-md group shadow-primary/30 py-7"
                      onClick={() => router.push("/resume-analysis")}
                    >
                      Analyze Resume
                      <ArrowRight
                        size={18}
                        className="ml-2 group-hover:ml-4 transition-all mt-[2.5px]"
                      />
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {isClient && (
              <>
                <motion.div
                  className={`
            hidden
            md:block absolute 
            md:-top-60 
            md:-right-16 -rotate-3 hover:-rotate-6
            transition-all duration-300
            !scale-[0.46]`}
                  variants={template2Variants}
                  initial="hidden"
                  animate="visible"
                >
                  <Template2 size="lg" obj={temp2Obj} />
                </motion.div>

                <motion.div
                  className={`
            hidden
            md:block absolute 
            md:-top-56 
            md:-right-48 rotate-0 hover:rotate-6
            transition-all duration-300
            !scale-[0.46]`}
                  variants={template3Variants}
                  initial="hidden"
                  animate="visible"
                >
                  <Template3 size="lg" obj={temp3obj} />
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
