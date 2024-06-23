"use client";
import { cn } from "@/lib/utils";
import { temp1Obj as obj } from "@/templates/template1/temp1obj";
import { GitBranch, Github, Globe } from "lucide-react";
import Link from "next/link";

const Template1 = ({ size }: { size: "preview" | "full" }) => {
  const isPreview = size === "preview";

  const PreviewWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full overflow-hidden">
      <div className="transform scale-[0.4] origin-top-left w-full h-full">
        {children}
      </div>
    </div>
  );
  const FullSizeWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-center bg-slate-200">
      {children}
    </div>
  );

  const Wrapper = isPreview ? PreviewWrapper : FullSizeWrapper;

  const content = (
    <div
      className={cn(
        "bg-[white] py-8",
        isPreview &&
          "select-none cursor-pointer rounded-3xl transition duration-300 ease-in p-10 w-[900px] h-[1050px] shadow-2xl border border-primary "
      )}
    >
      <div className={cn("mx-auto")}>
        {/* HEADER */}
        <div className="border-b border-blue-500">
          <h1
            className={cn(
              "text-4xl text-center font-extrabold",
              obj?.globalStyles?.primaryTextColor
            )}
          >
            ADITYA RAI
          </h1>
          <div className="flex items-center justify-center gap-2 flex-wrap py-1">
            <h1>adityarai407@gmail.com</h1>
            <h1>+91 8369703972</h1>
            <h1>github.com/AdityaRai-24</h1>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="py-2 border-b border-blue-500">
          <h1
            className={cn(
              "text-xl font-bold",
              obj?.globalStyles?.primaryTextColor
            )}
          >
            SUMMARY
          </h1>
          <p className="text-base font-normal">
            Passionate and driven individual with a proficiency in both Frontend
            and Backend Development. Eager to learn and apply my skills in a
            collaborative environment
          </p>
        </div>

        {/* EXPERIENCE */}
        <div className="py-2 border-b border-blue-500">
          <h1
            className={cn(
              "text-xl font-bold",
              obj?.globalStyles?.primaryTextColor
            )}
          >
            EXPERIENCE
          </h1>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-md">WEB DEVELOPER</h1>
              <h1>02/2017 - 02/2019</h1>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-md">Google</h1>
              <h1>Mumbai</h1>
            </div>
            <div>
              <li>
                Implemented responsive design principles, ensuring a seamless
                experience across desktop, tablet, and mobile devices.
              </li>
            </div>
          </div>

          <div className="my-2">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-md">
                SENIOR SOFTWARE ENGINEER
              </h1>
              <h1>02/2010 - 02/2017</h1>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-md">Microsoft</h1>
              <h1>Mumbai</h1>
            </div>
            <div>
              <li>
                Engineered RESTful APIs using Express.js and PostgreSQL to
                support a high-traffic e-commerce platform, reducing response
                times by 50% through query optimization and efficient caching
                strategies.
              </li>
            </div>
          </div>
        </div>

        {/* TECHNICAL SKILLS */}
        <div className="py-2 border-b border-blue-500">
          <h1
            className={cn(
              "text-xl font-bold",
              obj?.globalStyles?.primaryTextColor
            )}
          >
            TECHNICAL SKILLS
          </h1>
          <div className={`grid grid-cols-3`}>
            <li>HTML , CSS</li> <li>Tailwind CSS</li>{" "}
            <li>Shadcn UI, Framer Motions</li>
            <li>Javascript</li>
            <li>Typescript</li>
            <li>React JS</li>
            <li> Redux Toolkit, Context AP</li> <li>Next.js</li>{" "}
            <li>Node JS, MongoDB</li>
            <li>Prisma, Rest APIs</li>
          </div>
        </div>

        {/* PROJECTS */}
        <div
          className={`py-2 border-b border-${obj?.globalStyles?.primaryColor}`}
        >
          <h1
            className={cn(
              "text-xl font-bold",
              obj?.globalStyles?.primaryTextColor
            )}
          >
            PROJECTS
          </h1>

          <div className="flex flex-col gap-3">
            <div>
              <div className="flex items-center gap-2 justify-start">
                <h1 className={cn("font-semibold text-md")}>
                  Engaging Quiz Platform with Google Gemini API Integration
                </h1>
                <Link href={"/"}>
                  <Github
                    size={20}
                    className={`cursor-pointer ${obj?.globalStyles?.primaryTextColor}`}
                  />
                </Link>
                <Link href={"/"}>
                  <Globe
                    size={20}
                    className={`cursor-pointer ${obj?.globalStyles?.primaryTextColor}`}
                  />
                </Link>
              </div>
              <p>
                Created an interactive quiz website using Next.js 14 to deliver
                an engaging learning experience. Key Features includety of
                question formats, including traditional MCQs and dynamic
                fill-in-the-blanks, to cater to diverse learning styles.
                NextAuth Integration : Ensured secure user authentication u :
                Ensured secure user authentication using NextAuth
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 justify-start">
                <h1 className={cn("font-semibold text-md")}>
                  Engaging Quiz Platform with Google Gemini API Integration
                </h1>
                <Link href={"/"}>
                  <Github
                    size={20}
                    className={`cursor-pointer ${obj?.globalStyles?.primaryTextColor}`}
                  />
                </Link>
                <Link href={"/"}>
                  <Globe
                    size={20}
                    className={`cursor-pointer ${obj?.globalStyles?.primaryTextColor}`}
                  />
                </Link>
              </div>
              <p>
                Created an interactive quiz website using Next.js 14 to deliver
                an engaging learning experience. Key Features includety of
                question formats, including traditional MCQs and dynamic
                fill-in-the-blanks, to cater to diverse learning styles.
                NextAuth Integration : Ensured secure user authentication u :
                Ensured secure user authentication using NextAuth
              </p>
            </div>
          </div>
        </div>

        {/* EDUCATION */}
        <div className="py-2 border-b border-blue-500">
          <h1
            className={cn(
              "text-xl font-bold",
              obj?.globalStyles?.primaryTextColor
            )}
          >
            EDUCATION
          </h1>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-semibold">
                  Btech In Information Technology
                </h1>
                <h1>Dwarkadas J Sanghvi College of Engineering</h1>
              </div>
              <div>
                <h1 className="font-bold">Nov 2022 - Present</h1>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );

  return <Wrapper>{content}</Wrapper>;
};

export default Template1;
