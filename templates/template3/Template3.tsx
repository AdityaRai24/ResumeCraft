"use client";
import { cn } from "@/lib/utils";
import { ResumeTemplate } from "@/types/templateTypes";
import {
  Github,
  Globe,
  Link2,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  PhoneCall,
  Twitter,
} from "lucide-react";
import React from "react";
import TemplateWrapper from "@/providers/TemplateWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export interface TemplateType {
  obj: ResumeTemplate;
  size: "sm" | "md" | "lg";
}

const Template3 = ({ obj, size }: TemplateType) => {
  console.log({ obj });

  const headerLogoMap: any = {
    github: <Github size={20} className="mt-[2px]" />,
    linkedin: <Linkedin size={20} className="mt-[2px]" />,
    portfolio: <Globe size={20} className="mt-[2px]" />,
    twitter: <Twitter size={20} className="mt-[2px]" />,
    other: <Link2 size={20} className="mt-[2px]" />,
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
  console.log({ uniqueSectionTypes });

  const leftSections = ["header", "skills", "languages", "references"];
  const rightSections = ["header", "experience", "education"];

  const content = (
    <div
      id="resumeSection"
      className={cn(
        " text-black overflow-hidden overflow-x-hidden  w-[211mm] h-[297mm]  select-none cursor-pointer rounded-3xl print:rounded-none transition duration-300 ease-in  shadow-2xl print:border-0 border border-primary"
      )}
    >
      <div className="grid grid-cols-3 h-full">
        <div className="col-span-1 bg-[#153c54] text-white py-8 px-6">
          <div className="flex flex-col gap-2">
            {leftSections?.map((item: any, index: any) => {
              switch (item) {
                case "header":
                  const headerContent = obj.sections.filter(
                    (item) => item.type === "header"
                  )[0];
                  return (
                    <div key={index} className="flex flex-col">
                      <Avatar className="size-[180px] border-[6px] border-[#d5d5d5]">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col gap-2">
                        <h2 className="font-medium text-[23px] tracking-wide mt-4">
                          CONTACT
                        </h2>
                        <div className="h-[1.99px] mb-2 bg-[#fff]"></div>
                        <div className="flex flex-col gap-1">
                          {headerContent.content.phone && (
                            <div className="flex items-center text-sm font-light gap-2">
                              <PhoneCall
                                size={20}
                                className="flex-shrink-0 mt-1"
                              />
                              <p className="break-all">
                                {headerContent.content.phone}
                              </p>
                            </div>
                          )}
                          {headerContent.content.email && (
                            <div className="flex items-center text-sm font-light gap-2">
                              <Mail size={20} className="flex-shrink-0 mt-1" />
                              <p className="break-all">
                                {headerContent.content.email}
                              </p>
                            </div>
                          )}
                          {headerContent.content.socialLinks.map(
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
                  );

                case "skills":
                  return (
                    <div key={index} className="flex flex-col gap-2 mt-4">
                      <h2 className="font-medium text-[23px] tracking-wide">
                        SKILLS
                      </h2>
                      <div className="h-[1.99px] mb-2 bg-[#fff]"></div>
                      <ul className="list-disc tracking-wider font-light pl-4 text-sm space-y-[8px]">
                        <li>Project Management</li>
                        <li>Public Relations</li>
                        <li>Teamwork</li>
                        <li>Time Management</li>
                        <li>Leadership</li>
                        <li>Effective Communication</li>
                        <li>Digital Marketing</li>
                      </ul>
                    </div>
                  );

                case "languages":
                  return (
                    <div key={index} className="flex flex-col gap-2 mt-4">
                      <h2 className="font-medium text-[23px] tracking-wide">
                        LANGUAGES
                      </h2>
                      <div className="h-[1.99px] mb-2 bg-[#fff]"></div>
                      <ul className="list-disc tracking-wider font-light pl-4 text-sm space-y-[8px]">
                        <li>English (Fluent)</li>
                        <li>French (Fluent)</li>
                        <li>German (Basic)</li>
                        <li>Spanish (Intermediate)</li>
                      </ul>
                    </div>
                  );

                case "references":
                  return (
                    <div key={index} className="flex flex-col gap-2 mt-4">
                      <h2 className="font-medium text-[23px] tracking-wide">
                        REFERENCE
                      </h2>
                      <div className="h-[1.99px]  mb-2 bg-[#fff]"></div>
                      <div className="text-sm tracking-wider font-light space-y-1">
                        <p className="font-medium">Estelle Darcy</p>
                        <p>Wardiere Inc. / CTO</p>
                        <p>Phone: 123-456-7890</p>
                        <p>Email: hello@reallygreatsite.com</p>
                      </div>
                    </div>
                  );

                default:
                  return null;
              }
            })}
          </div>
        </div>

        <div className="col-span-2 bg-[#fff] ">
          {rightSections.map((item, index) => {
            switch (item) {
              case "header":
                const headerContent = obj.sections.filter(
                  (item) => item.type === "header"
                )[0];

                return (
                  <>
                    <div className="flex flex-col px-16 py-16" key={index}>
                      <h1 className="text-4xl font-normal uppercase">
                        <span className="text-[#444] mr-2  font-extrabold ">
                          {headerContent.content.firstName}
                        </span>
                        {headerContent.content.lastName}
                      </h1>
                      {(headerContent.content.firstName ||
                        headerContent.content.lastName) && (
                        <div className="w-28 h-[4px] mt-2 bg-[#153c54]"></div>
                      )}
                    </div>

                    <div className="max-w-[90%] mx-auto">
                      <h1 className="text-2xl font-bold tracking-wider  text-[#444]">
                        PROFILE
                      </h1>
                      <div className="h-[2px] mb-2 bg-[#153c54]"></div>
                      <p
                        className="quill-content text-sm text-[#444]"
                        dangerouslySetInnerHTML={{
                          __html: headerContent?.content?.summary ?? "",
                        }}
                      />
                    </div>
                  </>
                );
              case "experience":
                const experienceContent = obj.sections.filter(
                  (item) => item.type === "experience"
                )[0];
                return (
                  <div className="max-w-[90%] mx-auto mt-4">
                    <h1 className="text-2xl tracking-wider font-bold text-[#444]">
                      WORK EXPERIENCE
                    </h1>{" "}
                    <div className="h-[2px] mb-2 bg-[#153c54]"></div>
                    <div className="relative">
                      <div className="absolute left-1.5 top-2 bottom-0 w-0.5 bg-gray-300"></div>
                      <div className="space-y-4">
                        {experienceContent.content.experience.map(
                          (exp, index) => {
                            return (
                              <div className="relative" key={index}>
                                <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-gray-500"></div>
                                <div className="ml-8 text-sm">
                                  <div className="flex items-center justify-between gap-2">
                                    <h1 className="font-semibold tracking-wide text-[#000]">
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
                                  <h1 className="text-[#000] tracking-wide">
                                    {exp.role}
                                  </h1>
                                  <div
                                    className="quill-content text-sm text-[#444]"
                                    dangerouslySetInnerHTML={{
                                      __html: exp?.jobDescription,
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                );
              case "education":
                const educationContent = obj.sections.filter(
                  (item) => item.type === "education"
                )[0];
                return (
                  <div className="max-w-[90%] mx-auto mt-4">
                    <h1 className="text-2xl tracking-wider font-bold text-[#444]">
                      EDUCATION
                    </h1>
                    <div className="h-[2px] mb-2 bg-[#153c54]"></div>
                    <div className="relative">
                      <div className="absolute left-1.5 top-2 bottom-0 w-0.5 bg-gray-300"></div>
                      <div className="space-y-3">
                        {educationContent.content.education.map(
                          (edu, index) => (
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
                                  <div className="flex-shrink-0 whitespace-nowrap">
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
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
            }
          })}
        </div>
      </div>
    </div>
  );

  return <TemplateWrapper size={size}>{content}</TemplateWrapper>;
};

export default Template3;
