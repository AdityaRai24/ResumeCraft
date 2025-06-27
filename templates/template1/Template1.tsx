"use client";
import { cn } from "@/lib/utils";
import { ResumeTemplate } from "@/types/templateTypes";
import {
  Github,
  Globe,
  Link2,
  Linkedin,
  Mail,
  Phone,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  EducationContent,
  ExperienceContent,
  HeaderContent,
  ProjectContent,
  SkillsContent,
} from "./Temp1Types";
import TemplateWrapper from "@/providers/TemplateWrapper";

export interface TemplateType {
  obj: ResumeTemplate;
  size: "sm" | "md" | "lg";
  textSize?: "sm" | "md" | "lg";
  marginSize?: "sm" | "md" | "lg";
}


 const textSizes = {

  sm: {
    name: "text-[33px]", // 30px
    sectionHeader: "text-[16px]", // 16px
    content: "text-[14px]", // 14px
    description: "text-[12px]", // 12px
  },
  md: {
    name: "text-[36px]", // 36px
    sectionHeader: "text-[17px]", // 18px
    content: "text-[15px]", // 16px
    description: "text-[13px]", // 14px
  },
  lg: {
    name: "text-[38px]", // 48px
    sectionHeader: "text-[18px]", // 20px
    content: "text-[16px]", // 18px
    description: "text-[14px]", // 16px
  }
} as const;

 const marginSizes = {
  xs :{
    section: "py-0.5", // 4px between sections
    content: "py-0", // 8px for content blocks
  },
  sm: {
    section: "py-1", // 4px between sections
    content: "py-0", // 8px for content blocks
  },
  md: {
    section: "py-2", // 8px between sections
    content: "py-1", // 12px for content blocks
  },
  lg: {
    section: "py-3", // 16px between sections
    content: "py-2", // 20px for content blocks
  }
} as const;

