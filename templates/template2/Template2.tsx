import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Github,
  Globe,
  Globe2,
  Link2,
  Linkedin,
  Mail,
  MessageCircle,
  Phone,
  Twitter,
} from "lucide-react";
import React from "react";
import {
  HeaderContent,
  EducationContent,
  SkillsContent,
  ExperienceContent,
  ProjectContent,
  CustomContent,
} from "./temp2Types";
import { ResumeTemplate } from "@/types/templateTypes";
import useMobile from "@/lib/useMobile";
import TemplateWrapper from "@/providers/TemplateWrapper";

interface TemplateType {
  obj: ResumeTemplate;
  size: "sm" | "md" | "lg";
}

const Template2 = ({ obj, size }: TemplateType) => {
  const primaryTextColorClass = obj?.globalStyles?.primaryTextColor || "black";
  const primaryColorClass = obj?.globalStyles?.primaryColor || "black";

  const sortedSections = [...obj.sections].sort(
    (a, b) => a.orderNumber - b.orderNumber
  );

  const headerLogoMap: any = {
    github: <Github size={18} className="mt-[2px]" />,
    linkedin: <Linkedin size={18} className="mt-[2px]" />,
    portfolio: <Globe size={18} className="mt-[2px]" />,
    twitter: <Twitter size={18} className="mt-[2px]" />,
    other: <Link2 size={18} className="mt-[2px]" />,
  };

  const renderSection = (section : any, index : any) => {
    switch (section.type) {
      case "header":
        const headerContent = section.content as HeaderContent;

        return (
          <div 
            key={`header-section-${index}`} 
            className={section.isVisible ? "block" : "hidden"}
          >
            <h1
              className="text-4xl text-center font-semibold"
              style={{ color: primaryTextColorClass }}
            >
              {headerContent.firstName} {headerContent.lastName}
            </h1>
            <div className="flex items-center flex-wrap justify-center gap-4 mt-2">
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
              {headerContent.socialLinks.map((item, i) => {
                return (
                  <div key={i} className="flex items-center justify-center gap-1">
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
        );

      case "education":
        const educationContent = section.content as EducationContent;

        return (
          <div 
            key={`education-section-${index}`} 
            className={`mt-2 ${section.isVisible ? "block" : "hidden"}`}
          >
            <div style={{ borderBottom: `1px solid ${primaryColorClass}` }}>
              <h1
                className="text-lg"
                style={{ color: primaryTextColorClass }}
              >
                EDUCATION
              </h1>
            </div>
            {educationContent?.education?.map((edu, i) => (
              <div
                key={i}
                className="flex mt-2 items-center justify-between"
              >
                <div>
                  <h1 className="text-base font-semibold">
                    {edu?.instituteName}
                  </h1>
                  <p className="text-sm italic">
                    {edu?.courseName} {edu?.grade && "-"} {edu?.grade}
                  </p>
                </div>
                <div>
                  <p className="text-base text-right">
                    {edu?.location && edu?.location}
                  </p>
                  <p className="text-sm text-right italic">
                    {`${edu?.startMonth ? `${edu.startMonth} ` : ""}${edu?.startYear ? edu.startYear : ""}${!edu?.studyingHere && (edu?.endMonth || edu?.endYear) ? ` - ${edu.endMonth} ${edu.endYear}` : edu?.studyingHere ? " - Present" : ""}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );

      case "experience":
        const experienceContent = section.content as ExperienceContent;
        
        return (
          <div
            key={`experience-section-${index}`}
            className={`mt-2 ${section.isVisible ? "block" : "hidden"}`}
          >
            <div style={{ borderBottom: `1px solid ${primaryColorClass}` }}>
              <h1
                className="text-lg"
                style={{ color: primaryTextColorClass }}
              >
                EXPERIENCE
              </h1>
            </div>
            {experienceContent?.experience?.map((exp, i) => (
              <div key={i} className="mt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-base font-semibold">{exp?.role}</h1>
                    <h1 className="text-sm italic">{exp?.companyName}</h1>
                  </div>
                  <div className="text-right">
                    {exp?.startYear && exp?.endYear && (
                      <p className="text-base ">
                        {exp?.startMonth} {exp?.startYear}{" "}
                        {(exp?.startYear || exp?.startMonth) &&
                          (exp?.endYear || exp?.endMonth) &&
                          "-"}
                        {exp?.endMonth} {exp?.endYear}
                      </p>
                    )}{" "}
                    {exp?.location && (
                      <p className="text-sm italic">{exp?.location}</p>
                    )}
                  </div>
                </div>
                <div
                  className="quill-content text-sm"
                  dangerouslySetInnerHTML={{ __html: exp?.jobDescription }}
                />
              </div>
            ))}
          </div>
        );

      case "skills":
        const skillsContent = section as SkillsContent;

        return (
          <div
            key={`skills-section-${index}`}
            className={`mt-2 ${section.isVisible ? "block" : "hidden"}`}
          >
            <div style={{ borderBottom: `1px solid ${primaryColorClass}` }}>
              <h1
                className="text-lg"
                style={{ color: primaryTextColorClass }}
              >
                SKILLS
              </h1>
            </div>
            <div
              className="quill-content text-sm mt-3"
              dangerouslySetInnerHTML={{
                __html: skillsContent.content.description,
              }}
            />
          </div>
        );

      case "projects":
        const projectContent = section.content as ProjectContent;
        
        return (
          <div
            key={`projects-section-${index}`}
            className={`mt-2 ${section.isVisible ? "block" : "hidden"}`}
          >
            <div style={{ borderBottom: `1px solid ${primaryColorClass}` }}>
              <h1
                className="text-lg"
                style={{ color: primaryTextColorClass }}
              >
                PROJECTS
              </h1>
            </div>
            {projectContent?.projects?.map((project, i) => (
              <div key={i} className="mt-2">
                <div className="flex items-center justify-start gap-2">
                  <h1 className="text-base font-semibold">
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
                  dangerouslySetInnerHTML={{ __html: project?.description }}
                />
              </div>
            ))}
          </div>
        );

      case "custom":
        return (
          <div
            key={`custom-section-${index}-${section.content.sectionTitle}`}
            className={`mt-2 ${section.isVisible ? "block" : "hidden"}`}
          >
            <div style={{ borderBottom: `1px solid ${primaryColorClass}` }}>
              <h1
                className="text-lg"
                style={{ color: primaryTextColorClass }}
              >
                {section.content.sectionTitle.toUpperCase()}
              </h1>
            </div>
            <div
              className="quill-content text-sm mt-2"
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
        "bg-[white] text-black py-8! px-8 overflow-hidden overflow-x-clip w-[211mm] h-[297mm] select-none cursor-pointer rounded-3xl print:rounded-none transition duration-300 ease-in shadow-2xl border print:border-0 border-primary"
      )}
    >
      <div className="">
        {sortedSections.map((section, index) => renderSection(section, index))}
      </div>
    </div>
  );

  return <TemplateWrapper size={size!}>{content}</TemplateWrapper>;
};

export default Template2;