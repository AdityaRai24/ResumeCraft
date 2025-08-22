"use client";
import { cn } from "@/lib/utils";
import { ResumeTemplate } from "@/types/templateTypes";
import {
  Github,
  Globe,
  Link2,
  Linkedin,
  Mail,
  PhoneCall,
  Twitter,
} from "lucide-react";
import React from "react";
import TemplateWrapper from "@/providers/TemplateWrapper";
import Link from "next/link";

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
  },
} as const;

const marginSizes = {
  xs: {
    section: "mt-0.5", // 4px between sections
    content: "mt-1", // 8px for content blocks
    headerContent: "mt-0.5", // 4px for header content
  },
  sm: {
    section: "mt-1", // 4px between sections
    content: "mt-2", // 8px for content blocks
    headerContent: "mt-1", // 4px for header content
  },
  md: {
    section: "mt-2", // 8px between sections
    content: "mt-3", // 12px for content blocks
    headerContent: "mt-2", // 8px for header content
  },
  lg: {
    section: "mt-3", // 16px between sections
    content: "mt-4", // 20px for content blocks
    headerContent: "mt-3", // 12px for header content
  },
} as const;

const Template4 = ({ obj, size, textSize = size, marginSize = size }: TemplateType) => {
  const headerLogoMap: any = {
    github: <Github size={20} className="mt-[2px]" />,
    linkedin: <Linkedin size={20} className="mt-[2px]" />,
    portfolio: <Globe size={20} className="mt-[2px]" />,
    twitter: <Twitter size={20} className="mt-[2px]" />,
    other: <Link2 size={20} className="mt-[2px]" />,
  };

  const primaryTextColor = obj?.globalStyles?.primaryTextColor || "black";
  const primaryColor = obj?.globalStyles?.primaryColor || "black";
  const currentTextSize = textSizes[textSize];
  const currentMarginSize = marginSizes[marginSize];

  const visitedCustoms: string[] = [];

  const headerObj = obj?.sections?.filter((item) => item.type === "header");
  const tempLeftObj = obj?.sections?.filter((item: any) =>
    item.type === "custom"
      ? item?.content?.sectionDirection === "left"
      : item?.style?.sectionDirection === "left"
  );

  const leftObj = [...headerObj, ...tempLeftObj];

  const tempRightObj = obj.sections.filter((item: any) =>
    item.type === "custom"
      ? item.content.sectionDirection === "right"
      : item?.style?.sectionDirection === "right"
  );
  const rightObj = [...headerObj, ...tempRightObj];

  const headerContent = obj.sections.filter(
    (item) => item.type === "header"
  )[0];
  const leftHeaderContent = obj.sections.filter(
    (item) => item.type === "header"
  )[0];

  const content = (
    <div
      id="resumeSection"
      className={cn(
        " text-[#606060] overflow-hidden overflow-x-hidden  w-[211mm] h-[297mm] bg-white select-none cursor-pointer rounded-3xl print:rounded-none transition duration-300 ease-in  shadow-2xl print:border-0 border border-primary"
      )}
    >
      <div className="max-w-[90%] mx-auto">
        <div className={cn("flex flex-col gap-2 mt-12 mb-8", currentMarginSize.section)}>
          <h1 className={cn("text-center uppercase font-semibold", currentTextSize.name)}>
            {headerContent?.content?.firstName}{" "}
            {headerContent?.content?.lastName}
          </h1>
          <p className={cn("text-center uppercase font-medium", currentTextSize.content)}>
            {headerContent?.content?.role}
          </p>
        </div>
        <div className="w-full h-[2px] " style={{ background: primaryColor }} />
      </div>
      <div className="grid  grid-cols-5 h-full">
        {/* Left Column */}
        <div className="col-span-2 bg-[#f8f8f8]  py-5 px-[12.5%]">
          <div className="flex flex-col">
            {leftObj?.map((item, index) => {
              switch (item.type) {
                case "header":
                  return (
                    <div key={index} className={cn("flex flex-col max-w-full break-words", currentMarginSize.section)}>
                      <div className="flex flex-col">
                        <LeftSectionHeader
                          primaryTextColor={primaryTextColor}
                          title="CONTACT"
                          textSize={currentTextSize}
                        />
                        <div className="flex flex-col gap-3">
                          {leftHeaderContent?.content?.phone && (
                            <div className={cn("flex items-center gap-2", currentTextSize.content)}>
                              <PhoneCall size={16} className="shrink-0" />
                              <p>{leftHeaderContent?.content?.phone}</p>
                            </div>
                          )}
                          {leftHeaderContent?.content?.email && (
                            <div className={cn("flex items-center gap-2", currentTextSize.content)}>
                              <Mail size={16} className="shrink-0" />
                              <p className="break-all">
                                {leftHeaderContent?.content?.email}
                              </p>
                            </div>
                          )}
                          {leftHeaderContent?.content?.socialLinks.map(
                            (item, index) => {
                              return (
                                <div className={cn("flex items-center gap-2", currentTextSize.content)}>
                                  {headerLogoMap[item.type]}
                                  <Link href={item.url} className="break-all">
                                    {item.name}
                                  </Link>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                      <LeftHR primaryColor={primaryColor} />
                    </div>
                  );
                case "skills":
                  return (
                    <div
                      key={index}
                      className={cn(`${item.isVisible ? "block" : "hidden"} max-w-full break-words flex flex-col`, currentMarginSize.section)}
                    >
                      <LeftSectionHeader
                        primaryTextColor={primaryTextColor}
                        title="SKILLS"
                        textSize={currentTextSize}
                      />
                      <div className="flex flex-col gap-3">
                        <div
                          className={cn("quill-content tracking-wider", currentTextSize.description)}
                          dangerouslySetInnerHTML={{
                            __html: item?.content.description ?? "",
                          }}
                        />
                      </div>
                      <LeftHR primaryColor={primaryColor} />
                    </div>
                  );
                case "education":
                  return (
                    <div
                      key={index}
                      className={cn(`${item.isVisible ? "block" : "hidden"} max-w-full break-words`, currentMarginSize.section)}
                    >
                      <LeftSectionHeader
                        primaryTextColor={primaryTextColor}
                        title="EDUCATION"
                        textSize={currentTextSize}
                      />
                      <div className="flex flex-col gap-3">
                        {item?.content?.education.map((edu, idx) => (
                          <div key={idx} className="flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                              <h3 className={cn("font-medium", currentTextSize.content)}>
                                {edu.courseName}
                              </h3>
                            </div>
                            <p className={cn("text-gray-600", currentTextSize.description)}>
                              {edu.instituteName}
                              {edu.location && `, ${edu.location}`}
                            </p>
                            <span className={cn("text-gray-600", currentTextSize.description)}>
                              {edu?.startMonth} {edu?.startYear} -{" "}
                              {edu?.endMonth} {edu?.endYear}
                            </span>
                            {edu.grade && (
                              <p className={cn("text-gray-600", currentTextSize.description)}>
                                Grade: {edu.grade}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                      <LeftHR primaryColor={primaryColor} />
                    </div>
                  );
                case "custom":
                  if (
                    visitedCustoms.includes(
                      `${item.orderNumber}-${item.content.sectionTitle}`
                    )
                  )
                    return null;
                  visitedCustoms.push(
                    `${item.orderNumber}-${item.content.sectionTitle}`
                  );
                  return (
                    <div
                      key={index}
                      className={cn(`${item.isVisible ? "block" : "hidden"} max-w-full break-words flex flex-col`, currentMarginSize.section)}
                    >
                      <LeftSectionHeader
                        primaryTextColor={primaryTextColor}
                        title={item.content.sectionTitle}
                        textSize={currentTextSize}
                      />
                      <div
                        className={cn("quill-content tracking-wider", currentTextSize.description)}
                        dangerouslySetInnerHTML={{
                          __html: item.content.sectionDescription,
                        }}
                      />
                      <LeftHR primaryColor={primaryColor} />
                    </div>
                  );

                default:
                  return null;
              }
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-3 bg-white text-[#606060] px-[8%] py-4">
          {rightObj.map((item, index) => {
            switch (item.type) {
              case "header":
                return (
                  <div key={index} className={cn("max-w-full break-words", currentMarginSize.section)}>
                    <RightSectionHeader
                      primaryTextColor={primaryTextColor}
                      title="PROFILE"
                      textSize={currentTextSize}
                    />
                    {headerContent?.content?.summary && (
                      <p
                        className={cn("quill-content text-gray-600", currentTextSize.description)}
                        dangerouslySetInnerHTML={{
                          __html: headerContent?.content?.summary ?? "",
                        }}
                      />
                    )}
                    <RightHR primaryColor={primaryColor} />
                  </div>
                );
              case "experience":
                return (
                  <div
                    key={index}
                    className={cn(`${item.isVisible ? "block" : "hidden"} max-w-full break-words`, currentMarginSize.section)}
                  >
                    <RightSectionHeader
                      primaryTextColor={primaryTextColor}
                      title="WORK EXPERIENCE"
                      textSize={currentTextSize}
                    />
                    <div className="flex flex-col gap-6">
                      {item?.content?.experience.map((exp, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <div className="flex justify-between items-start">
                            <h3 className={cn("font-medium", currentTextSize.content)}>
                              {exp.role}
                            </h3>
                            <span className={cn("text-gray-600", currentTextSize.description)}>
                              {exp?.startMonth} {exp?.startYear} -{" "}
                              {exp?.endMonth} {exp?.endYear}
                            </span>
                          </div>
                          <p className={cn("text-gray-600 mb-2", currentTextSize.description)}>
                            {exp.companyName}
                          </p>
                          <div
                            className={cn("quill-content text-gray-600", currentTextSize.description)}
                            dangerouslySetInnerHTML={{
                              __html: exp?.jobDescription,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <RightHR primaryColor={primaryColor} />
                  </div>
                );
              case "projects":
                return (
                  <div
                    key={index}
                    className={cn(`${item.isVisible ? "block" : "hidden"} max-w-full break-words`, currentMarginSize.section)}
                  >
                    <RightSectionHeader
                      primaryTextColor={primaryTextColor}
                      title="PROJECTS"
                      textSize={currentTextSize}
                    />
                    <div className="flex flex-col gap-6">
                      {item?.content?.projects.map((project, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <div className="flex items-center justify-start gap-2">
                            <h1 className={cn("max-w-[80%] font-semibold", currentTextSize.content)}>
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
                            className={cn("quill-content text-gray-600", currentTextSize.description)}
                            dangerouslySetInnerHTML={{
                              __html: project?.description,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <RightHR primaryColor={primaryColor} />
                  </div>
                );
              case "custom":
                if (
                  visitedCustoms.includes(
                    `${item.orderNumber}-${item.content.sectionTitle}`
                  )
                )
                  return null;
                visitedCustoms.push(
                  `${item.orderNumber}-${item.content.sectionTitle}`
                );
                return (
                  <div
                    key={index}
                    className={cn(`${item.isVisible ? "block" : "hidden"} max-w-full break-words`, currentMarginSize.section)}
                  >
                    <RightSectionHeader
                      title={item.content.sectionTitle}
                      primaryTextColor={primaryTextColor}
                      textSize={currentTextSize}
                    />
                    <div
                      className={cn("quill-content tracking-wider", currentTextSize.description)}
                      dangerouslySetInnerHTML={{
                        __html: item.content.sectionDescription,
                      }}
                    />
                    <RightHR primaryColor={primaryColor} />
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );

  return <TemplateWrapper size={size}>{content}</TemplateWrapper>;
};

const LeftHR = ({ primaryColor }: { primaryColor: string }) => {
  return (
    <div
      className="h-[1px] border  my-4"
      style={{ borderColor: primaryColor }}
    ></div>
  );
};

const RightHR = ({ primaryColor }: { primaryColor: string }) => {
  return (
    <div
      className="h-[2px] my-4"
      style={{ backgroundColor: primaryColor }}
    ></div>
  );
};

const LeftSectionHeader = ({
  title,
  primaryTextColor,
  textSize,
}: {
  title: string;
  primaryTextColor: string;
  textSize: (typeof textSizes)[keyof typeof textSizes];
}) => {
  return (
    <h2
      className={cn("font-bold mb-2 tracking-[2px] uppercase", textSize.sectionHeader)}
      style={{ color: primaryTextColor }}
    >
      {title}
    </h2>
  );
};

const RightSectionHeader = ({
  title,
  primaryTextColor,
  textSize,
}: {
  title: string;
  primaryTextColor: string;
  textSize: (typeof textSizes)[keyof typeof textSizes];
}) => {
  return (
    <div>
      <h1
        className={cn("tracking-[2px] font-bold uppercase", textSize.sectionHeader)}
        style={{ color: primaryTextColor }}
      >
        {title}
      </h1>
    </div>
  );
};

export default Template4;
