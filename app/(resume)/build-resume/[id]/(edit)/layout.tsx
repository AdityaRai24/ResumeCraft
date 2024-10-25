"use client";

import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useRouter } from "nextjs-toploader/app";
import React from "react";
import toast from "react-hot-toast";

import LiveResumePreview from "@/components/LiveResumePreview";
import VerticalTimeline from "@/components/VerticalTimeline";
import ContineBtn from "@/components/ContineBtn";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { geologicaFont } from "@/lib/font";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { item } from "@/lib/motion";
import useMobile from "@/lib/useMobile";
import MobilePreviewButton from "@/components/MobilePreviewButton";
import PreviewModal from "@/components/PreviewModal";
import { ResumeTemplate } from "@/types/templateTypes";
import { Button } from "@/components/ui/button";

// Types
type Section =
  | "header"
  | "experience"
  | "skills"
  | "education"
  | "projects"
  | "custom"
  | "final";
type ResumeSection = {
  type: Section;
};

interface ResumeData {
  userId: string;
  sections: ResumeSection[];
}

interface ResumeBuilderLayoutProps {
  children: React.ReactNode;
}

// Constants
const POSSIBLE_SECTIONS: readonly Section[] = [
  "header",
  "experience",
  "skills",
  "education",
  "projects",
  "custom",
  "final",
];

const ResumeBuilderLayout: React.FC<ResumeBuilderLayoutProps> = ({
  children,
}) => {
  // Hooks
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isMobile = useMobile();

  const resumeId = params.id as Id<"resumes">;
  const resume = useQuery(api.resume.getTemplateDetails, { id: resumeId });

  // Helper functions
  const validateSection = (section: string): section is Section => {
    return POSSIBLE_SECTIONS.includes(section as Section);
  };

  const getNavigationUrls = (
    sectionArray: Section[],
    currentSection: string | null,
    pathname: string
  ): { prevUrl: string; nextUrl: string } => {
    if (currentSection) {
      return handleSearchParamNavigation(sectionArray, currentSection);
    }
    return handlePathNavigation(sectionArray, pathname);
  };

  const handleSearchParamNavigation = (
    sectionArray: Section[],
    sec: string
  ) => {
    const index = sectionArray.findIndex((item) => item === sec);
    const nextSection = sec === "custom" ? "custom" : sectionArray[index];
    const prevSection = sectionArray[index - 1] ?? "header";

    return {
      nextUrl: `/build-resume/${resumeId}/section/${nextSection}`,
      prevUrl:
        sec === "header"
          ? `/build-resume/${resumeId}/tips?sec=header`
          : `/build-resume/${resumeId}/section/${prevSection}`,
    };
  };

  const handlePathNavigation = (sectionArray: Section[], pathname: string) => {
    const sectionType = pathname.split("/section/")[1] as Section;
    const currentIndex = sectionArray.findIndex((item) => item === sectionType);

    return {
      prevUrl:
        sectionType === "final"
          ? `/build-resume/${resumeId}/tips?sec=custom`
          : `/build-resume/${resumeId}/tips?sec=${sectionArray[currentIndex]}`,
      nextUrl:
        sectionType === "custom"
          ? `/build-resume/${resumeId}/section/final`
          : sectionType === "final"
            ? `/build-resume/${resumeId}/download`
            : `/build-resume/${resumeId}/tips?sec=${sectionArray[currentIndex + 1]}`,
    };
  };

  // Error handling and validation
  if (resume === undefined) return null;
  if (resume === null) return <div>Template not found</div>;
  if (isLoaded && resume?.userId !== user?.id) {
    toast.error("Not authenticated");
    router.push("/");
    return null;
  }

  const sectionArray: Section[] = resume.sections.map((item) => item.type);
  sectionArray.push("custom");
  sectionArray.push("final");
  const sec = searchParams.get("sec");

  if (sec && !validateSection(sec)) {
    toast.error("Invalid section");
    router.push(`/build-resume/${resumeId}/tips?sec=header`);
    return null;
  }

  const currentSection = pathname.split("/section/")[1];
  if (currentSection && !validateSection(currentSection)) {
    toast.error("Invalid section");
    router.push(`/build-resume/${resumeId}/tips?sec=header`);
    return null;
  }

  const { prevUrl, nextUrl } = getNavigationUrls(sectionArray, sec, pathname);

  // Render
  return (
    <>
      <div className="flex flex-shrink-0 !z-[100000] bg-primary w-full md:hidden">
        <VerticalTimeline />
      </div>
      <div className="relative pt-6 w-full px-4  flex md:hidden items-center justify-between">
        <Button
        onClick={()=>router.push('/build-resume/templates')}
          variant={"outline"}
          className="  cursor-pointer"
        >
          Home
        </Button>
        <MobilePreviewButton item={resume as ResumeTemplate} />
      </div>
      <div className="flex md:min-h-screen w-full">
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[150px] bg-primary hidden md:flex flex-shrink-0">
            <VerticalTimeline />
          </div>

          <div
            className={cn(
              "flex-grow overflow-x-hidden !z-[1] md:max-w-[80%] overflow-y-auto",
              geologicaFont.className
            )}
          >
            {children}
            {(isMobile || (!currentSection && !isMobile)) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.8,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
                className="flex mb-32 md:mb-0 flex-col md:flex-row w-full md:max-w-[90%] px-4 md:px-16 items-center mt-4 justify-between"
              >
                <ContineBtn path={prevUrl} text="Back" type="outline" />
                <ContineBtn path={nextUrl} text="Continue" type="default" />
              </motion.div>
            )}
          </div>
        </div>

        <div className="hidden md:flex w-[30vw]">
          <LiveResumePreview />
        </div>
      </div>

      <PreviewModal />
    </>
  );
};

export default ResumeBuilderLayout;
