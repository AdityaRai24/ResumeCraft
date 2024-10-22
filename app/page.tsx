"use client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { container, item } from "@/lib/motion";
import { geologicaFont, poppinsFont } from "@/lib/font";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { migrateResumes } from "@/convex/resume";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Template1 from "@/templates/template1/Template1";
import { temp2Obj } from "@/templates/template2/temp2obj";
import temp1Obj from "@/templates/template1/temp1obj";
import Template2 from "@/templates/template2/Template2";

export default function Home() {
  const oneTimeRef = useRef(false);
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
    <>
      <Navbar />
      <div className="flex items-center justify-between max-w-[85%] mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className={`my-12  mx-auto flex items-center justify-between ${poppinsFont.className}`}
        >
          <div className="max-w-[80%] mt-16 block">
            <motion.h1
              className="text-5xl text-left font-semibold leading-tight tracking-normal"
              
            >
              Craft Job-Ready, High-ATS Scoring Professional Resumes
            </motion.h1>

            <motion.p
              
              className="font-medium text-md max-w-[70%] text-gray-800  text-left pt-3 pb-4"
            >
              Create standout resumes and impress employers. Our user-friendly
              builder offers customizable templates to ensure your resume is
              job-ready.
            </motion.p>

            <motion.ul  className="flex flex-col gap-2 mb-6">
              <li className="flex items-center text-gray-600 gap-2">
                {" "}
                <Check className="text-primary" /> ATS-optimized resumes
              </li>
              <li className="flex items-center text-gray-600 gap-2">
                {" "}
                <Check className="text-primary" /> Professional templates
                tailored to industry standards
              </li>
              <li className="flex items-center text-gray-600 gap-2">
                {" "}
                <Check className="text-primary" /> Customizable layouts for
                personal branding
              </li>
              <li className="flex items-center text-gray-600 gap-2">
                {" "}
                <Check className="text-primary" /> Real-time preview to ensure
                perfection
              </li>
              <li className="flex items-center text-gray-600 gap-2">
                {" "}
                <Check className="text-primary" /> Save hours with easy-to-use
                tools
              </li>
            </motion.ul>

            <motion.div  className="flex items-center gap-8">
              <Link href={"/build-resume/steps"}>
                <Button className="py-[34px] px-8  text-base flex items-center gap-2 hover:gap-4 active:scale-[0.97] transition-all duration-300 ease-out">
                  Create Free Resume <ArrowRight size={18} />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
        <motion.div className="fixed top-24 -right-[38%] -rotate-2">
          <Template2 isLive isPreview obj={temp2Obj} />
        </motion.div>
      </div>
    </>
  );
}
