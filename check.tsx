"use client";
import LiveResumePreview from "@/components/LiveResumePreview";
import VerticalTimeline from "@/components/VerticalTimeline";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { geologicaFont } from "@/lib/font";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "nextjs-toploader/app";
import ContineBtn from "@/components/ContineBtn";
import useMobile from "@/lib/useMobile";

const ResumeBuilderLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const isMobile = useMobile();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const resume = useQuery(api.resume.getTemplateDetails, {
    id: params.id as Id<"resumes">,
  });
  if (resume === undefined) {
    return null;
  }
  if (resume === null) {
    return <div>Template not found</div>;
  }
  if (isLoaded && resume?.userId !== user?.id) {
    toast.error("Not authenticated");
    return router.push("/");
  }
  const possibleSections = [
    "header",
    "experience",
    "skills",
    "education",
    "projects",
    "custom",
    "final",
  ] as const;

  let prevUrl;
  let nextUrl;

  const resumeId = params.id;
  let sectionArray: string[] = [];
  resume?.sections?.map((item) => sectionArray.push(item.type));

  const sec = searchParams.get("sec");
  if (sec && !possibleSections.includes(sec)) {
    toast.error("Invalid section");
    return router.push(`/build-resume/${params.id}/tips?sec=header`);
  }
  if (sec !== null) {
    const index = sectionArray.findIndex((item) => item === sec);

    if (index === -1) {
      toast.error("Invalid section");
      return router.push(`/build-resume/${params.id}/tips?sec=header`);
    }
    const nextSection = sec === "custom" ? "custom" : sectionArray[index];
    const prevSection = sectionArray[index - 1]
      ? sectionArray[index - 1]
      : "header";

    nextUrl = `/build-resume/${resumeId}/section/${nextSection}`;
    prevUrl =
      sec === "header"
        ? `/build-resume/${resumeId}/tips?sec=header`
        : `/build-resume/${resumeId}/section/${prevSection}`;
  } else {
    const sectionType = pathname.split("/section/")[1];
    if (!possibleSections.includes(sectionType)) {
      toast.error("Invalid section");
      return router.push(`/build-resume/${params.id}/tips?sec=header`);
    }
    let currentIndex = sectionArray.findIndex((item) => item === sectionType);
    prevUrl = `/build-resume/${params.id}/tips?sec=${sectionArray[currentIndex]}`;
    nextUrl =
      sectionType === "custom"
        ? `/build-resume/${params.id}/section/final`
        : sectionArray[currentIndex + 1]
          ? `/build-resume/${params.id}/tips?sec=${sectionArray[currentIndex + 1]}`
          : `/build-resume/${params.id}/section/custom`;
  }

  return (
    <>
      <div className="flex flex-shrink-0 bg-primary w-full md:hidden">
        <VerticalTimeline />
      </div>
      <div className="flex min-h-screen w-full">
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[150px] bg-primary hidden md:flex flex-shrink-0">
            <VerticalTimeline />
          </div>

          <div
            className={cn(
              "flex-grow  overflow-x-hidden md:max-w-[80%] overflow-y-auto",
              geologicaFont.className
            )}
          >
            {children}

            {isMobile && (
              <div className="flex flex-col md:flex-row max-w-[90%] mx-auto items-center mt-4 justify-between">
                <ContineBtn path={prevUrl} text="Back" type={"outline"} />
                <ContineBtn path={nextUrl} text="Continue" type={"default"} />
              </div>
            )}
          </div>
        </div>

        <div className="hidden  md:flex w-[30vw]">
          <LiveResumePreview />
        </div>
      </div>
    </>
  );
};

export default ResumeBuilderLayout;
