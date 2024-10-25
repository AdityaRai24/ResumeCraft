import React, { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import {
  Baseline,
  Brain,
  FolderKanban,
  GraduationCap,
  LineChart,
  PenToolIcon,
  User,
} from "lucide-react";
import {
  redirect,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "nextjs-toploader/app";

const Timeline = () => {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.id;
  const [isMobile, setIsMobile] = useState(false);

  const resume = useQuery(api.resume.getTemplateDetails, {
    id: resumeId as Id<"resumes">,
  });

  const pathname = usePathname();
  const currentSec = pathname.split("section/")[1];

  const searchParams = useSearchParams();
  const sec = searchParams.get("sec");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  let sectionArray: string[] = [];
  resume?.sections?.map((item) => {
    item.type !== "custom" && sectionArray.push(item.type);
  });
  sectionArray.push("custom");
  sectionArray.push("final");

  const sectionIconMap: any = {
    header: User,
    experience: LineChart,
    education: GraduationCap,
    skills: Brain,
    projects: FolderKanban,
    final: Baseline,
    custom: PenToolIcon,
  };

  const TimelineItem = ({
    section,
    index,
    total,
  }: {
    section: string;
    index: number;
    total: number;
  }) => {
    const SectionIcon = sectionIconMap[section];

    return (
      <div className={`relative ${isMobile ? "mx-6" : "mb-16"} `}>
        <div
          className={`absolute ${isMobile ? "top-1/2 -translate-y-1/2" : "left-1/2 -translate-x-1/2 -translate-y-1/2"} w-9 h-9 rounded-full flex items-center justify-center`}
        >
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={
                    section === "final"
                      ? `/build-resume/${resumeId}/section/${section}`
                      : `/build-resume/${resumeId}/tips?sec=${section}`
                  }
                >
                  <div
                    className={`${
                      currentSec === section || sec === section
                        ? "ring-black ring-2 ring-offset-8"
                        : ""
                    } bg-transparent rounded-full`}
                  >
                    <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center">
                      <SectionIcon />
                    </div>
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                sideOffset={5}
                className=" bg-white shadow-!z-[100000] lg border border-gray-200"
                style={{ position: 'relative' }}
              >
                <p className="capitalize">{section}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className={`${isMobile ? "mt-16" : "ml-4"} p-2`}></div>
      </div>
    );
  };

  return (
    <div
      className={`${
        isMobile
          ? "w-full h-full sticky top-0 bg-background"
          : "h-full fixed pl-10"
      } flex flex-col items-center justify-center`}
      style={{ zIndex: 50 }}
    >
      <Button
        variant="ghost"
        className="text-white hidden md:block underline mt-4"
        onClick={() => router.push("/build-resume/templates")}
      >
        Back
      </Button>
      <div
        className={`relative bg-primary ${isMobile ? "w-full overflow-x-auto" : "h-full mt-16"}`}
      >
        <div
          className={`absolute ${
            isMobile
              ? "top-1/2 h-0.5 w-[calc(100%-3rem)]"
              : "left-1/2 h-[calc(100%-6.5rem)] w-0.5"
          } bg-gray-300 transform ${isMobile ? "-translate-y-1/2 left-6" : "-translate-x-1/2 -top-4"}`}
        />
        <div className={`${isMobile ? "flex flex-row relative" : ""}`}>
          {sectionArray.map((section, index) => (
            <TimelineItem
              key={index}
              section={section}
              index={index}
              total={sectionArray.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;