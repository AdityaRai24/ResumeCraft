"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Computer, LayoutTemplate, PencilLine } from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { container, item } from "@/lib/motion";
import { geologicaFont, poppinsFont } from "@/lib/font";
const Page = () => {
  return (
    <>
      <div
        className={`flex items-center justify-between gap-3 max-w-[85%] mx-auto h-[90vh] ${poppinsFont.className}`}
      >
        <div className="w-[50%]">
          <div className="pl-6 flex flex-col gap-2">
            <p className="text-primary font-semibold text-xl">
              Say hello to ResumeCraft
            </p>
            <h1 className="text-5xl max-w-[100%] font-[650] tracking-wide  leading-[1.15]  ">
              Get your resume ready in 3 steps
            </h1>
            <p className="max-w-[70%] text-base">
              Resume Craft gives you the tools and guidance you need to create a
              truly professional resume that highlights your skills and
              experience.
            </p>
            <div className="flex mt-4 items-center max-w-[70%] justify-between">
              <Link href={"/"} className="w-[45%]">
                <Button
                  variant={"outline"}
                  className="py-[28px] w-full px-6 hover:border-primary border-2 hover:scale-[1.03] active:scale-[0.97] transition duration-300 ease"
                >
                  Back
                </Button>{" "}
              </Link>
              <Link href={"/build-resume/templates"} className="w-[45%]">
                <Button className="py-[28px] w-full px-6 hover:scale-[1.03] active:scale-[0.97] transition duration-300 ease">
                  Next <ArrowRight size={18} />
                </Button>{" "}
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 max-w-[48%]">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-primary/10 p-5 rounded-full">
              <Computer />
            </div>
            <div className="flex flex-col gap-3 p-2">
              <h1 className="font-semibold tracking-wide text-xl">
                Step-1: Start with a great template
              </h1>
              <p>
                Choose from our collection of pre-designed templates tailored
                for various industries and career levels.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center  gap-3">
            <div className="bg-primary/10 p-5 rounded-full">
              <LayoutTemplate />
            </div>
            <div className="flex flex-col gap-3 p-2">
              <h1 className="font-semibold tracking-wide text-xl">
                Step-2: Add compelling content
              </h1>
              <p>
                Utilize our AI-powered content suggestions to effectively
                describe your skills, experience, and achievements.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="bg-primary/10 p-5 rounded-full">
              <PencilLine />
            </div>
            <div className="flex flex-col gap-3 p-2">
              <h1 className="font-semibold tracking-wide text-xl">
                Step-3: Customize and polish
              </h1>
              <p>
                Fine-tune your resume's layout, style, and content to make it
                uniquely yours and stand out to employers.{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
