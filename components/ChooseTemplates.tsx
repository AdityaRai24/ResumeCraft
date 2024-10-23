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
import { useRouter } from 'nextjs-toploader/app';

const ChooseTemplates = () => {
  
  const { user } = useUser();
  const createUserResume = useMutation(api.resume.createUserResume);
  const router = useRouter();
  const templates = useQuery(api.resume.getTemplates);
  const preview = usePreview();

  if (templates === null) {
    return <div>no templates</div>;
  }
  if (templates === undefined) {
    return <ChooseSkeleton />;
  }
  if (!user){
    return redirect("/sign-up");
  };

  const selectResume = async (id: Id<"resumes">, templateName: string) => {
    const promise = createUserResume({
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

  return (
    <div className="grid grid-cols-3 gap-6 mt-2">
      {templates?.map((item, index) => {
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
            className={cn("relative group inline-block w-[295px] h-[415px]")}
          >
            <TemplateComponent obj={item as ResumeTemplate} isPreview={true} />
            <div className="absolute inset-0 w-full h-full p-10 flex items-center gap-5 rounded-xl cursor-pointer justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50">
              <Button
                onClick={() => preview.onOpen(item as ResumeTemplate)}
                className="py-2 px-5 flex items-center justify-center gap-2"
            >
                <p>Preview</p> <Eye />
              </Button>
              <Button
                onClick={() => selectResume(item?._id, item.templateName)}
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
  );
};

const ChooseSkeleton = () => {
  return (
    <>
      <div className="grid grid-cols-3 gap-6 mt-5">
        {[0, 1, 2].map((item, index) => (
          <Skeleton
            key={index}
            className=" w-[295px] h-[415px] bg-slate-500/20"
          />
        ))}
      </div>
    </>
  );
};

export default ChooseTemplates;
