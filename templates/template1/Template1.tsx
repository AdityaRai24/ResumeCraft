"use client";
import { cn } from "@/lib/utils";
import { ResumeTemplate } from "@/types/templateTypes";
import { Github, Globe, Linkedin, Mail, PhoneCall } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  EducationContent,
  ExperienceContent,
  HeaderContent,
  ProjectContent,
  SkillsContent,
} from "./Temp1Types";
import { CustomContent } from "../template1/Temp1Types";

export interface TemplateType {
  isPreview?: boolean;
  obj: ResumeTemplate;
  isLive?: boolean;
}

const Template1 = ({ isPreview, obj, isLive }: TemplateType) => {
  const sectionArray = obj?.sections?.map((item) => item.type);

  const PreviewWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className=" overflow-hidden">
      <div
        className={cn(
          "transform origin-top-left scale-[1] ",
          isLive &&
            "flex items-center justify-center w-[1122px] h-full scale-[0.5]",
          isPreview && !isLive && "scale-[0.4]"
        )}
      >
        {children}
      </div>
    </div>
  );

  const FullSizeWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center ">{children}</div>
  );

  const Wrapper = isPreview ? PreviewWrapper : FullSizeWrapper;
  const primaryTextColorClass = obj?.globalStyles?.primaryTextColor || "black";
  const primaryColorClass = obj?.globalStyles?.primaryColor || "black";
  const sortedSections = [...obj.sections].sort(
    (a, b) => a.orderNumber - b.orderNumber
  );

  const visitedCustoms: number[] = [];

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
              <div key={`header-section-${index}`}>
                <div
                  className={`border-b`}
                  style={{ borderBottom: `1px solid ${primaryColorClass}` }}
                >
                  <h1
                    className={`text-4xl uppercase text-center font-bold`}
                    style={{ color: primaryTextColorClass }}
                  >
                    {headerContent?.firstName} {headerContent?.lastName}
                  </h1>
                  <div className="flex items-center justify-center gap-4 flex-wrap pt-1 pb-2">
                    {[
                      {
                        type: "email",
                        icon: Mail,
                        content: headerContent?.email,
                      },
                      {
                        type: "phone",
                        icon: PhoneCall,
                        content: headerContent?.phone,
                      },
                      {
                        type: "github",
                        icon: Github,
                        content: headerContent?.github,
                      },
                      {
                        type: "linkedin",
                        icon: Linkedin,
                        content: headerContent?.linkedin,
                      },
                    ].map(
                      (it, index) =>
                        it.content && (
                          <h1
                            key={`contact-${it.type}-${index}`}
                            className="flex items-center justify-center gap-1"
                          >
                            <it.icon size={16} />
                            <span className="text-sm">{it.content}</span>
                          </h1>
                        )
                    )}
                  </div>
                </div>

                {/* SUMMARY */}
                <div
                  className={`py-2`}
                  style={{ borderBottom: `1px solid ${primaryColorClass}` }}
                >
                  <h1
                    className={`text-lg font-bold`}
                    style={{ color: primaryTextColorClass }}
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
                className={`py-2 `}
                style={{ borderBottom: `1px solid ${primaryColorClass}` }}
              >
                {" "}
                <h1
                  className={`text-lg font-bold `}
                  style={{ color: primaryTextColorClass }}
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
                              {edu?.startMonth} {edu?.startYear} -{" "}
                              {edu?.endMonth} {edu?.endYear}
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
                className={`border-b py-2`}
                style={{ borderBottom: `1px solid ${primaryColorClass}` }}
              >
                <h1
                  className={`text-lg font-bold `}
                  style={{ color: primaryTextColorClass }}
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
                  className={`border-b py-2`}
                  style={{ borderBottom: `1px solid ${primaryColorClass}` }}
                  key={index}
                >
                  <h1
                    className={`text-lg font-bold `}
                    style={{ color: primaryTextColorClass }}
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
                                  style={{ color: primaryTextColorClass }}
                                />
                              </Link>
                            )}

                            {project?.liveurl && (
                              <Link href={project?.liveurl}>
                                <Globe
                                  size={16}
                                  className={`cursor-pointer`}
                                  style={{ color: primaryTextColorClass }}
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
                className={`py-2 `}
                style={{ borderBottom: `1px solid ${primaryColorClass}` }}
                key={index}
              >
                {" "}
                <h1
                  className={`text-lg font-bold `}
                  style={{
                    color: primaryTextColorClass,
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
                    className={`py-2`}
                    style={{ borderBottom: `1px solid ${primaryColorClass}` }}
                  >
                    <h1
                      className={`text-lg font-bold`}
                      style={{ color: primaryTextColorClass }}
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
        "bg-[white] text-black py-8 overflow-hidden overflow-x-hidden w-[210mm] h-[297mm] px-8 ",
        isPreview &&
          "select-none cursor-pointer rounded-3xl transition duration-300 ease-in p-10 shadow-2xl border border-primary",
        isLive && "w-[210mm] h-[297mm]",
        isPreview && !isLive && "w-[795px] h-[1122px]"
      )}
    >
      <div>
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

  return <Wrapper>{content}</Wrapper>;
};

export default Template1;