"use client";
import EducationForm from "@/components/forms/EducationForm";
import HeaderSkeleton from "@/components/HeaderSkeleton";
import SectionInfo from "@/components/SectionInfo";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { EducationSection } from "@/types/templateTypes";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const params = useParams();
  const resumeId = params.id;
  const resume = useQuery(api.resume.getTemplateDetails, {
    id: resumeId as Id<"resumes">,
  });
  if (resume === null) {
    return <div>No template found</div>;
  }
  if (resume === undefined) {
    return <HeaderSkeleton />;
  }

  return (
    <>
      {resume?.sections?.map((item, idx) => {
        if (item?.type === "education") {
          return (
            <div key={idx} className="my-10 md:my-24 mx-4 md:mx-16">
              <SectionInfo
                heading="Let's talk about your education."
                text="Tell us about any colleges, vocational programs, or 
                training courses you took. Even if you didn't finish, it's important to list them."
              />
              <EducationForm resumeId={resumeId as Id<"resumes">} item={item as EducationSection} />
            </div>
          );
        }
      })}
    </>
  );
};

export default Page;
