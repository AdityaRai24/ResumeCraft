"use client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { motion, stagger } from "framer-motion";
import { container, item } from "@/lib/motion";
import { geologicaFont, poppinsFont } from "@/lib/font";
import { ArrowRight, Check, Sparkles, Download } from "lucide-react";
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
      msg: "500+ Resumes Created !!",
    },
    {
      icon: <Download className="text-primary shrink-0" size={32} />,
      msg: "Instant PDF download & sharing",
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
          <div className="flex flex-col md:flex-row relative items-center  justify-between w-full md:max-w-[90%] mx-auto">
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className={`w-full md:w-1/2 flex flex-col h-[90vh] justify-center ${poppinsFont.className}`}
            >
              <div className="w-full ">
               
                <motion.h1
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center md:text-left leading-[1.1] font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
                  variants={item}
                >
                  Transform Your Experience into an{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Impactful Resume
                  </span>
                </motion.h1>

                <motion.p
                  className="text-base md:text-lg font-normal text-muted-foreground text-center md:text-left mb-6 leading-relaxed max-w-2xl"
                  variants={item}
                >
                  {!isMobile && (
                    <span className="font-medium text-foreground">
                      Create standout resumes and impress employers.{" "}
                    </span>
                  )}
                  {/* Our AI-powered builder offers professional templates and
                  real-time optimization to ensure your resume gets noticed. */}
                </motion.p>

                <motion.div
                  className={`grid gap-2 mb-6 ${
                    isMobile ? "grid-cols-1 px-6" : "hidden md:grid grid-cols-2"
                  }`}
                  variants={featureListVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      variants={featureItemVariants}
                      className="flex cursor-pointer items-center gap-2 p-3 rounded-xl bg-card/60 border border-border/60 hover:bg-card/90 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-300 group backdrop-blur-sm"
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.2 + 0.5 }}
                        className="flex-shrink-0 p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 shadow-sm"
                      >
                        {feature.icon}
                      </motion.div>
                      <span className="text-xs font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-300">
                        {feature.msg}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
                  variants={item}
                >
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Button
                      variant="default"
                      className="relative px-6 h-14 text-sm font-semibold shadow-lg group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary border-0 rounded-lg"
                      onClick={() => router.push("/build-resume/steps")}
                    >
                      <span className="flex items-center gap-2">
                        Create Free Resume
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform duration-200"
                        />
                      </span>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="px-6 h-14 text-sm font-semibold shadow-lg group border-2 border-primary/20 hover:border-primary/40 bg-background/80 backdrop-blur-sm hover:bg-primary/5 transition-all duration-300 rounded-lg"
                      onClick={() => router.push("/resume-analysis")}
                    >
                      <span className="flex items-center gap-2">
                        Analyze Resume
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform duration-200"
                        />
                      </span>
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
                  <Template2 size="lg" textSize="sm" obj={temp2Obj} />
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
