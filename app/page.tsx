"use client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { container, item } from "@/lib/motion";
import { geologicaFont, poppinsFont } from "@/lib/font";
import { ArrowRight, Check } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { temp2Obj } from "@/templates/template2/temp2obj";
import Template2 from "@/templates/template2/Template2";
import { useRouter } from "next/navigation";
import Template1 from "@/templates/template1/Template1";
import temp1Obj from "@/templates/template1/temp1obj";
import useMobile from "@/lib/useMobile";

export default function Home() {
  
  const router = useRouter();
  const isMobile = useMobile();

  // const oneTimeRef = useRef(false);
  // const migration = useMutation(api.resume.migrateResumes);

  // useEffect(() => {
  //   if (!oneTimeRef.current) {
  //     const promise = migration()
  //       .then((res) => {
  //         console.log(res, "yes");
  //       })
  //       .catch((err) => {
  //         console.log(err, "no");
  //       });
  //     oneTimeRef.current = true;
  //   }
  // }, []);

  return (
    <div className="h-screen overflow-x-hidden">
      <Navbar />
      <div className="relative w-full px-4 md:px-0">
        <div className="flex  flex-col md:flex-row relative items-center justify-between w-full md:max-w-[85%] mx-auto">
          {/* Content Section */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className={`w-full md:w-1/2 my-12 md:my-24 ${poppinsFont.className}`}
          >
            <div className="w-full md:pr-8">
              {/* Heading */}
              <motion.h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] text-center md:text-left !leading-[1.1] font-semibold mb-2"
                variants={item}
              >
                Transform Your Experience into an Impactful Resume
              </motion.h1>

              {/* Description */}
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

              {/* Features List */}
              <motion.ul
                className="hidden md:flex flex-col gap-2 mb-6"
                variants={item}
              >
                {[
                  "ATS-optimized resumes",
                  "Professional templates tto industry standards",
                  "Customizable layouts for personal branding",
                  "Real-time preview to ensure perfection",
                  "Save hours with easy-to-use tools",
                ].map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-gray-600 gap-2 text-sm lg:text-base"
                  >
                    <Check className="text-primary flex-shrink-0" size={18} />
                    {feature}
                  </li>
                ))}
              </motion.ul>

              {/* CTA Button */}
              <motion.div
                className="flex justify-center md:justify-start"
                variants={item}
              >
                <Button
                  variant="big_icon"
                  onClick={() => router.push("/build-resume/steps")}
                >
                  Create Free Resume
                  <ArrowRight size={18} className="ml-2 mt-[2.5px]" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Template Preview */}
          <motion.div
            className={`
              !scale-[0.6] md:!scale-[0.46]
               md:block  absolute 
               top-20 md:-top-60 
               -right-full
                md:-right-16 
                -rotate-6 transition-all duration-300`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Template2 obj={temp2Obj} />
          </motion.div>

          <motion.div
            className={`
              !scale-[0.6] md:!scale-[0.46]
               md:block absolute 
               top-20 md:-top-56 
               -right-full
                md:-right-48 
                rotate-6 transition-all duration-300`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Template1 size="lg" obj={temp1Obj} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
