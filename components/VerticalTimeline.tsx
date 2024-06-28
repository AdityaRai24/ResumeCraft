"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import {
  BadgeInfo,
  Baseline,
  Brain,
  FolderKanban,
  GraduationCap,
  LineChart,
  User,
  User2,
} from "lucide-react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Link from "next/link";

const VerticalTimeline = () => {
  const params = useParams();
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

  const sections = [
    {
      title: "Introduction",
      icon: BadgeInfo,
      name: "introduction",
    },
    {
      title: "Header",
      icon: User,
      name: "header",
    },
    {
      title: "Experience",
      icon: LineChart,
      name: "experience",
    },
    {
      title: "Education",
      icon: GraduationCap,
      name: "education",
    },
    {
      title: "Skills",
      icon: Brain,
      name: "skills",
    },
    {
      title: "Projects",
      icon: FolderKanban,
      name: "projects",
    },
    {
      title: "Format",
      icon: Baseline,
      name: "final",
    },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center py-8">
      <div className="relative h-full mt-16">
        <div className="absolute left-1/2 h-[80%] w-0.5  bg-gray-300 transform -translate-x-1/2"></div>
        <div className="">
          {sections.map((section, index) => (
            <div key={index} className="relative mb-16">
              <div className="absolute bg-[blue] left-1/2 w-9 h-9 rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link href={`/build-resume/${resumeId}/tips?sec=${section.name}`}>
                        <div
                          className={`${currentSec === section.name || sec === section.name ? "ring-black ring-2 ring-offset-8" : ""}   bg-[transparent]  rounded-full`}
                        >
                          <div
                            className={`${currentSec === section.name || sec === section.name ? "w-9 h-9 " : "w-9 h-9"}  bg-white rounded-full flex items-center justify-center`}
                          >
                            <section.icon />
                          </div>
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{section.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="ml-8 p-2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerticalTimeline;
