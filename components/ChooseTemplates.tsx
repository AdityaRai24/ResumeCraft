"use client";
import { Button } from "./ui/button";
import { Edit, Eye } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "./ui/skeleton";
import {
  templateComponents,
  TemplateComponentType,
} from "@/templates/templateStructures";
import { ResumeTemplate } from "@/types/templateTypes";
import { usePreview } from "@/lib/use-preview";
import PreviewModal from "./PreviewModal";
import { cn } from "@/lib/utils";
import React from "react";
import { useRouter } from "nextjs-toploader/app";
import Template3 from "@/templates/template3/Template3";
import temp1Obj from "@/templates/template1/temp1obj";
import temp3obj from "@/templates/template3/temp3obj";

const ChooseTemplates = ({ myResumes = false }: { myResumes?: boolean }) => {
  const { user } = useUser();
  const createUserResume = useMutation(api.resume.createUserResume);
  const router = useRouter();
  const templates = useQuery(api.resume.getTemplates);
  const myResumeTemplates = useQuery(api.resume.getUserResumes, {
    userId: user?.id || "",
  });
  const preview = usePreview();

  const finalTemplates = myResumes ? myResumeTemplates : templates;

  if (finalTemplates === undefined) {
    return <ChooseSkeleton />;
  }
  if (finalTemplates.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-[50vh]">
        <h1 className="text-xl font-medium">
          {myResumes ? "No resumes found" : "No templates found"}
        </h1>
      </div>
    );
  }
  if (!user) {
    return redirect("/sign-up");
  }

  const selectResume = async (id: Id<"resumes">, templateName: string) => {
    createUserResume({
      id: id,
      userId: user?.id,
      templateName: templateName,
    })
      .then((res) => {
        return router.push(`/build-resume/${res}/tips?sec=header`);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong...");
      });
  };

  const editResume = (resumeId: Id<"resumes">) => {
    router.push(`/build-resume/${resumeId}/tips?sec=header`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {finalTemplates?.map((item, index) => {
        const TemplateComponent: TemplateComponentType =
          templateComponents[item.templateName];

        if (!TemplateComponent) {
          console.error(
            `No component found for template: ${item.templateName}`
          );
          return null;
        }

        return (
          <div
            key={index}
            className={cn(
              "relative group mx-auto w-[159px] h-[225px] md:w-[295px] md:h-[415px]",
              "transition-transform duration-300"
            )}
          >
            <div className="w-full h-full">
              <TemplateComponent
                obj={item as ResumeTemplate}
                size="sm"
                isPreview={true}
              />
            </div>

            <div className="absolute inset-0 w-full h-full p-4 sm:p-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-5 rounded-md cursor-pointer justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50">
              <Button
                onClick={() => preview.onOpen(item as ResumeTemplate)}
                className="w-[50%] md:w-full  flex items-center justify-center gap-2"
              >
                <p className="hidden md:block">Preview</p>{" "}
                <Eye className="md:h-4 md:w-4 h-6 w-6" />
              </Button>
              <Button
                onClick={
                  myResumes
                    ? () => editResume(item?._id)
                    : () => selectResume(item?._id, item.templateName)
                }
                variant={"secondary"}
                className="w-[50%] md:w-full py-2 px-5 flex items-center justify-center gap-2"
              >
                <p className="hidden md:block">Select</p>{" "}
                <Edit className="md:h-4 md:w-4 h-5 w-5" />
              </Button>
            </div>
          </div>
        );
      })}
      {/* <Template3 obj={temp3obj} size="sm" /> */}
      <div>
        <PreviewModal />
      </div>
    </div>
  );
};

const ChooseSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <div
          key={item}
          className="relative mx-auto w-[159px] h-[225px] md:w-[295px] md:h-[415px]"
        >
          <Skeleton className="w-full h-full rounded-md bg-slate-500/20" />
        </div>
      ))}
    </div>
  );
};

export default ChooseTemplates;
