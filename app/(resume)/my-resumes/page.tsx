"use client";
import Navbar from "@/components/Navbar";
import PreviewModal from "@/components/PreviewModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  geologicaFont,
  interFont,
  montserratFont,
  openSansFont,
  poppinsFont,
  ralewayFont,
} from "@/lib/font";
import { usePreview } from "@/lib/use-preview";
import { cn } from "@/lib/utils";
import { templateComponents } from "@/templates/templateStructures";
import { ResumeTemplate } from "@/types/templateTypes";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { Edit, Eye } from "lucide-react";
import React from "react";
import { useRouter } from 'nextjs-toploader/app';

const Page = () => {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const templates = useQuery(api.resume.getUserResumes, {
    userId: user?.id || "",
  });

  const preview = usePreview();

  if (!user) return null;

  if (templates === null || templates?.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center w-full h-[80vh]">
          <h1 className="text-xl font-medium">
            You have not created any resume yet.
          </h1>
        </div>
      </div>
    );
  }

  if (templates === undefined) {
    return (
      <>
        <Navbar />
        <div className="max-w-[85%] mx-auto flex gap-6">
          <ChooseSkeleton />
        </div>
      </>
    );
  }

  const editResume = (resumeId: Id<"resumes">) => {
    router.push(`/build-resume/${resumeId}/tips?sec=header`);
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center mt-8 mb-6 w-[85%] mx-auto">
        <div>
          <h1 className="text-2xl text-left font-medium tracking-normal pt-3 pb-1">
            My Resumes
          </h1>
          <p className="text-[15px] text-gray-600">
            Select a template and contine building your perfect resume.
          </p>
        </div>{" "}
      </div>
      <div className="max-w-[85%] mx-auto flex flex-wrap gap-6">
        {templates?.map((item, index) => {
          const TemplateComponent = templateComponents[item?.templateName];

          if (!TemplateComponent) {
            return <div key={index}>Something went wronng...</div>;
          }

          return (
            <div
              key={index}
              className="relative group inline-block w-[295px] h-[415px]"
            >
              <div
                className={cn(
                  item?.globalStyles?.fontFamily === "Inter" &&
                    interFont.className,
                  item?.globalStyles?.fontFamily === "Montserrat" &&
                    montserratFont.className,
                  item?.globalStyles?.fontFamily === "OpenSans" &&
                    openSansFont.className,
                  item?.globalStyles?.fontFamily === "Poppins" &&
                    poppinsFont.className,
                  item?.globalStyles?.fontFamily === "Geologica" &&
                    geologicaFont.className,
                  item?.globalStyles?.fontFamily === "Raleway" &&
                    ralewayFont.className
                )}
              >
                <TemplateComponent
                  obj={item as ResumeTemplate}
                  isPreview={true}
                />
              </div>
              <div className="absolute inset-0 w-full h-full p-10 flex items-center gap-5 rounded-xl cursor-pointer justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50">
                <Button
                  onClick={() => preview.onOpen(item as ResumeTemplate)}
                  className="py-2 px-5 flex items-center justify-center gap-2"
                >
                  <p>Preview</p> <Eye />
                </Button>
                <Button
                  onClick={() => editResume(item?._id)}
                  variant={"secondary"}
                  className="py-2 px-5 flex items-center justify-center gap-2"
                >
                  <p>Select</p> <Edit />
                </Button>
              </div>
            </div>
          );
        })}
        <PreviewModal />
      </div>
    </div>
  );
};

const ChooseSkeleton = () => {
  return (
    <div className="flex flex-col flex-wrap mt-8 mb-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="w-[250px] h-[30px] bg-slate-500/20 font-medium tracking-normal pt-3 pb-1"></Skeleton>
        <Skeleton className="w-[500px] h-[30px]  bg-slate-500/20 text-gray-600"></Skeleton>
      </div>{" "}
      <div className="flex gap-6 mt-6">
        {[0, 1, 2, 3].map((item, index) => (
          <Skeleton
            key={index}
            className=" w-[295px] h-[415px] bg-slate-500/20"
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
