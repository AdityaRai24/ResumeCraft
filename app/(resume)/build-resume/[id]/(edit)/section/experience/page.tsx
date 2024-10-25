"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React from "react";
import SectionInfo from "@/components/SectionInfo";
import HeaderSkeleton from "@/components/HeaderSkeleton";
import ExperienceForm from "@/components/forms/ExperienceForm";

const Page = () => {

  const params = useParams();
  const resumeId = params.id as Id<"resumes">;
  const resume = useQuery(api.resume.getTemplateDetails, { id: resumeId });

  if (resume === null) {
    return <div>Template not found</div>;
  }

  if (resume === undefined) {
    return <HeaderSkeleton />;
  }

  return (
    <>
      {resume.sections?.map((item, idx) => {
        if (item?.type === "experience") {
          return (
            <div key={idx} className="my-10 md:my-24 mx-4 md:mx-16">
              <SectionInfo
                heading={"Let's work on your experience."}
                text={"Start with your most recent job first."}
              />

              <ExperienceForm resumeId={resumeId} item={item} />
            </div>
          );
        }
        return null;
      })}
    </>
  );
};

export default Page;
