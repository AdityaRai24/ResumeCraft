"use client";
import Navbar from "@/components/Navbar";
import React from "react";
import ChooseTemplates from "@/components/ChooseTemplates";

const Page = () => {
  return (
    <>
      <div className="w-full">
        <Navbar />
        <div className="flex items-center mt-8 mb-6 w-[90%] md:w-[85%] mx-auto">
          <div>
            <h1 className="text-2xl text-left font-medium tracking-normal pt-3 pb-1">
              My Resumes.
            </h1>
            <p className="text-[15px] text-gray-600">
              Select a template and contine building your perfect resume.
            </p>
          </div>
        </div>

        <div className="max-w-[90%] md:max-w-[85%] mx-auto flex items-center justify-start">
          <ChooseTemplates myResumes={true} />
        </div>
      </div>
    </>
  );
};

export default Page;
