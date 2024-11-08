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

interface TemplateType {
  obj: ResumeTemplate;
  size?: "sm" | "md" | "lg";
}

const Template2 = ({  obj, size }: TemplateType) => {
  const sectionArray = obj?.sections?.map((item) => item.type);
  const isMobile = useMobile();

  const PreviewWrapper = ({ children }: { children: React.ReactNode }) => (
    <div
      className={cn(
        "transform origin-top-left",
        isMobile
          ? size === "sm"
            ? "scale-[0.2]"
            : size === "md"
              ? "scale-[0.5]"
              : "scale-[0.42] print:scale-100"
          : size === "sm"
            ? "scale-[0.37]"
            : size === "md"
              ? "scale-[0.5]"
              : "scale-[1]"
      )}
    >
      {children}
    </div>
  );

  const primaryTextColorClass = obj?.globalStyles?.primaryTextColor || "black";
  const primaryColorClass = obj?.globalStyles?.primaryColor || "black";

  const sortedSections = [...obj.sections].sort(
    (a, b) => a.orderNumber - b.orderNumber
  );
  const visitedCustoms: number[] = [];
  const uniqueSectionTypes = Array.from(
    new Set(sortedSections.map((item) => item.type))
  );

  const headerLogoMap: any = {
    github: <Github size={18} className="mt-[2px]" />,
    linkedin: <Linkedin size={18} className="mt-[2px]" />,
    portfolio: <Globe size={18} className="mt-[2px]" />,
    twitter: <Twitter size={18} className="mt-[2px]" />,
    other: <Link2 size={18} className="mt-[2px]" />,
  };

  const renderSection = (type: string) => {
    return obj?.sections?.map((item, index) => {
      if (item.type === type) {
        switch (type) {
          case "header":
            const headerContent = item.content as HeaderContent;

            return (
              <div key={index} className={item.isVisible ? "block" : "hidden"}>
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
            );

          case "education":
            const educationContent = item.content as EducationContent;

            return (
              <div className={`mt-2 ${item.isVisible ? "block" : "hidden"}`}>
                <div style={{ borderBottom: `1px solid ${primaryColorClass}` }}>
                  <h1
                    className="text-lg"
                    style={{ color: primaryTextColorClass }}
                  >
                    EDUCATION
                  </h1>
                </div>
                {educationContent?.education?.map((edu, index) => (
                  <div
                    key={index}
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
            const experienceContent = item.content as ExperienceContent;
            return (
              <div
                className={`mt-2 ${item.isVisible ? "block" : "hidden"}`}
                key={index}
              >
                <div style={{ borderBottom: `1px solid ${primaryColorClass}` }}>
                  <h1
                    className="text-lg"
                    style={{ color: primaryTextColorClass }}
                  >
                    EXPERIENCE
                  </h1>
                </div>
                {experienceContent?.experience?.map((exp, index) => (
                  <div key={index} className="mt-2">
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
            const skillsContent = item as SkillsContent;

            return (
              <div
                className={`mt-2 ${item.isVisible ? "block" : "hidden"}`}
                key={index}
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
                  className="quill-content  text-sm mt-3"
                  dangerouslySetInnerHTML={{
                    __html: skillsContent.content.description,
                  }}
                />
              </div>
            );

          case "projects":
            const projectContent = item.content as ProjectContent;
            return (
              <div
                className={`mt-2 ${item.isVisible ? "block" : "hidden"}`}
                key={index}
              >
                <div style={{ borderBottom: `1px solid ${primaryColorClass}` }}>
                  <h1
                    className="text-lg"
                    style={{ color: primaryTextColorClass }}
                  >
                    PROJECTS
                  </h1>
                </div>
                {projectContent?.projects?.map((project, index) => (
                  <div key={index} className="mt-2">
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
            return sortedSections.map((item, index) => {
              if (item.type === "custom") {
                if (visitedCustoms.includes(item.orderNumber)) return;
                visitedCustoms.push(item.orderNumber);
                return (
                  <>
                    <div
                      className={`mt-2 ${item.isVisible ? "block" : "hidden"}`}
                      key={index}
                    >
                      <h1
                        className="text-lg uppercase"
                        style={{
                          color: primaryTextColorClass,
                          borderBottom: `1px solid ${primaryColorClass}`,
                        }}
                      >
                        {item.content.sectionTitle}
                      </h1>
                      <div
                        className="quill-content text-sm mt-2"
                        dangerouslySetInnerHTML={{
                          __html: item.content.sectionDescription,
                        }}
                      />
                    </div>
                  </>
                );
              }
              return null;
            });

          default:
            return null;
        }
      }
      return null;
    });
  };

  const content = (
    <div
      id="resumeSection"
      className={cn(
        "bg-[white] text-black !py-8 px-8 overflow-hidden overflow-x-clip w-[211mm] h-[297mm]  select-none cursor-pointer rounded-3xl print:rounded-none transition duration-300 ease-in shadow-2xl border print:border-0 border-primary"
      )}
    >
      <div className="">
        {uniqueSectionTypes?.map((section, index) => {
          return <div key={index}>{renderSection(section)}</div>;
        })}
      </div>
    </div>
  );

  return <PreviewWrapper>{content}</PreviewWrapper>;
};

export default Template2;
