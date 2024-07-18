"use client";
import { cn } from "@/lib/utils";
import { ResumeTemplate } from "@/types/templateTypes";
import { Github, Globe, Linkedin, Mail, PhoneCall } from "lucide-react";
import {
  geologicaFont,
  interFont,
  montserratFont,
  openSansFont,
  poppinsFont,
  ralewayFont,
} from "@/lib/font";
import Link from "next/link";
import React from "react";

interface TemplateType {
  isPreview?: boolean;
  obj: ResumeTemplate;
  isLive?: boolean;
}

type HeaderContent = {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
};

type EducationContent = {
  education: {
    courseName: string;
    instituteName: string;
    startMonth?: string;
    startYear: string;
    endMonth?: string;
    endYear: string;
    location?: string;
  }[];
};

type ExperienceContent = {
  experience: {
    companyName: string;
    role: string;
    jobDescription: string;
    location?: string;
    startMonth?: string;
    startYear: string;
    endMonth?: string;
    endYear: string;
  }[];
};

type SkillsContent = {
  content: {
    skills: string[] | string;
  };
};

type ProjectContent = {
  projects: {
    name: string;
    description: string;
    githuburl?: string;
    liveurl?: string;
  }[];
};

const Template1 = ({ isPreview, obj, isLive }: TemplateType) => {

  const sectionArray = obj?.sections?.map((item) => item.type);


  const PreviewWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className=" overflow-hidden">
      <div
        className={cn(
          "transform origin-top-left scale-[1] ",
          isLive &&
            "flex items-center justify-center w-[1122px] h-full  scale-[0.5]",
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

  const renderSection = (type: string) => {
    return obj?.sections?.map((item, index) => {
      if (item.type === type) {
        switch (type) { 
          case "header":
            const headerContent = item.content as HeaderContent;

            return (
              <div key={`header-section-${index}`}>
                <div
                  className={`py-0 border-b`}
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
                  className={`py-2 border-b`}
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
                className={`py-2 border-b `}
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

          case "experience" :
            const experienceContent = item.content as ExperienceContent;

            return(
              <div
              className={`border-b pt-2`}
              style={{ borderBottom: `1px solid ${primaryColorClass}` }}
            >
              <h1
                className={`text-lg font-bold `}
                style={{ color: primaryTextColorClass }}
              >
                WORK EXPERIENCE
              </h1>
                 {   experienceContent.experience?.map((exp, index) => {
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
                      {/* <h1 className="text-sm">{exp?.location}</h1> */}
                    </div>
                    <div
                      className="quill-content text-sm"
                      dangerouslySetInnerHTML={{ __html: exp?.jobDescription }}
                    />
                  </div>
                );
              })}
            </div>
          )

          case "projects":

            const projectContent = item.content as ProjectContent;
            return (
              <>
                <div
                  className={`border-b pt-2`}
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

          case "skills" :

            const skillContent = item.content as SkillsContent;
            const columns = obj.sections.filter(
              (item) => item.type === "skills"
            )[0].style?.columns;

            return (
              <div
                className={`py-2 border-b `}
                style={{ borderBottom: `1px solid ${primaryColorClass}` }}
                key={index}
              >
                {" "}
                <h1
                  className={`text-lg font-bold `}
                  style={{ color: primaryTextColorClass }}
                >
                  SKILLS
                </h1>
                {Array.isArray(skillContent.content.skills) ? (
                  <div
                  className={`mt-2 grid grid-cols-${columns}`}
                >
                  {skillContent?.content?.skills?.map((skill, index) => {
                    return (
                      <li key={index} className="text-sm">
                        {skill}
                      </li>
                    );
                  })}
                </div>
                ) : ""}
              </div>
            );

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
       
        isPreview && !isLive && "w-[795px] h-[1122px]",
      )}
    >
      <div>
      {sectionArray?.map((section) => {
          return (
            <React.Fragment key={section}>
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
