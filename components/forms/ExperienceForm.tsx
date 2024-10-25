import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { debounce } from "lodash";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import QuillExpEditor from "../QuillEditors/QuillExp";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { XIcon } from "lucide-react";

interface ExperienceItem {
  companyName: string;
  role: string;
  jobDescription: string;
  location: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  workingHere: boolean;
}

interface ExperienceContent {
  experience: ExperienceItem[];
}

const emptyExperienceItem: ExperienceItem = {
  companyName: "",
  role: "",
  jobDescription: "",
  location: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  workingHere: false,
};

const ExperienceForm = ({
  resumeId,
  item,
}: {
  resumeId: Id<"resumes">;
  item: any;
}) => {
  const pendingChangesRef = useRef(false);
  const [experience, setExperience] = useState<ExperienceContent>({
    experience: [],
  });
  const update = useMutation(api.resume.updateExperience);

  useEffect(() => {
    if (!pendingChangesRef.current) {
      setExperience(item?.content);
    }
  }, [item?.content, pendingChangesRef]);

  const debouncedUpdate = useMemo(() => {
    return debounce((newExperience: ExperienceContent) => {
      update({ id: resumeId, content: newExperience });
      pendingChangesRef.current = false;
    }, 400);
  }, [update, resumeId]);

  const handleChange = useCallback(
    (index: number) =>
      (name: keyof ExperienceItem, value: string | boolean) => {
        pendingChangesRef.current = true;
        setExperience((prevExperience) => {
          const newExperience = { ...prevExperience };
          const updatedItem = { ...newExperience.experience[index] };

          if (name === "workingHere") {
            updatedItem.workingHere = value as boolean;
            if (updatedItem.workingHere) {
              updatedItem.endMonth = "";
              updatedItem.endYear = "Present";
            }
          } else {
            updatedItem[name] = value as string;
          }
          newExperience.experience[index] = updatedItem;
          debouncedUpdate(newExperience);
          return newExperience;
        });
      },
    [debouncedUpdate]
  );

  const addExperience = () => {
    setExperience((prev) => ({
      experience: [...prev.experience, emptyExperienceItem],
    }));
  };

  const removeEducation = useCallback(
    (index: number) => {
      setExperience((prev) => {
        const newExperience = {
          ...prev,
          experience: prev.experience.filter((_, i) => i !== index),
        };
        debouncedUpdate(newExperience);
        return newExperience;
      });
    },
    [debouncedUpdate]
  );

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) =>
    (currentYear - i).toString()
  );

  return (
    <>
      {experience.experience.map((exp, index) => (
        <motion.form
          key={index}
          className="mt-8 relative bg-[radial-gradient(circle,_#fff_0%,_#ffe4e6_50%)] p-6 md:p-8 rounded-lg shadow shadow-primary"
        >
          {index !== 0 && (
            <XIcon
              width={20}
              onClick={() => removeEducation(index)}
              className="right-8 top-4 absolute cursor-pointer"
            />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 w-full md:max-w-[85%] gap-6 md:gap-8">
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
              label="Start Month"
              name="startMonth"
              value={exp.startMonth}
              onChange={handleChange(index)}
              placeholder="Select Month"
              type="select"
              options={months}
            />
            <InputField
              label="Start Year"
              name="startYear"
              value={exp.startYear}
              onChange={handleChange(index)}
              placeholder="Select Year"
              type="select"
              options={years}
            />
            <InputField
              label="End Month"
              name="endMonth"
              value={exp.endMonth}
              onChange={handleChange(index)}
              placeholder="Select Month"
              type="select"
              options={months}
              disabled={exp.workingHere}
            />
            <InputField
              label="End Year"
              name="endYear"
              value={exp.endYear}
              onChange={handleChange(index)}
              placeholder="Select Year or Present"
              type="select"
              options={[...years, "Present"]}
              disabled={exp.workingHere}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.5,
                ease: [0, 0.71, 0.2, 1.01],
              }}
              className="flex items-center md:mt-8 space-x-2"
            >
              <Checkbox
                id={`workingHere-${index}`}
                checked={item.workingHere}
                onCheckedChange={(checked) =>
                  handleChange(index)("workingHere", checked)
                }
              />
              <Label
                htmlFor={`workingHere-${index}`}
                className="text-lg font-normal"
              >
                I currently work here
              </Label>
            </motion.div>
          </div>
          <div className="mt-8 w-full  md:w-[85%]">
            <QuillExpEditor
              label="Job Description"
              companyName={exp.companyName}
              role={exp.role}
              value={exp.jobDescription}
              onChange={(content) =>
                handleChange(index)("jobDescription", content)
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
        <Button onClick={addExperience} className="mt-4 md:mb-8">
          Add Another Experience
        </Button>
      </motion.div>
    </>
  );
};

interface InputFieldProps {
  label: string;
  name: keyof ExperienceItem;
  value: string;
  onChange: (name: keyof ExperienceItem, value: string) => void;
  placeholder: string;
  type?: string;
  options?: string[];
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  options,
  disabled = false,
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
    {type === "select" ? (
      <select
        name={name}
        id={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="border bg-[#FFF5F5] border-muted-foreground p-2 rounded"
        disabled={disabled}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ) : (
      <Input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className="border bg-[#FFF5F5] border-muted-foreground"
        disabled={disabled}
      />
    )}
  </motion.div>
);

export default ExperienceForm;
