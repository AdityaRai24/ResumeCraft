"use client";
import ProjectForm from "@/components/forms/ProjectForm";
import HeaderSkeleton from "@/components/HeaderSkeleton";
import SectionInfo from "@/components/SectionInfo";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ProjectSection } from "@/types/templateTypes";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React from "react";
import { useRouter } from 'nextjs-toploader/app';

const Page = () => {
  const params = useParams();
  const resumeId = params.id;
  const router = useRouter();
  const resume = useQuery(api.resume.getTemplateDetails, {
    id: resumeId as Id<"resumes">,
  });
  if (resume === null) {
    return <div>No template found</div>;
  }
  if (resume === undefined) {
    return <HeaderSkeleton />;
  }


  let sectionArray: string[] = [];
  resume?.sections?.map((item) => sectionArray.push(item.type));
  let projectIndex = sectionArray.findIndex((item) => item === "projects");

  return (
    <>
      {resume?.sections?.map((item, idx) => {
        if (item?.type === "projects") {
          return (
            <div key={idx} className="my-10 md:my-24 mx-4 md:mx-16">
              <SectionInfo
                heading="Time to showcase your projects !!"
                text="Write about any of your projects or past work to impress your employer."
              />
              <ProjectForm resumeId={resumeId as Id<"resumes">} item={item as ProjectSection} />
            </div>
          );
        }
      })}
    </>
  );
};

export default Page;
