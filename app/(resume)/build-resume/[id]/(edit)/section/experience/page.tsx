"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React, { useRef } from "react";
import SectionInfo from "@/components/SectionInfo";
import HeaderSkeleton from "@/components/HeaderSkeleton";
import ExperienceForm from "@/components/forms/ExperienceForm";
import { useChatBotStore } from "@/store";

const Page = () => {
  const params = useParams();
  const resumeId = params.id as Id<"resumes">;
  const resume = useQuery(api.resume.getTemplateDetails, { id: resumeId });
  const firstTimeRef = useRef(false);
  const { pushText } = useChatBotStore((state) => state);

  if (resume === null) {
    return <div>Template not found</div>;
  }

  if (resume === undefined) {
    return <HeaderSkeleton />;
  }

  const experienceText = [
    "💼 Time to flex your experience! Let’s make your work history shine like a polished LinkedIn profile.",

    "🧠 The Experience section is where the magic happens. Let’s show them what you’ve *actually* done!",

    "🚀 Buckle up! This is where your resume gets powerful. Good experiences = great impressions.",

    "📈 Let’s turn your past jobs into career gold. The Experience section is a big deal — and I’ve got your back!",

    "💪 Your resume’s core strength lies here. Ready to show off your experience like a boss?",

    "🛠️ This is where skills meet stories. Let’s craft a work history that says ‘hire me now!’",

    "📂 Experience makes the difference. Let’s transform those roles into results.",

    "💥 Time to tell the world what you’ve built, fixed, shipped, or slayed at work.",

    "🎤 Spotlight’s on your experience — and we’re here to make it unforgettable.",

    "👔 Whether it's internships or 10 years in the game — every role counts. Let’s show them why!",
  ];

  setTimeout(() => {
    if (!firstTimeRef.current) {
      pushText(
        experienceText[Math.floor(Math.random() * experienceText.length)],
        "bot"
      );
      firstTimeRef.current = true;
    }
  }, 2000);

  return (
    <>
      {resume.sections?.map((item, idx) => {
        if (item?.type === "experience") {
          return (
            <div key={idx} className="my-10 md:my-24 mx-4 md:mx-16">
              <SectionInfo
                heading={"Let's work on your experience."}
                text={"Start with your most recent job first."}
              />

              <ExperienceForm resumeId={resumeId} item={item} />
            </div>
          );
        }
        return null;
      })}
    </>
  );
};

export default Page;
