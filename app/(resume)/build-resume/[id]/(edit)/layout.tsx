"use client";

import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "nextjs-toploader/app";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
import { premiumTemplates } from "@/templates/templateStructures";
import Chatbot from "@/components/Chatbot";
import ChatBotAssistModal from "@/components/ChatBotAssistModal";
import { useChatBotStore } from "@/store";

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

interface ResumeBuilderLayoutProps {
  children: React.ReactNode;
}

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
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isMobile = useMobile();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);

  const resumeId = params.id as Id<"resumes">;
  const resumeQuery = useQuery(api.resume.getTemplateDetails, { id: resumeId });
  const isPremiumMember = useQuery(api.premiumUsers.isPremiumMember, {
    userId: user?.id ?? "randomuserid",
  });
  const chatBotData = useQuery(api.chatBot.getChatbotData, {
    userId: user?.id || "",
    resumeId: resumeId,
  });

  const { setResume, getResume } = useChatBotStore();
  const resume = getResume(resumeId);
  const updateResume = useMutation(api.resume.updateResume);
  const prevResumeRef = useRef<string | null>(null);

  // Sync DB -> Store on first load
  useEffect(() => {
    if (resumeQuery && !resume) {
      setResume(resumeId, resumeQuery as any);
    }
  }, [resumeQuery, resume, setResume, resumeId]);

  // Sync Store -> DB whenever store resume changes
  useEffect(() => {
    if (resume && resume._id) {
      const resumeString = JSON.stringify(resume);
      if (resumeString !== prevResumeRef.current) {
        updateResume({ id: resume._id, data: resume });
        prevResumeRef.current = resumeString;
      }
    }
  }, [resume, updateResume]);

  // Show onboarding modal if missing role/yoe
  useEffect(() => {
    if (chatBotData && user && resumeId) {
      const needsUserInfo =
        !chatBotData.desiredRole ||
        chatBotData.desiredRole === "" ||
        !chatBotData.experienceLevel ||
        chatBotData.experienceLevel === "";

      if (needsUserInfo) {
        setShowOnboardingModal(true);
      }
    }
  }, [chatBotData, user, resumeId]);

  if (resumeQuery === undefined) return null;
  if (resumeQuery === null) return <div>Template not found</div>;
  if (isLoaded && resumeQuery?.userId !== user?.id) {
    toast.error("Not authenticated");
    router.push("/");
    return null;
  }

  const sectionArray: Section[] = resumeQuery.sections
    .slice()
    .sort((a, b) => (a.orderNumber ?? 9999) - (b.orderNumber ?? 9999))
    .map((item) => item.type);
  sectionArray.push("custom");
  sectionArray.push("final");

  const validateSection = (section: string): section is Section => {
    return POSSIBLE_SECTIONS.includes(section as Section);
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

  const { prevUrl, nextUrl } = sec
    ? handleSearchParamNavigation(sectionArray, sec)
    : handlePathNavigation(sectionArray, pathname);


  return (
    <>
      <div className="flex shrink-0 z-100000! bg-primary w-full md:hidden">
        <VerticalTimeline />
      </div>
      <div className="relative pt-6 w-full px-4 flex md:hidden items-center justify-between">
        <Button
          onClick={() => router.push("/build-resume/templates")}
          variant="outline"
        >
          Home
        </Button>
        <MobilePreviewButton item={resumeQuery as ResumeTemplate} />
      </div>
      <div className="flex h-screen w-full">
        <div className="flex flex-1 h-screen overflow-hidden">
          <div className="bg-primary md:block w-20 flex items-center justify-center shrink-0 border-r border-gray-200">
            <VerticalTimeline />
          </div>
          <div className="bg-white hidden md:block shrink-0 border-l border-gray-200">
            <Chatbot isOnboardingModalOpen={showOnboardingModal} />
          </div>
          <div
            className={cn(
              "grow overflow-y-auto overflow-x-hidden no-scrollbar mx-auto transition-all duration-300 ease-in-out",
              geologicaFont.className,
              // Adjust width based on preview state
              isPreviewCollapsed ? "max-w-[85%]" : "max-w-[80%]"
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

        {/* Collapsible Preview Section */}
        <div
          className={cn(
            "hidden md:flex relative transition-all duration-300 ease-in-out",
            isPreviewCollapsed ? "w-12" : "w-[30vw]"
          )}
        >
          {/* Toggle Button */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setIsPreviewCollapsed(!isPreviewCollapsed)}
            className="absolute top-4 z-10 bg-white p-3 rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
          >
            {isPreviewCollapsed ? (
              <ArrowLeftToLine className="text-primary" />
            ) : (
              <ArrowRightToLine className="text-primary" />
            )}
          </motion.div>

          {/* Preview Content */}
          <div
            className={cn(
              "w-full transition-all duration-300 ease-in-out",
              isPreviewCollapsed
                ? "opacity-0 pointer-events-none"
                : "opacity-100"
            )}
          >
            <LiveResumePreview isCollapsed={isPreviewCollapsed} />
          </div>

          {/* Collapsed State Indicator */}
          {isPreviewCollapsed && (
            <div className="flex items-center justify-center w-full h-full bg-gray-50 border-l border-gray-200">
              <div className="transform -rotate-90 text-sm text-gray-500 whitespace-nowrap">
                Resume Preview
              </div>
            </div>
          )}
        </div>
      </div>

      <PreviewModal />
      <ChatBotAssistModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
      />
    </>
  );
};

export default ResumeBuilderLayout;
