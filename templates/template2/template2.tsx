import { ResumeTemplate } from "@/types/templateTypes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Github, Globe, Linkedin } from "lucide-react";
import React from "react";

interface TemplateType {
  isPreview?: boolean;
  obj: ResumeTemplate;
  isLive?: boolean;
  modalPreview?: boolean;
}

type HeaderContent = {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  github?: string;
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

  const primaryTextColorClass = obj?.globalStyles?.primaryTextColor || "black";
  const primaryColorClass = obj?.globalStyles?.primaryColor || "black";

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
                      <p className="text-sm italic">{edu?.courseName}</p>
                    </div>
                    <div>
                      <p className="text-base text-right">
                        {edu?.location && edu?.location}
                      </p>
                      <p className="text-sm text-right italic">
                        {`${edu?.startMonth} ${edu.startYear} -`}
                        {edu?.endMonth} {edu?.endYear}
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
                            {exp?.startMonth}, {exp?.startYear} -{" "}
                            {exp?.endMonth}, {exp?.endYear}
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
            const skillsContent = item.content as SkillsContent;
            const columns = obj.sections.filter(
              (item) => item.type === "skills"
            )[0].style?.columns;
            return (
              <div className={`py-2`} key={index}>
                <div style={{ borderBottom: `1px solid ${primaryColorClass}` }}>
                  <h1
                    className="text-lg"
                    style={{ color: primaryTextColorClass }}
                  >
                    SKILLS
                  </h1>
                </div>
                {Array.isArray(skillsContent.content.skills) ? (
                  <div className={`mt-2 grid grid-cols-${columns}`}>
                    {skillsContent.content.skills.map((skill, index) => (
                      <li key={index} className="text-sm">
                        {skill}
                      </li>
                    ))}
                  </div>
                ) : (
                  <div
                    className="quill-content text-sm"
                    dangerouslySetInnerHTML={{
                      __html: skillsContent.content.skills,
                    }}
                  />
                )}
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

  const Wrapper = isPreview ? PreviewWrapper : FullSizeWrapper;

  return <Wrapper>{content}</Wrapper>;
};

export default Template2;
