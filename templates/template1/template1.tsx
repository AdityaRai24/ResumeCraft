"use client";
import { cn } from "@/lib/utils";
import { ResumeTemplate } from "@/types/templateTypes";
import {
  GitBranch,
  Github,
  Globe,
  Linkedin,
  Mail,
  PhoneCall,
} from "lucide-react";
import Link from "next/link";

interface TemplateType {
  isPreview?: boolean;
  obj: ResumeTemplate;
  isLive?: boolean;
}

const Template1 = ({ isPreview, obj, isLive }: TemplateType) => {
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

  const content = (
    <div
      id="resumeSection"
      className={cn(
        "bg-[white] py-8 drop-shadow-2xl  w-[210mm] h-[296.4mm] mb-[100px] no-scrollbar px-8 overflow-scroll overflow-x-hidden",
        isPreview &&
          "select-none cursor-pointer rounded-3xl transition duration-300 ease-in p-10 shadow-2xl border border-primary",
        isLive && "w-[210mm] h-[297mm]",
        isPreview && !isLive && "w-[795px] h-[1122px]"
      )}
    >
      <div className={cn("mx-auto")}>
        {/* HEADER */}
        {obj?.sections?.map((item, index) => {
          if (item?.type === "header") {
            return (
              <div key={index}>
                <div
                  className={`py-0 border-b `}
                  style={{ borderBottom: `1px solid ${primaryColorClass}` }}
                >
                  {" "}
                  <>
                    <h1
                      className={`text-4xl uppercase text-center font-bold`}
                      style={{ color: primaryTextColorClass }}
                    >
                      {item?.content?.firstName} {item?.content?.lastName}
                    </h1>
                    <div className="flex items-center justify-center gap-4 flex-wrap pt-1 pb-2">
                      {item?.content?.email && (
                        <h1 className="flex !items-center justify-center gap-1">
                          <Mail size={16} />{" "}
                          <span className="text-sm">
                            {item?.content?.email}
                          </span>
                        </h1>
                      )}
                      {item?.content?.phone && (
                        <h1 className="flex items-center justify-center gap-1">
                          <PhoneCall size={16} />
                          <span className="text-sm">
                            {item?.content?.phone}
                          </span>
                        </h1>
                      )}
                      {item?.content?.github && (
                        <h1 className="flex items-center justify-center gap-1">
                          <Github size={16} />
                          <span className="text-sm">
                            {item?.content?.github}
                          </span>
                        </h1>
                      )}
                      {item?.content?.linkedin && (
                        <h1 className="flex items-center justify-center gap-1">
                          <Linkedin size={16} />
                          <span className="text-sm">
                            {item?.content?.linkedin}
                          </span>
                        </h1>
                      )}
                    </div>
                  </>
                </div>

                {/* SUMMARY */}
                <div
                  className={`py-2 border-b `}
                  style={{ borderBottom: `1px solid ${primaryColorClass}` }}
                >
                  {" "}
                  <h1
                    className={`text-lg font-bold `}
                    style={{ color: primaryTextColorClass }}
                  >
                    SUMMARY
                  </h1>
                  <div
                    className="text-sm font-normal"
                    dangerouslySetInnerHTML={{
                      __html: item?.content?.summary || "",
                    }}
                  />
                </div>
              </div>
            );
          }
        })}

        {/* EXPERIENCE */}
        <div
          className={`border-b  py-2`}
          style={{ borderBottom: `1px solid ${primaryColorClass}` }}
        >
          <h1
            className={`text-lg font-bold `}
            style={{ color: primaryTextColorClass }}
          >
            EXPERIENCE
          </h1>
          {obj?.sections?.map((item) => {
            if (item?.type === "experience") {
              return item?.content?.experience?.map((exp, index) => {
                return (
                  <div key={index} className="pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <h1 className="font-semibold text-md">
                        {exp?.role}, {exp?.companyName}
                      </h1>
                      <div className="flex items-center text-sm gap-2">
                        {exp?.startDate && exp?.endDate && (
                          <h1>
                            {exp?.startDate} - {exp?.endDate}
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
              });
            }
          })}
        </div>

        {/* TECHNICAL SKILLS */}
        {obj?.sections?.map((item, index) => {
          if (item?.type === "skills") {
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
                  TECHNICAL SKILLS
                </h1>
                <div
                  className={`grid grid-cols-${item?.style?.columns ? item?.style?.columns : "2"}`}
                >
                  {item?.content?.skills?.map((skill, index) => {
                    return (
                      <li key={index} className="text-sm">
                        {skill}
                      </li>
                    );
                  })}
                </div>
              </div>
            );
          }
        })}

        {/* PROJECTS */}
        {obj?.sections?.map((item, index) => {
          if (item?.type === "projects") {
            return (
              <>
                <div
                  className={`py-2 border-b `}
                  style={{ borderBottom: `1px solid ${primaryColorClass}` }}
                  key={index}
                >
                  <h1
                    className={`text-lg font-bold `}
                    style={{ color: primaryTextColorClass }}
                  >
                    PROJECTS
                  </h1>

                  <div className="flex flex-col gap-3">
                    {item?.content?.projects?.map((project, index) => {
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
                            className="text-sm"
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
          }
        })}

        {/* EDUCATION */}
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
          {obj?.sections?.map((item, index) => {
            if (item.type === "education") {
              return (
                <div key={index} className="flex flex-col gap-1">
                  {item?.content?.education.map((edu, index2) => {
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
                          {edu?.startDate && edu?.endDate && (
                            <h1 className="font-bold text-sm">
                              {edu?.startDate} - {edu?.endDate}
                            </h1>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );

  return <Wrapper>{content}</Wrapper>;
};

export default Template1;
