"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import {
  Baseline,
  Brain,
  FolderKanban,
  GraduationCap,
  LineChart,
  User,
} from "lucide-react";
import { redirect, useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Link from "next/link";
import { Button } from "./ui/button";

const VerticalTimeline = () => {
  const params = useParams();
  const router = useRouter()
  const resumeId = params.id;
  const resume = useQuery(api.resume.getTemplateDetails, {
    id: resumeId as Id<"resumes">,
  });

  const pathname = usePathname();
  const currentSec = pathname.split("section/")[1];

  const searchParams = useSearchParams();
  const sec = searchParams.get("sec");

  let sectionArray: string[] = [];
  resume?.sections?.map((item) => sectionArray.push(item.type));
  sectionArray.push("final");

  const sectionIconMap : any = {
    header: User,
    experience: LineChart,
    education: GraduationCap,
    skills: Brain,
    projects: FolderKanban,
    final: Baseline,
  };

  return (
    <div className="h-full flex flex-col items-center justify-center py-8">
       <Button variant={'ghost'} className="text-white underline" onClick={()=>router.push('/build-resume/templates')}>Back</Button>
      <div className="relative h-full mt-16">
        <div className="absolute left-1/2 h-[80%] w-0.5  bg-gray-300 transform -translate-x-1/2"></div>
        <div className="">
          {sectionArray.map((section, index) => {
            const SectionIcon = sectionIconMap[section];

            return (
              <div key={index} className="relative mb-16">
                <div className="absolute bg-[blue] left-1/2 w-9 h-9 rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link
                          href={
                            section === "final"
                              ? `/build-resume/${resumeId}/section/${section}`
                              : `/build-resume/${resumeId}/tips?sec=${section}`
                          }
                        >
                          <div
                            className={`${currentSec === section || sec === section ? "ring-black ring-2 ring-offset-8" : ""}   bg-[transparent]  rounded-full`}
                          >
                            <div
                              className={`${currentSec === section || sec === section ? "w-9 h-9 " : "w-9 h-9"}  bg-white rounded-full flex items-center justify-center`}
                            >
                              <SectionIcon />
                            </div>
                          </div>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="capitalize">{section}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="ml-8 p-2"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VerticalTimeline;
