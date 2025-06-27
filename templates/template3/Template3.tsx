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

interface TemplateType {
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
    headerContent: "px-6 py-6", // 4px for header content
  },
  sm: {
    section: "mt-1", // 4px between sections
    content: "mt-2", // 8px for content blocks
    headerContent: "px-8 py-8", // 4px for header content
  },
  md: {
    section: "mt-2", // 8px between sections
    content: "mt-3", // 12px for content blocks
    headerContent: "px-12 py-12", // 8px for header content
  },
  lg: {
    section: "mt-3", // 16px between sections
    content: "mt-4", // 20px for content blocks
    headerContent: "px-16 py-16", // 12px for header content
  },
} as const;

const Template3 = ({
  obj,
  size,
  textSize = size,
  marginSize = size,
}: TemplateType) => {
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
        " text-black overflow-hidden overflow-x-hidden  w-[211mm] h-[297mm]  select-none cursor-pointer rounded-3xl print:rounded-none transition duration-300 ease-in  shadow-2xl print:border-0 border border-primary"
      )}
    >
      <div className="grid grid-cols-3 h-full">
        <div
          style={{ backgroundColor: primaryColor }}
          className={`col-span-1  text-white py-8 px-6`}
        >
          <div className="flex flex-col">
            {leftObj?.map((item: any, index: any) => {
              switch (item.type) {
                case "header":
                  return (
                    <>
                      <div
                        className={cn(
                          "flex flex-col",
                          currentMarginSize.section
                        )}
                      >
                        <div className="relative flex shrink-0 overflow-hidden w-[180px] h-[180px] border-[6px] border-[#d5d5d5] rounded-full">
                          <Image
                            src={
                              leftHeaderContent?.content?.photo ||
                              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                            }
                            width={180}
                            height={180}
                            alt="kohli"
                            className="aspect-square h-full object-cover w-full"
                          />
                        </div>

                        <div
                          className={cn(
                            "flex flex-col gap-2 ",
                            currentMarginSize.section
                          )}
                        >
                          <h2
                            className={cn(
                              "font-medium tracking-wide mt-6 ",
                              currentTextSize.sectionHeader
                            )}
                          >
                            CONTACT
                          </h2>
                          <div className="h-[2px] mb-2 bg-[#fff]"></div>
                          <div className="flex flex-col gap-1">
                            {leftHeaderContent?.content?.phone && (
                              <div
                                className={cn(
                                  "flex items-center gap-2",
                                  currentTextSize.content
                                )}
                              >
                                <PhoneCall
                                  size={20}
                                  className="shrink-0 mt-1"
                                />
                                <p className="break-all">
                                  {leftHeaderContent?.content?.phone}
                                </p>
                              </div>
                            )}
                            {leftHeaderContent?.content?.email && (
                              <div
                                className={cn(
                                  "flex items-center gap-2",
                                  currentTextSize.content
                                )}
                              >
                                <Mail size={20} className="shrink-0 mt-1" />
                                <p className="break-all">
                                  {leftHeaderContent?.content?.email}
                                </p>
                              </div>
                            )}
                            {leftHeaderContent?.content?.socialLinks.map(
                              (item, index) => {
                                return (
                                  <div
                                    className={cn(
                                      "flex items-center gap-2",
                                      currentTextSize.content
                                    )}
                                  >
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
                      </div>
                    </>
                  );
                case "skills":
                  return (
                    <div
                      key={index}
                      className={cn(
                        `${item.isVisible ? "block" : "hidden"} flex flex-col gap-2`,
                        currentMarginSize.section
                      )}
                    >
                      <h2
                        className={cn(
                          "font-medium tracking-wide",
                          currentTextSize.sectionHeader
                        )}
                      >
                        SKILLS
                      </h2>
                      <div className="h-[2px] mb-2 bg-[#fff]"></div>
                      <p
                        className={cn(
                          "quill-content tracking-wider break-words text-left text-[#fff]! font-light",
                          currentTextSize.description
                        )}
                        dangerouslySetInnerHTML={{
                          __html: item?.content.description ?? "",
                        }}
                      />
                    </div>
                  );
                case "custom":
                  if (
                    visitedCustoms.includes(
                      `${item.orderNumber}-${item.content.sectionTitle}`
                    )
                  )
                    return;
                  visitedCustoms.push(
                    `${item.orderNumber}-${item.content.sectionTitle}`
                  );
                  return (
                    <>
                      <div
                        key={item.orderNumber}
                        className={`${item.isVisible ? "block" : "hidden"} flex flex-col gap-2 ${currentMarginSize.section}`}
                      >
                        <h2
                          className={cn(
                            "font-medium tracking-wide uppercase",
                            currentTextSize.sectionHeader
                          )}
                        >
                          {item.content.sectionTitle}
                        </h2>
                        <div className="h-[2px] mb-2 bg-[#fff]"></div>
                        <div
                          className="quill-content font-light tracking-wider text-sm "
                          dangerouslySetInnerHTML={{
                            __html: item.content.sectionDescription,
                          }}
                        />
                      </div>
                    </>
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>

        <div className="col-span-2 bg-[#fff] ">
          {rightObj.map((item, index) => {
            switch (item.type) {
              case "header":
                return (
                  <>
                    <div className={cn("flex flex-col", currentMarginSize.headerContent)}>
                      <h1
                        className={cn(
                          "font-normal uppercase",
                          currentTextSize.name
                        )}
                      >
                        <span
                          style={{ color: primaryTextColor }}
                          className=" mr-2  font-extrabold "
                        >
                          {headerContent?.content?.firstName}
                        </span>
                        {headerContent?.content?.lastName}
                      </h1>
                      <h1
                        className={cn(
                          "font-normal uppercase",
                          currentTextSize.content
                        )}
                      >
                        {headerContent?.content?.role}
                      </h1>
                      {(headerContent?.content?.firstName ||
                        headerContent?.content?.lastName) && (
                        <div
                          className="w-28 h-[4px] mt-2"
                          style={{ background: primaryColor }}
                        ></div>
                      )}
                    </div>

                    <div
                      className={cn(
                        "max-w-[90%] mx-auto",
                        currentMarginSize.section
                      )}
                    >
                      <SectionHeader
                        primaryColor={primaryColor}
                        primaryTextColor={primaryTextColor}
                        title="PROFILE"
                        textSize={currentTextSize}
                      />

                      <p
                        className={cn(
                          "quill-content text-[#000]",
                          currentTextSize.description
                        )}
                        dangerouslySetInnerHTML={{
                          __html: headerContent?.content?.summary ?? "",
                        }}
                      />
                    </div>
                  </>
                );
              case "experience":
                return (
                  <div
                    className={cn(
                      `${item.isVisible ? "block" : "hidden"} max-w-[90%] mx-auto`,
                      currentMarginSize.section
                    )}
                  >
                    <SectionHeader
                      primaryColor={primaryColor}
                      primaryTextColor={primaryTextColor}
                      title="WORK EXPERIENCE"
                      textSize={currentTextSize}
                    />

                    <div className="relative">
                      <div className="absolute left-1.5 top-2 bottom-0 w-0.5 bg-gray-300"></div>
                      <div className="space-y-4">
                        {item?.content?.experience.map((exp, index) => {
                          return (
                            <div className={`relative`} key={index}>
                              <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-gray-500"></div>
                              <div
                                className={cn("ml-8", currentTextSize.content)}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <h1 className="font-bold tracking-wide text-[#000]">
                                    {exp.companyName}
                                  </h1>
                                  {exp?.startYear && exp?.endYear && (
                                    <h1>
                                      {exp?.startMonth} {exp?.startYear}{" "}
                                      {(exp?.startYear || exp?.startMonth) &&
                                        (exp?.endYear || exp?.endMonth) &&
                                        "-"}
                                      {exp?.endMonth} {exp?.endYear}
                                    </h1>
                                  )}
                                </div>
                                <h1 className="text-[#000] font-medium tracking-wide">
                                  {exp.role}
                                </h1>
                                <div
                                  className={cn(
                                    "quill-content text-[#000]",
                                    currentTextSize.description
                                  )}
                                  dangerouslySetInnerHTML={{
                                    __html: exp?.jobDescription,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              case "education":
                return (
                  <div
                    className={cn(
                      `${item.isVisible ? "block" : "hidden"} max-w-[90%] mx-auto `,
                      currentMarginSize.section
                    )}
                  >
                    <SectionHeader
                      primaryColor={primaryColor}
                      primaryTextColor={primaryTextColor}
                      title="EDUCATION"
                      textSize={currentTextSize}
                    />
                    <div className="relative">
                      <div className="absolute left-1.5 top-2 bottom-0 w-0.5 bg-gray-300"></div>
                      <div className="space-y-3">
                        {item?.content?.education.map((edu, index) => (
                          <div className="relative" key={index}>
                            <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-gray-500"></div>
                            <div
                              className={cn("ml-8", currentTextSize.content)}
                            >
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                  <h1 className="font-semibold tracking-wide text-[#000] break-normal">
                                    {edu.courseName}
                                  </h1>
                                  <h1 className="text-[#000] tracking-wide">
                                    {edu.instituteName},{" "}
                                    {edu.location && edu.location}
                                  </h1>
                                  <h1 className="text-[#000] tracking-wide">
                                    {edu.grade && `Grade : ${edu.grade}`}
                                  </h1>
                                </div>
                                <div className="shrink-0 whitespace-nowrap">
                                  {edu?.startYear && edu?.endYear && (
                                    <span>
                                      {edu?.startMonth} {edu?.startYear} -
                                      {edu?.endMonth} {edu?.endYear}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              case "custom":
                if (
                  visitedCustoms.includes(
                    `${item.orderNumber}-${item.content.sectionTitle}`
                  )
                )
                  return;
                visitedCustoms.push(
                  `${item.orderNumber}-${item.content.sectionTitle}`
                );
                return (
                  <>
                    <div
                      className={cn(
                        `${item.isVisible ? "block" : "hidden"} max-w-[90%] mx-auto`,
                        currentMarginSize.section
                      )}
                      key={item.orderNumber}
                    >
                      <SectionHeader
                        primaryColor={primaryColor}
                        primaryTextColor={primaryTextColor}
                        title={item.content.sectionTitle}
                        textSize={currentTextSize}
                      />
                      <div
                        className={cn(
                          "quill-content tracking-wider",
                          currentTextSize.description
                        )}
                        dangerouslySetInnerHTML={{
                          __html: item.content.sectionDescription,
                        }}
                      />
                    </div>
                  </>
                );
            }
          })}
        </div>
      </div>
    </div>
  );

  return <TemplateWrapper size={size}>{content}</TemplateWrapper>;
};

const SectionHeader = ({
  title,
  primaryColor,
  primaryTextColor,
  textSize,
}: {
  title: string;
  primaryColor: string;
  primaryTextColor: string;
  textSize: any;
}) => {
  return (
    <div>
      <h1
        className={cn(
          "text-2xl tracking-wider font-bold  uppercase",
          textSize.sectionHeader
        )}
        style={{ color: primaryTextColor }}
      >
        {title}
      </h1>
      <div
        className="h-[2px] mb-2"
        style={{ backgroundColor: primaryColor }}
      ></div>
    </div>
  );
};

export default Template3;
