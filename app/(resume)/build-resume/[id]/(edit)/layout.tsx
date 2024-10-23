"use client"
import LiveResumePreview from "@/components/LiveResumePreview";
import VerticalTimeline from "@/components/VerticalTimeline";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { geologicaFont } from "@/lib/font";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from 'nextjs-toploader/app';

const ResumeBuilderLayout = ({ children }: { children: React.ReactNode }) => {

  const params = useParams()

  const resume = useQuery(api.resume.getTemplateDetails,{
    id: params.id as Id<"resumes">
  })
  const {user,isLoaded} = useUser()  
  const router = useRouter() 
  
  if(resume === undefined){
    return null;
  }
  if(resume === null){
    return <div>Template not found</div>
  }

  if(isLoaded && resume?.userId !== user?.id){
    toast.error("Not authenticated")
    return router.push("/")
  }


  return (
    <>
      <div className="flex min-h-screen w-full">
        <div className="flex flex-1 overflow-hidden">
          {/* STATUS */}
          <div className="w-[150px] bg-primary flex-shrink-0">
            <VerticalTimeline />
          </div>

          {/* FORM */}
          <div
            className={cn(
              "flex-grow overflow-y-auto",
              geologicaFont.className
            )}
          >
            {children}
          </div>
        </div>

        {/* PREVIEW */}
        <div className="w-[35vw]">
          <LiveResumePreview />
        </div>
      </div>
    </>
  );
};

export default ResumeBuilderLayout;
