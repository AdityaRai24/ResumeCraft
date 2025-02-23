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

const Template3 = ({ obj, size }: TemplateType) => {
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
        " text-black overflow-hidden overflow-x-hidden  w-[211mm] h-[297mm]  select-none cursor-pointer rounded-3xl print:rounded-none transition duration-300 ease-in  shadow-2xl print:border-0 border border-primary"
      )}
    >
      <div className="grid grid-cols-3 h-full">
        <div
          style={{ backgroundColor: primaryColor }}
          className={`col-span-1  text-white py-8 px-6`}
        >
          <div className="flex flex-col gap-6">
            {leftObj?.map((item: any, index: any) => {
              switch (item.type) {
                case "header":
                  return (
                    <>
                      <div className="flex flex-col">
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

                        <div className="flex flex-col gap-2 mt-6">
                          <h2 className="font-medium text-[23px] tracking-wide mt-4">
                            CONTACT
                          </h2>
                          <div className="h-[2px] mb-2 bg-[#fff]"></div>
                          <div className="flex flex-col gap-1">
                            {leftHeaderContent?.content?.phone && (
                              <div className="flex items-center text-sm font-light gap-2">
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
                              <div className="flex items-center text-sm font-light gap-2">
                                <Mail
                                  size={20}
                                  className="shrink-0 mt-1"
                                />
                                <p className="break-all">
                                  {leftHeaderContent?.content?.email}
                                </p>
                              </div>
                            )}
                            {leftHeaderContent?.content?.socialLinks.map(
                              (item, index) => {
                                return (
                                  <div className="flex items-center text-sm font-light gap-2">
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
                      className={`${item.isVisible ? "block" : "hidden"} flex flex-col gap-2`}
                    >
                      <h2 className="font-medium text-[23px] tracking-wide">
                        SKILLS
                      </h2>
                      <div className="h-[2px] mb-2 bg-[#fff]"></div>
                      <p
                        className="quill-content tracking-wider break-words text-left text-[#fff]! font-light text-sm "
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
                        className={`${item.isVisible ? "block" : "hidden"} flex flex-col gap-2`}
                      >
                        <h2 className="font-medium uppercase text-[23px] tracking-wide">
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
                    <div className="flex flex-col px-16 py-16">
                      <h1 className="text-4xl font-normal uppercase">
                        <span
                          style={{ color: primaryTextColor }}
                          className=" mr-2  font-extrabold "
                        >
                          {headerContent?.content?.firstName}
                        </span>
                        {headerContent?.content?.lastName}
                      </h1>
                      <h1 className="text-base font-normal uppercase">
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

                    <div className="max-w-[90%] mx-auto">
                      <SectionHeader
                        primaryColor={primaryColor}
                        primaryTextColor={primaryTextColor}
                        title="PROFILE"
                      />

                      <p
                        className="quill-content text-sm text-[#000]"
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
                    className={` ${item.isVisible ? "block" : "hidden"} max-w-[90%] mx-auto mt-4`}
                  >
                    <SectionHeader
                      primaryColor={primaryColor}
                      primaryTextColor={primaryTextColor}
                      title="WORK EXPERIENCE"
                    />

                    <div className="relative">
                      <div className="absolute left-1.5 top-2 bottom-0 w-0.5 bg-gray-300"></div>
                      <div className="space-y-4">
                        {item?.content?.experience.map((exp, index) => {
                          return (
                            <div className={`relative`} key={index}>
                              <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-gray-500"></div>
                              <div className="ml-8 text-sm">
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
                                  className="quill-content text-sm text-[#000]"
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
                    className={` ${item.isVisible ? "block" : "hidden"} max-w-[90%] mx-auto mt-4`}
                  >
                    <SectionHeader
                      primaryColor={primaryColor}
                      primaryTextColor={primaryTextColor}
                      title="EDUCATION"
                    />
                    <div className="relative">
                      <div className="absolute left-1.5 top-2 bottom-0 w-0.5 bg-gray-300"></div>
                      <div className="space-y-3">
                        {item?.content?.education.map((edu, index) => (
                          <div className="relative" key={index}>
                            <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-gray-500"></div>
                            <div className="ml-8 text-sm">
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
                      className={`${item.isVisible ? "block" : "hidden"} max-w-[90%] uppercase mx-auto mt-4`}
                      key={item.orderNumber}
                    >
                      <SectionHeader
                        primaryColor={primaryColor}
                        primaryTextColor={primaryTextColor}
                        title={item.content.sectionTitle}
                      />
                      <div
                        className="quill-content tracking-wider text-sm "
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
}: {
  title: string;
  primaryColor: string;
  primaryTextColor: string;
}) => {
  return (
    <div>
      <h1
        className="text-2xl tracking-wider font-bold  uppercase"
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
