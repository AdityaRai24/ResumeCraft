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
import Image from "next/image";

export interface TemplateType {
  obj: ResumeTemplate;
  size: "sm" | "md" | "lg";
}

const Template4 = ({ obj, size }: TemplateType) => {
  const headerLogoMap: any = {
    github: <Github size={20} className="mt-[2px]" />,
    linkedin: <Linkedin size={20} className="mt-[2px]" />,
    portfolio: <Globe size={20} className="mt-[2px]" />,
    twitter: <Twitter size={20} className="mt-[2px]" />,
    other: <Link2 size={20} className="mt-[2px]" />,
  };

  const primaryTextColor = obj?.globalStyles?.primaryTextColor || "black";
  const primaryColor = obj?.globalStyles?.primaryColor || "black";

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
        <div className="flex flex-col gap-2 mt-12 mb-8">
          <h1 className="text-5xl text-center uppercase font-semibold">
            {headerContent?.content?.firstName}{" "}
            {headerContent?.content?.lastName}
          </h1>
          <p className="text-2xl text-center uppercase font-medium">
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
                    <div key={index} className="flex flex-col max-w-full break-words">
                      <div className="flex flex-col">
                        <LeftSectionHeader
                          primaryTextColor={primaryTextColor}
                          title="CONTACT"
                        />
                        <div className="flex flex-col gap-3">
                          {leftHeaderContent?.content?.phone && (
                            <div className="flex items-center text-sm gap-2">
                              <PhoneCall size={16} className="shrink-0" />
                              <p>{leftHeaderContent?.content?.phone}</p>
                            </div>
                          )}
                          {leftHeaderContent?.content?.email && (
                            <div className="flex items-center text-sm gap-2">
                              <Mail size={16} className="shrink-0" />
                              <p className="break-all">
                                {leftHeaderContent?.content?.email}
                              </p>
                            </div>
                          )}
                          {leftHeaderContent?.content?.socialLinks.map(
                            (item, index) => {
                              return (
                                <div className="flex items-center text-sm gap-2">
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
                      className={`${item.isVisible ? "block" : "hidden"} max-w-full break-words flex flex-col`}
                    >
                      <LeftSectionHeader
                        primaryTextColor={primaryTextColor}
                        title="SKILLS"
                      />
                      <div className="flex flex-col gap-3">
                        <div
                          className="quill-content text-sm tracking-wider"
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
                      className={`${item.isVisible ? "block" : "hidden"} max-w-full break-words`}
                    >
                      <LeftSectionHeader
                        primaryTextColor={primaryTextColor}
                        title="EDUCATION"
                      />
                      <div className="flex flex-col gap-3">
                        {item?.content?.education.map((edu, idx) => (
                          <div key={idx} className="flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-[15px]">
                                {edu.courseName}
                              </h3>
                            </div>
                            <p className="text-sm text-gray-600">
                              {edu.instituteName}
                              {edu.location && `, ${edu.location}`}
                            </p>
                            <span className="text-sm text-gray-600">
                              {edu?.startMonth} {edu?.startYear} -{" "}
                              {edu?.endMonth} {edu?.endYear}
                            </span>
                            {edu.grade && (
                              <p className="text-sm text-gray-600">
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
                      className={`${item.isVisible ? "block" : "hidden"} max-w-full break-words flex flex-col`}
                    >
                      <LeftSectionHeader
                        primaryTextColor={primaryTextColor}
                        title={item.content.sectionTitle}
                      />
                      <div
                        className="quill-content text-sm tracking-wider"
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
                  <div key={index} className="max-w-full break-words">
                    <RightSectionHeader
                      primaryTextColor={primaryTextColor}
                      title="PROFILE"
                    />
                    {headerContent?.content?.summary && (
                      <p
                        className="quill-content text-sm text-gray-600"
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
                    className={`${item.isVisible ? "block" : "hidden"} max-w-full break-words`}
                  >
                    <RightSectionHeader
                      primaryTextColor={primaryTextColor}
                      title="WORK EXPERIENCE"
                    />
                    <div className="flex flex-col gap-6">
                      {item?.content?.experience.map((exp, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-[15px]">
                              {exp.role}
                            </h3>
                            <span className="text-sm text-gray-600">
                              {exp?.startMonth} {exp?.startYear} -{" "}
                              {exp?.endMonth} {exp?.endYear}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {exp.companyName}
                          </p>
                          <div
                            className="quill-content text-sm text-gray-600"
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
                    className={`${item.isVisible ? "block" : "hidden"} max-w-full break-words`}
                  >
                    <RightSectionHeader
                      primaryTextColor={primaryTextColor}
                      title="PROJECTS"
                    />
                    <div className="flex flex-col gap-6">
                      {item?.content?.projects.map((project, idx) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <div className="flex items-center justify-start gap-2">
                            <h1 className="text-base  max-w-[80%] font-semibold">
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
                            className="quill-content text-sm text-gray-600"
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
                    className={`${item.isVisible ? "block" : "hidden"} max-w-full break-words`}
                  >
                    <RightSectionHeader
                      title={item.content.sectionTitle}
                      primaryTextColor={primaryTextColor}
                    />
                    <div
                      className="quill-content tracking-wider text-sm "
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
}: {
  title: string;
  primaryTextColor: string;
}) => {
  return (
    <h2
      className="font-bold text-[16px] mb-2 tracking-[2px] uppercase"
      style={{ color: primaryTextColor }}
    >
      {title}
    </h2>
  );
};

const RightSectionHeader = ({
  title,
  primaryTextColor,
}: {
  title: string;
  primaryTextColor: string;
}) => {
  return (
    <div>
      <h1
        className="text-2xl tracking-[2px] font-bold uppercase"
        style={{ color: primaryTextColor }}
      >
        {title}
      </h1>
    </div>
  );
};

export default Template4;
