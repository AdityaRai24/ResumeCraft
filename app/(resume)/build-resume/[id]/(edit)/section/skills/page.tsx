"use client";

import SkillsForm from "@/components/forms/SkillsForm";
import HeaderSkeleton from "@/components/HeaderSkeleton";
import SectionInfo from "@/components/SectionInfo";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";

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

  return (
    <>
      {resume?.sections?.map((item, idx) => {
        if (item?.type === "skills") {
          return (
            <div key={idx} className="my-10 md:my-24 mx-4 md:mx-16">
              <SectionInfo
                heading="Showcase Your Skills"
                text="Highlight your technical abilities and showcase your expertise in key technologies and tools for building modern applications."
              />

              <SkillsForm
                resumeId={resumeId as Id<"resumes">}
                styles={item?.style}
                item={item}
              />
            </div>
          );
        }
      })}
    </>
  );
};

export default Page;
