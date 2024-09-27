"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React from "react";
import SectionInfo from "@/components/SectionInfo";
import HeaderSkeleton from "@/components/HeaderSkeleton";
import HeaderForm from "@/components/forms/HeaderForm";
import { HeaderSection } from "@/types/templateTypes";

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
        if (item?.type === "header") {
          return (
            <div key={idx} className="my-24 mx-16">
              <SectionInfo
                heading={"Let's start with your header."}
                text="Include your full name and at least one way for employers to
                reach you."
              />
              <HeaderForm  resumeId={resumeId} item={item as HeaderSection} />
            </div>
          );
        }
        return null;
      })}
    </>
  );
};

export default Page;
