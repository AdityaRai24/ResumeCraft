"use client";
import EducationForm from "@/components/forms/EducationForm";
import SectionInfo from "@/components/SectionInfo";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const page = () => {
  const params = useParams();
  const resumeId = params.id;
  const resume = useQuery(api.resume.getTemplateDetails, {
    id: resumeId as Id<"resumes">,
  });
  const router = useRouter()
  if (resume === null) {
    return <div>No template found</div>;
  }
  if (resume === undefined) {
    return <div>Loading...</div>;
  }

  let sectionArray: string[] = [];
  resume?.sections?.map((item) => sectionArray.push(item.type));
  let experienceIndex = sectionArray.findIndex((item) => item === "education");

  return (
    <>
      {resume?.sections?.map((item,idx) => {
        if (item?.type === "education") {
          return (
            <div key={idx} className="mt-24 mx-16">
              <SectionInfo
                heading="Let's talk about your education."
                text="Tell us about any colleges, vocational programs, or training courses you took. Even if you didn't finish, it's important to list them.
"
              />

              <EducationForm resumeId={resumeId as Id<"resumes">} item={item}/>
              <div className="flex">
                <Button
                  onClick={() => {
                    router.push(
                      `/build-resume/${resumeId}/tips?sec=${sectionArray[experienceIndex + 1]}`
                    );
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
