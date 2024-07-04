"use client";

import SkillsForm from "@/components/forms/SkillsForm";
import HeaderSkeleton from "@/components/HeaderSkeleton";
import SectionInfo from "@/components/SectionInfo";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";

const Page = () => {
  const params = useParams();
  const resumeId = params.id;
  const resume = useQuery(api.resume.getTemplateDetails, {
    id: resumeId as Id<"resumes">,
  });

  if (resume === null) {
    return <div>No Template Found</div>;
  }
  if (resume === undefined) {
    return <HeaderSkeleton />;
  }

  let sectionArray: string[] = [];
  resume?.sections?.map((item) => sectionArray.push(item.type));


  return (
    <>
      {resume?.sections?.map((item, index) => {
        if (item?.type === "skills") {
          return (
            <div key={index} className="mt-24 mx-16">
              <SectionInfo
                heading="We recommend including 6-8 skills"
                text="Choose skills that align with the job requirements. Show employers you're confident of the work you do!"
              />

              <SkillsForm resumeId={resumeId as Id<"resumes">} styles={item?.style} item={item}/>
            </div>
          );
        }
      })}
    </>
  );
};

export default Page;
