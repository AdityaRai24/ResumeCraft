import { cn } from "@/lib/utils";
import Link from "next/link";
import { Github, Globe, Linkedin } from "lucide-react";
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

interface TemplateType {
  isPreview?: boolean;
  obj: ResumeTemplate;
  isLive?: boolean;
  modalPreview?: boolean;
}

const Template2 = ({ isPreview, obj, isLive, modalPreview }: TemplateType) => {
  const sectionArray = obj?.sections?.map((item) => item.type);

  const PreviewWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-hidden">
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

  const sortedSections = [...obj.sections].sort(
    (a, b) => a.orderNumber - b.orderNumber
  );
  const visitedCustoms: number[] = [];
  const uniqueSectionTypes = Array.from(
    new Set(sortedSections.map((item) => item.type))
  );

  const renderSection = (type: string) => {
    return obj?.sections?.map((item, index) => {
      if (item.type === type) {
        switch (type) {
          case "header":
            const headerContent = item.content as HeaderContent;

            return (
              <div key={index}>
                <h1
                  className="text-4xl text-center font-semibold"
                  style={{ color: primaryTextColorClass }}
                >
                  {headerContent.firstName} {headerContent.lastName}
                </h1>
                <div className="flex items-center justify-center gap-2">
                  {headerContent.phone && <p>{`${headerContent.phone} |`} </p>}
                  {headerContent.email && (
                    <p className="underline underline-offset-2">
                      {`${headerContent.email} |`}
                    </p>
                  )}
                  {headerContent.linkedin && (
                    <div className="flex items-center justify-center gap-1">
                      <Linkedin size={20} />
                      <a
                        href={`https://linkedin.com/${headerContent.linkedin}`}
                        className="underline underline-offset-2"
                      >
                        {headerContent.linkedin}
                      </a>{" "}
                      |
                    </div>
                  )}
                  {headerContent.github && (
                    <div className="flex items-center justify-center gap-1">
                      <Github size={20} />
                      <a
                        href={`https://github.com/${headerContent.github}`}
                        className="underline underline-offset-2"
                      >
                        {headerContent.github}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );

          case "education":
            const educationContent = item.content as EducationContent;

            return (
              <div className="mt-2">
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
                      <p className="text-sm italic">{edu?.courseName} - {edu?.grade}</p>
                    </div>
                    <div>
                      <p className="text-base text-right">
                        {edu?.location && edu?.location}
                      </p>
                      <p className="text-sm text-right italic">
                        {`${edu?.startMonth ? `${edu.startMonth} ` : ""}${edu?.startYear ? edu.startYear : ""}${!edu?.studyingHere && edu?.endMonth && edu?.endYear ? ` - ${edu.endMonth} ${edu.endYear}` : edu?.studyingHere ? " - Present" : ""}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );

          case "experience":
            const experienceContent = item.content as ExperienceContent;
            return (
              <div className="mt-2">
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
                            {exp?.startMonth} {exp?.startYear} - {" "}
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
              <div className={`mt-2`} key={index}>
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
              <div className="mt-2">
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
                      className="mt-2"
                      style={{ borderBottom: `1px solid ${primaryColorClass}` }}
                    >
                      <h1
                        className="text-lg"
                        style={{ color: primaryTextColorClass }}
                      >
                        {item.content.sectionTitle}
                      </h1>
                    </div>
                    <div className="mt-2">
                      <div
                        className="quill-content text-sm"
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
        "bg-[white] text-black py-8 overflow-hidden overflow-x-hidden w-[210mm] h-[297mm] px-8 ",
        isPreview &&
          "select-none cursor-pointer rounded-3xl transition duration-300 ease-in p-10 shadow-2xl border border-primary",
        isLive && "w-[210mm] h-[297mm]",
        isPreview && !isLive && "w-[795px] h-[1122px]",
        !isLive && !isPreview && "scale-[1] shadow-2xl rounded-2xl",
        modalPreview && "scale-[0.6]"
      )}
    >
      <div>
        {uniqueSectionTypes?.map((section, index) => {
          return <div key={index}>{renderSection(section)}</div>;
        })}
      </div>
    </div>
  );

  return <Wrapper>{content}</Wrapper>;
};

export default Template2;
