import { ResumeTemplate } from "@/types/templateTypes";
import { cn } from "@/lib/utils";
import { montserrat } from "@/utils/font";
import Link from "next/link";
import { Github, Globe } from "lucide-react";

interface TemplateType {
  isPreview?: boolean;
  obj: ResumeTemplate;
  isLive?: boolean;
}

const Template2 = ({ isPreview, obj, isLive }: TemplateType) => {
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

  const primaryTextColorClass = obj?.globalStyles?.primaryTextColor || "black";
  const primaryColorClass = obj?.globalStyles?.primaryColor || "black";

  const content = (
    <div
      id="resumeSection"
      className={cn(
        "bg-[white] py-8 overflow-scroll overflow-x-hidden w-[210mm] h-[297mm] px-8 ",
        isPreview &&
          "select-none cursor-pointer rounded-3xl transition duration-300 ease-in p-10 shadow-2xl border border-primary",
        isLive && "w-[210mm] h-[297mm]",
        isPreview && !isLive && "w-[795px] h-[1122px]"
      )}
    >
      <div>
        {/* HEADER SECTION */}
        {obj?.sections?.map((item, index) => {
          if (item?.type === "header") {
            return (
              <div key={index} className={`${montserrat.className}  `}>
                <h1
                  className="text-4xl text-center font-semibold"
                  style={{ color: primaryTextColorClass }}
                >
                  {item?.content?.firstName} {item?.content?.lastName}
                </h1>
                <div className="flex items-center justify-center gap-2">
                  {item?.content?.phone && <p>{`${item?.content?.phone} |`}  </p>}
                  {item?.content?.email && <p className="underline underline-offset-2">
                    {`${item?.content?.email} |`}
                  </p>}
                 {item?.content?.linkedin && <p className="underline underline-offset-2">
                    {`${item?.content?.linkedin} |`}
                  </p>}
                 {item?.content?.github && <a href={`https://github.com/${item?.content?.github}`} className="underline underline-offset-2">
                    {item?.content?.github}
                  </a>}
                </div>
              </div>
            );
          }
        })}

        {/* EDUCATION SECTION */}

        {obj?.sections?.map((item, index) => {
          if (item?.type === "education") {
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
                {item?.content?.education?.map((item, index) => (
                  <div
                    key={index}
                    className="flex mt-2 items-center justify-between"
                  >
                    <div>
                      <h1 className="text-base font-semibold">
                        {item?.instituteName}
                      </h1>
                      <p className="text-sm italic">{item?.courseName}</p>
                    </div>
                    <div>
                      <p className="text-base text-right">
                        {item?.location && item?.location}
                      </p>
                      <p className="text-sm text-right italic">
                        {item?.endDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );
          }
        })}

        {/* EXPERIENCE SECTION */}

        {obj?.sections?.map((item, index) => {
          if (item?.type === "experience") {
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
                {item?.content?.experience?.map((item, index) => (
                  <div key={index} className="mt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-base font-semibold">
                          {item?.role}
                        </h1>
                        <h1 className="text-sm italic">{item?.companyName}</h1>
                      </div>
                      <div className="text-right">
                        {item?.startDate && item?.endDate && (
                          <p className="text-base ">
                            {item?.startDate} - {item?.endDate}
                          </p>
                        )}{" "}
                        {item?.location && (
                          <p className="text-sm italic">{item?.location}</p>
                        )}
                      </div>
                    </div>
                    <div
                      className="quill-content text-sm"
                      dangerouslySetInnerHTML={{ __html: item?.jobDescription }}
                    />
                  </div>
                ))}
              </div>
            );
          }
        })}

        {/* EDUCATION SECTION */}
        {obj?.sections?.map((item, index) => {
          if (item?.type === "projects") {
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
                {item?.content?.projects?.map((item, index) => (
                  <div key={index} className="mt-2">
                    <div className="flex items-center justify-start gap-2">
                      <h1 className="text-base font-semibold">{item?.name}</h1>
                      {item?.githuburl && (
                        <Link href={item?.githuburl}>
                          <Github
                            size={16}
                            className={`cursor-pointer`}
                            style={{ color: primaryTextColorClass }}
                          />
                        </Link>
                      )}

                      {item?.liveurl && (
                        <Link href={item?.liveurl}>
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
                      dangerouslySetInnerHTML={{ __html: item?.description }}
                    />
                  </div>
                ))}
              </div>
            );
          }
        })}

        {/* SKILLS */}
        {obj?.sections?.map((item, index) => {
          if (item?.type === "skills") {
            return (
              <div className={`py-2`} key={index}>
                {" "}
                <div style={{ borderBottom: `1px solid ${primaryColorClass}` }}>
                  <h1
                    className="text-lg"
                    style={{ color: primaryTextColorClass }}
                  >
                    SKILLS
                  </h1>
                </div>
                {item?.content?.type === "list" && (
                  <div
                    className={`mt-2 grid grid-cols-${item?.style?.columns}`}
                  >
                    {item?.content?.content?.skills?.map((skill, index) => {
                      return (
                        <li key={index} className="text-sm">
                          {skill}
                        </li>
                      );
                    })}
                  </div>
                )}
                {item?.content?.type === "description" && (
                  <div
                    className="quill-content text-sm"
                    dangerouslySetInnerHTML={{
                      __html: item?.content?.content?.skills,
                    }}
                  />
                )}
              </div>
            );
          }
        })}
      </div>
    </div>
  );

  const Wrapper = isPreview ? PreviewWrapper : FullSizeWrapper;

  return <Wrapper>{content}</Wrapper>;
};

export default Template2;
