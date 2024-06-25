"use client";
import { useParams } from "next/navigation";
import React from "react";
import Template1 from "@/templates/template1/template1";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const LiveResumePreview = () => {
    const params = useParams()
    const templateDetails = useQuery(api.resume.getTemplateDetails,{
      id: params.id as Id<"resumes">
    })
    
    if(templateDetails === null){
      return <div>Template not found</div>
    }
  
    if(templateDetails === undefined){  
      return <div>Loading...</div>
    }
    console.log(templateDetails)

  return (
    <div className="relative overflow-hidden mr-32 mb-2 w-[400px] h-[575px] group">
    <Template1 obj={templateDetails} isLive size="preview" />
    <div
      className="absolute w-full h-full inset-0 flex items-center justify-center
      opacity-0 group-hover:opacity-100 transition cursor-pointer
      duration-300 group-hover:bg-black/50 rounded-xl p-10 "
    >
      <Button className="py-2 px-5 flex items-center justify-center gap-2 ">
        <p>Preview</p> <Eye />
      </Button>
    </div>
  </div>
  )
}

export default LiveResumePreview