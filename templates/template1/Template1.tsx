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
  size?: "sm" | "md" | "lg";
}

const Template1 = ({ obj, size }: TemplateType) => {
  const headerLogoMap: any = {
    github: <Github size={18} className="mt-[2px]" />,
    linkedin: <Linkedin size={18} className="mt-[2px]" />,
    portfolio: <Globe size={18} className="mt-[2px]" />,
    twitter: <Twitter size={18} className="mt-[2px]" />,
    other: <Link2 size={18} className="mt-[2px]" />,
  };

  const visitedCustoms: number[] = [];
  const primaryTextColor = obj?.globalStyles?.primaryTextColor || "black";
  const primaryColor = obj?.globalStyles?.primaryColor || "black";
  const sortedSections = [...obj.sections].sort(
    (a, b) => a.orderNumber - b.orderNumber
  );

  const uniqueSectionTypes = Array.from(
    new Set(sortedSections.map((item) => item.type))
  );

  const renderSection = (type: string) => {
    return sortedSections?.map((item, index) => {
      if (item.type === type) {
        switch (type) {
          case "header":
            const headerContent = item.content as HeaderContent;

            return (
              <div
                key={`header-section-${index}`}
                className={` ${item.isVisible ? "block" : "hidden"}`}
              >
                <div>
                  <h1
                    className={`text-4xl uppercase text-center font-bold  `}
                    style={{ color: primaryTextColor }}
                  >
                    {headerContent?.firstName} {headerContent?.lastName}
                  </h1>

                  <div className="flex items-center flex-wrap justify-center gap-4 my-2">
                    {headerContent.phone && (
                      <div className="flex gap-1 items-center">
                        <Phone size={18} className="mt-[2px]" />
                        <p>{`${headerContent.phone}`} </p>
                      </div>
                    )}
                    {headerContent.email && (
                      <div className="flex gap-1 items-center">
                        <Mail size={18} className="mt-[2px]" />
                        <p className="underline underline-offset-2">
                          {`${headerContent.email}`}
                        </p>
                      </div>
                    )}
                    {headerContent.socialLinks.map((item) => {
                      return (
                        <div className="flex items-center justify-center gap-1">
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
                  className={`py-2`}
                  style={{ borderTop: `1px solid ${primaryColor}` }}
                >
                  <h1
                    className={`text-lg font-bold`}
                    style={{ color: primaryTextColor }}
                  >
                    SUMMARY
                  </h1>
                  <div
                    className="quill-content text-sm font-normal"
                    dangerouslySetInnerHTML={{
                      __html: headerContent?.summary || "",
                    }}
                  />
                </div>
              </div>
            );

          case "education":
            const educationContent = item.content as EducationContent;

            return (
              <div
                className={`py-2 ${item.isVisible ? "block" : "hidden"}`}
                style={{ borderTop: `1px solid ${primaryColor}` }}
              >
                {" "}
                <h1
                  className={`text-lg font-bold `}
                  style={{ color: primaryTextColor }}
                >
                  EDUCATION
                </h1>
                <div key={index} className="flex flex-col gap-1">
                  {educationContent?.education.map((edu, index2) => {
                    return (
                      <div
                        key={index2}
                        className="flex items-center text-sm justify-between"
                      >
                        <div>
                          <h1 className="font-semibold text-sm">
                            {edu?.courseName}
                          </h1>
                          <h1 className="text-sm">{edu?.instituteName}</h1>
                        </div>
                        <div>
                          {edu?.startYear && edu?.endYear && (
                            <h1 className="font-bold text-sm">
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
            const experienceContent = item.content as ExperienceContent;

            return (
              <div
                className={`border-t py-2 ${item.isVisible ? "block" : "hidden"}`}
                style={{ borderTop: `1px solid ${primaryColor}` }}
              >
                <h1
                  className={`text-lg font-bold `}
                  style={{ color: primaryTextColor }}
                >
                  WORK EXPERIENCE
                </h1>
                {experienceContent.experience?.map((exp, index) => {
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between gap-2">
                        <h1 className="font-semibold text-base">
                          {exp?.role} {exp?.role && exp?.companyName && ","}{" "}
                          {exp?.companyName}
                        </h1>
                        <div className="flex items-center text-sm gap-2">
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
                        className="quill-content text-sm"
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
            const projectContent = item.content as ProjectContent;
            return (
              <>
                <div
                  className={`border-t py-2 ${item.isVisible ? "block" : "hidden"}`}
                  style={{ borderTop: `1px solid ${primaryColor}` }}
                  key={index}
                >
                  <h1
                    className={`text-lg font-bold `}
                    style={{ color: primaryTextColor }}
                  >
                    PROJECTS
                  </h1>

                  <div className="flex flex-col">
                    {projectContent?.projects?.map((project, index) => {
                      return (
                        <div key={index}>
                          <div className="flex items-center gap-2 justify-start">
                            <h1
                              className={`font-semibold text-sm underline underline-offset-2 mb-[1px]`}
                            >
                              {project?.name}
                            </h1>
                            {project?.githuburl && (
                              <Link href={project?.githuburl}>
                                <Github
                                  size={16}
                                  className={`cursor-pointer`}
                                  style={{ color: primaryTextColor }}
                                />
                              </Link>
                            )}

                            {project?.liveurl && (
                              <Link href={project?.liveurl}>
                                <Globe
                                  size={16}
                                  className={`cursor-pointer`}
                                  style={{ color: primaryTextColor }}
                                />
                              </Link>
                            )}
                          </div>
                          <div
                            className="quill-content text-sm"
                            dangerouslySetInnerHTML={{
                              __html: project?.description,
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            );

          case "skills":
            const skillsContent = item as SkillsContent;

            return (
              <div
                className={`py-2 border-t ${item.isVisible ? "block" : "hidden"}`}
                style={{ borderTop: `1px solid ${primaryColor}` }}
                key={index}
              >
                {" "}
                <h1
                  className={`text-lg font-bold `}
                  style={{
                    color: primaryTextColor,
                  }}
                >
                  SKILLS
                </h1>
                <div>
                  <div
                    className="quill-content text-sm"
                    dangerouslySetInnerHTML={{
                      __html: skillsContent.content.description,
                    }}
                  />{" "}
                </div>
              </div>
            );

          case "custom":
            return sortedSections.map((item, index) => {
              if (item.type === "custom") {
                if (visitedCustoms.includes(item.orderNumber)) return;
                visitedCustoms.push(item.orderNumber);

                return (
                  <div
                    key={`custom-${index}-${item.content.sectionTitle}`}
                    className={`py-2 ${item.isVisible ? "block" : "hidden"}`}
                    style={{ borderTop: `1px solid ${primaryColor}` }}
                  >
                    <h1
                      className={`text-lg font-bold`}
                      style={{ color: primaryTextColor }}
                    >
                      {item.content.sectionTitle}
                    </h1>
                    <div
                      className="quill-content text-sm"
                      dangerouslySetInnerHTML={{
                        __html: item.content.sectionDescription,
                      }}
                    />
                  </div>
                );
              }
              return null;
            });
        }
      }
    });
  };

  const content = (
    <div
      id="resumeSection"
      className={cn(
        "bg-[white] text-black py-8 overflow-hidden overflow-x-hidden  w-[211mm] h-[297mm] px-8 select-none cursor-pointer rounded-3xl print:rounded-none transition duration-300 ease-in  shadow-2xl print:border-0 border border-primary"
      )}
    >
      <div className="">
        {uniqueSectionTypes?.map((section, index) => {
          return (
            <React.Fragment key={index}>
              {renderSection(section)}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );

  return <TemplateWrapper size={size!}>{content}</TemplateWrapper>;
};

export default Template1;