const Template1 = ({ obj, size, textSize = size, marginSize = size }: TemplateType) => {
  const headerLogoMap: any = {
    github: <Github size={18} className="mt-[2px]" />,
    linkedin: <Linkedin size={18} className="mt-[2px]" />,
    portfolio: <Globe size={18} className="mt-[2px]" />,
    twitter: <Twitter size={18} className="mt-[2px]" />,
    other: <Link2 size={18} className="mt-[2px]" />,
  };

  const primaryTextColor = obj?.globalStyles?.primaryTextColor || "black";
  const primaryColor = obj?.globalStyles?.primaryColor || "black";
  const currentTextSize = textSizes[textSize];
  const currentMarginSize = marginSizes[marginSize];
  const sortedSections = [...obj.sections].sort(
    (a, b) => a.orderNumber - b.orderNumber
  );

  const renderSection = (section : any, index : any) => {
    switch (section.type) {
      case "header":
        const headerContent = section.content as HeaderContent;

        return (
          <div
            key={`header-section-${index}`}
            className={`${section.isVisible ? "block" : "hidden"}`}
          >
            <div>
              <h1
                className={cn("uppercase text-center font-bold", currentTextSize.name)}
                style={{ color: primaryTextColor }}
              >
                {headerContent?.firstName} {headerContent?.lastName}
              </h1>

              <div className={cn("flex items-center flex-wrap justify-center gap-4 mb-2")}>
                {headerContent.phone && (
                  <div className={cn("flex gap-1 items-center", currentTextSize.content)}>
                    <Phone size={18} className="mt-[2px]" />
                    <p>{`${headerContent.phone}`} </p>
                  </div>
                )}
                {headerContent.email && (
                  <div className={cn("flex gap-1 items-center", currentTextSize.content)}>
                    <Mail size={18} className="mt-[2px]" />
                    <p className="underline underline-offset-2">
                      {`${headerContent.email}`}
                    </p>
                  </div>
                )}
                {headerContent.socialLinks.map((item, i) => {
                  return (
                    <div key={i} className={cn("flex items-center justify-center gap-1", currentTextSize.content)}>
                      {headerLogoMap[item.type]}
                      <a
                        href={item.url}
                        className="underline underline-offset-2"
                      >
                        {item.name}
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SUMMARY */}
            <div
              className={cn("", currentMarginSize.section)}
              style={{ borderTop: `1px solid ${primaryColor}` }}
            >
              <h1
                className={cn("font-bold", currentTextSize.sectionHeader)}
                style={{ color: primaryTextColor }}
              >
                SUMMARY
              </h1>
              <div
                className={cn("quill-content font-normal", currentTextSize.description)}
                dangerouslySetInnerHTML={{
                  __html: headerContent?.summary || "",
                }}
              />
            </div>
          </div>
        );
      case "education":
        const educationContent = section.content as EducationContent;

        return (
          <div
            key={`education-section-${index}`}
            className={cn("", currentMarginSize.content, currentMarginSize.section, section.isVisible ? "block" : "hidden")}
            style={{ borderTop: `1px solid ${primaryColor}` }}
          >
            <h1
              className={cn("font-bold", currentTextSize.sectionHeader)}
              style={{ color: primaryTextColor }}
            >
              EDUCATION
            </h1>
            <div className="flex flex-col gap-1">
              {educationContent?.education.map((edu, index2) => {
                return (
                  <div
                    key={index2}
                    className={cn("flex items-center justify-between", currentTextSize.content)}
                  >
                    <div>
                      <h1 className="font-semibold">
                        {edu?.courseName}
                      </h1>
                      <h1>{edu?.instituteName}</h1>
                    </div>
                    <div>
                      {edu?.startYear && edu?.endYear && (
                        <h1 className="font-bold">
                          {`${edu?.startMonth ? `${edu.startMonth} ` : ""}${edu?.startYear ? edu.startYear : ""}${!edu?.studyingHere && (edu?.endMonth || edu?.endYear) ? ` - ${edu.endMonth} ${edu.endYear}` : edu?.studyingHere ? " - Present" : ""}`}
                        </h1>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case "experience":
        const experienceContent = section.content as ExperienceContent;

        return (
          <div
            key={`experience-section-${index}`}
            className={cn("",  currentMarginSize.content,currentMarginSize.section, section.isVisible ? "block" : "hidden")}
            style={{ borderTop: `1px solid ${primaryColor}` }}
          >
            <h1
              className={cn("font-bold", currentTextSize.sectionHeader)}
              style={{ color: primaryTextColor }}
            >
              WORK EXPERIENCE
            </h1>
            {experienceContent.experience?.map((exp, index) => {
              return (
                <div key={index}>
                  <div className={cn("flex items-center justify-between", currentTextSize.content)}>
                    <h1 className="font-semibold">
                      {exp?.role} {exp?.role && exp?.companyName && ","}{" "}
                      {exp?.companyName}
                    </h1>
                    <div className="flex items-center">
                      {exp?.startMonth &&
                        exp?.startYear &&
                        exp?.endMonth &&
                        exp?.endYear && (
                          <h1>
                            {exp?.startMonth}, {exp?.startYear} -{" "}
                            {exp?.endMonth}, {exp?.endYear}
                          </h1>
                        )}
                    </div>
                  </div>
                  <div
                    className={cn("quill-content", currentTextSize.description)}
                    dangerouslySetInnerHTML={{
                      __html: exp?.jobDescription,
                    }}
                  />
                </div>
              );
            })}
          </div>
        );
      case "projects":
        const projectContent = section.content as ProjectContent;
        return (
          <div
            key={`project-section-${index}`}
            className={cn("", currentMarginSize.section, section.isVisible ? "block" : "hidden")}
            style={{ borderTop: `1px solid ${primaryColor}` }}
          >
            <h1
              className={cn("font-bold", currentTextSize.sectionHeader)}
              style={{ color: primaryTextColor }}
            >
              PROJECTS
            </h1>

            <div className="flex flex-col">
              {projectContent?.projects?.map((project, index) => {
                return (
                  <div key={index}>
                    <div className={cn("flex items-centerjustify-start", currentMarginSize.content, currentTextSize.content)}>
                      <h1
                        className="font-semibold underline underline-offset-2 mb-[1px]"
                      >
                        {project?.name}
                      </h1>
                      {project?.githuburl && (
                        <Link href={project?.githuburl}>
                          <Github
                            size={16}
                            className="cursor-pointer"
                            style={{ color: primaryTextColor }}
                          />
                        </Link>
                      )}

                      {project?.liveurl && (
                        <Link href={project?.liveurl}>
                          <Globe
                            size={16}
                            className="cursor-pointer"
                            style={{ color: primaryTextColor }}
                          />
                        </Link>
                      )}
                    </div>
                    <div
                      className={cn("quill-content", currentTextSize.description)}
                      dangerouslySetInnerHTML={{
                        __html: project?.description,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      case "skills":
        const skillsContent = section as SkillsContent;

        return (
          <div
            key={`skills-section-${index}`}
            className={cn("", currentMarginSize.content, currentMarginSize.section, section.isVisible ? "block" : "hidden")}
            style={{ borderTop: `1px solid ${primaryColor}` }}
          >
            <h1
              className={cn("font-bold", currentTextSize.sectionHeader)}
              style={{ color: primaryTextColor }}
            >
              SKILLS
            </h1>
            <div>
              <div
                className={cn("quill-content", currentTextSize.description)}
                dangerouslySetInnerHTML={{
                  __html: skillsContent.content.description,
                }}
              />
            </div>
          </div>
        );
      case "custom":
        return (
          <div
            key={`custom-section-${index}-${section.content.sectionTitle}`}
            className={cn("", currentMarginSize.content, currentMarginSize.section, section.isVisible ? "block" : "hidden")}
            style={{ borderTop: `1px solid ${primaryColor}` }}
          >
            <h1
              className={cn("font-bold", currentTextSize.sectionHeader)}
              style={{ color: primaryTextColor }}
            >
              {section.content.sectionTitle.toUpperCase()}
            </h1>
            <div
              className={cn("quill-content", currentTextSize.description)}
              dangerouslySetInnerHTML={{
                __html: section.content.sectionDescription,
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const content = (
    <div
      id="resumeSection"
      className={cn(
        "bg-[white] text-black py-8 overflow-hidden overflow-x-hidden w-[211mm] h-[297mm] px-8 select-none cursor-pointer rounded-3xl print:rounded-none transition duration-300 ease-in shadow-2xl print:border-0 border border-primary"
      )}
    >
      <div>
        {sortedSections.map((section, index) => renderSection(section, index))}
      </div>
    </div>
  );

  return <TemplateWrapper size={size!}>{content}</TemplateWrapper>;
};

export default Template1;