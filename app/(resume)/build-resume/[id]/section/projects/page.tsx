"use client";
import ProjectForm from "@/components/forms/ProjectForm";
import SectionInfo from "@/components/SectionInfo";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const params = useParams();
  const resumeId = params.id;
  const router = useRouter();
  const resume = useQuery(api.resume.getTemplateDetails, {
    id: resumeId as Id<"resumes">,
  });

  let sectionArray: string[] = [];
  resume?.sections?.map((item) => sectionArray.push(item.type));
  let projectIndex = sectionArray.findIndex((item) => item === "projects");
  
  const redirectLoc =
  projectIndex+1 === resume?.sections?.length
  ? `/build-resume/${resumeId}/section/final`
  : `/build-resume/${resumeId}/tips?sec=${sectionArray[projectIndex + 1]}`;
  
  console.log(redirectLoc)
  console.log(projectIndex+1)

  return (
    <>
      {resume?.sections?.map((item, idx) => {
        if (item?.type === "projects") {
          return (
            <div className="mt-24 mx-16" key={idx}>
              <SectionInfo
                heading="Time to showcase your projects !!"
                text="Write about any of your projects or past work to impress your employer."
              />

              <ProjectForm resumeId={resumeId as Id<"resumes">} item={item} />
              <div className="flex">
                <Button
                  onClick={() => {
                    router.push(redirectLoc);
                  }}
                  className="px-16 py-8 mt-6 text-xl rounded-full"
                >
                  Next
                </Button>
              </div>
            </div>
          );
        }
      })}
    </>
  );
};

export default page;
