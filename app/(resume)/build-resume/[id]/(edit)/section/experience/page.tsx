"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { montserrat } from "@/utils/font";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import debounce from "lodash/debounce";
import QuillEditorComponent from "@/components/QuillEditor";
import { Button } from "@/components/ui/button";
import SectionInfo from "@/components/SectionInfo";
import { container } from "@/lib/motion";
import { motion } from "framer-motion";

interface ExperienceItem {
  companyName: string;
  role: string;
  jobDescription: string;
  location: string;
  startDate: string;
  endDate: string;
}

interface ExperienceContent {
  experience: ExperienceItem[];
}

const emptyExperienceItem: ExperienceItem = {
  companyName: "",
  role: "",
  jobDescription: "",
  location: "",
  startDate: "",
  endDate: "",
};

const Page = () => {
  const [experience, setExperience] = useState<ExperienceContent>({
    experience: [],
  });
  const update = useMutation(api.resume.updateExperience);
  const params = useParams();
  const resumeId = params.id as Id<"resumes">;
  const pendingChangesRef = useRef(false);
  const resume = useQuery(api.resume.getTemplateDetails, { id: resumeId });

  useEffect(() => {
    if (resume?.sections && !pendingChangesRef.current) {
      const experienceSection = resume.sections.find(
        (item) => item.type === "experience"
      );
      if (experienceSection?.content) {
        const savedExperience = (experienceSection.content as ExperienceContent)
          .experience;
        setExperience({ experience: savedExperience });
      }
    }
  }, [resume?.sections]);

  const debouncedUpdate = useMemo(() => {
    return debounce((newExperience: ExperienceContent) => {
      update({ id: resumeId, content: newExperience });
      pendingChangesRef.current = false;
    }, 400);
  }, [update, resumeId]);

  const handleChange = useCallback(
    (index: number) =>
      (
        e: ChangeEvent<HTMLInputElement> | string,
        field?: keyof ExperienceItem
      ) => {
        pendingChangesRef.current = true;
        setExperience((prevExperience) => {
          const newExperience = { ...prevExperience };
          if (typeof e === "string" && field) {
            newExperience.experience[index][field] = e;
          } else if (typeof e !== "string") {
            const { name, value } = e.target;
            newExperience.experience[index][name as keyof ExperienceItem] =
              value;
          }
          debouncedUpdate(newExperience);
          return newExperience;
        });
      },
    [debouncedUpdate]
  );

  const addExperience = () => {
    setExperience((prev) => ({
      ...prev,
      experience: [...prev.experience, emptyExperienceItem],
    }));
  };

  if (resume === null) {
    return <div>Template not found</div>;
  }

  if (resume === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {resume.sections?.map((item, idx) => {
        if (item?.type === "experience") {
          return (
            <div key={idx} className="mt-24 mx-16">
              <SectionInfo
                heading={"Let's work on your experience."}
                text={"Start with your most recent job first."}
              />

              {experience.experience.map((exp, index) => (
                <motion.form key={index} className="mt-8">
                  <div className="grid grid-cols-2 w-full max-w-[85%] gap-8">
                    <InputField
                      label="Company Name"
                      name="companyName"
                      value={exp.companyName}
                      onChange={handleChange(index)}
                      placeholder="Microsoft"
                    />
                    <InputField
                      label="Role"
                      name="role"
                      value={exp.role}
                      onChange={handleChange(index)}
                      placeholder="Software Developer"
                    />
                    <InputField
                      label="Location"
                      name="location"
                      value={exp.location}
                      onChange={handleChange(index)}
                      placeholder="New York, NY"
                    />
                    <InputField
                      label="Start Date"
                      name="startDate"
                      value={exp.startDate}
                      onChange={handleChange(index)}
                      placeholder="YYYY-MM"
                      type="month"
                    />
                    <InputField
                      label="End Date"
                      name="endDate"
                      value={exp.endDate}
                      onChange={handleChange(index)}
                      placeholder="YYYY-MM or Present"
                      type="month"
                    />
                  </div>
                  <div className="mt-8 w-[85%]">
                    <QuillEditorComponent
                      label="Job Description"
                      value={exp.jobDescription}
                      onChange={(content) =>
                        handleChange(index)(content, "jobDescription")
                      }
                    />
                  </div>
                </motion.form>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.5,
                  ease: [0, 0.71, 0.2, 1.01],
                }}
              >
                <Button onClick={addExperience} className="mt-4">
                  Add Another Experience
                </Button>
              </motion.div>
            </div>
          );
        }
        return null;
      })}
    </>
  );
};
interface InputFieldProps {
  label: string;
  name: keyof ExperienceItem;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
    className="flex flex-col justify-center gap-2"
  >
    <Label htmlFor={name} className="text-md">
      {label}
    </Label>
    <Input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border border-muted-foreground"
    />
  </motion.div>
);

export default Page;
