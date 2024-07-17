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

interface ExperienceItem {
  companyName: string;
  role: string;
  jobDescription: string;
  location: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
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
  }, [item?.content,pendingChangesRef]);

  const debouncedUpdate = useMemo(() => {
    return debounce((newExperience: ExperienceContent) => {
      update({ id: resumeId, content: newExperience });
      pendingChangesRef.current = false;
    }, 400);
  }, [update, resumeId]);

  const handleChange = useCallback(
    (index: number) =>
      (name: keyof ExperienceItem, value: string) => {
        pendingChangesRef.current = true;
        setExperience((prevExperience) => {
          const newExperience = { ...prevExperience };
          newExperience.experience[index][name] = value;
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

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "July", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());

  return (
    <>
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
            />
            <InputField
              label="End Year"
              name="endYear"
              value={exp.endYear}
              onChange={handleChange(index)}
              placeholder="Select Year or Present"
              type="select"
              options={[...years, "Present"]}
            />
          </div>
          <div className="mt-8 w-[85%]">
            <QuillExpEditor
              label="Job Description"
              companyName={exp.companyName}
              role={exp.role}
              value={exp.jobDescription}
              onChange={(content) => handleChange(index)("jobDescription", content)}
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
        <Button onClick={addExperience} className="mt-4 mb-8">
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
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  options,
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
        className="border bg-[transparent] border-muted-foreground p-2 rounded"
      >
        <option value="">{placeholder}</option>
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
        className="border border-muted-foreground"
      />
    )}
  </motion.div>
);

export default ExperienceForm;