"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import debounce from "lodash/debounce";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { EducationSection } from "@/types/templateTypes";
import { Checkbox } from "../ui/checkbox";
import { XIcon } from "lucide-react";

interface EducationItem {
  courseName: string;
  instituteName: string;
  location: string;
  grade: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  studyingHere: boolean;
}

interface EducationContent {
  education: EducationItem[];
}

interface EducationFormProps {
  item: EducationSection;
  resumeId: Id<"resumes">;
}

const EducationForm: React.FC<EducationFormProps> = ({ item, resumeId }) => {
  const emptyEducation: EducationItem = {
    courseName: "",
    instituteName: "",
    location: "",
    grade: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    studyingHere: false,
  };

  const [education, setEducation] = useState<EducationContent>({
    education: [],
  });
  const pendingChangesRef = useRef(false);
  const update = useMutation(api.resume.updateEducation);

  useEffect(() => {
    if (!pendingChangesRef.current) {
      setEducation(item?.content as EducationContent);
    }
  }, [item?.content, pendingChangesRef]);

  const debouncedUpdate = useMemo(() => {
    return debounce((newEducation: EducationContent) => {
      update({ id: resumeId, content: newEducation });
      pendingChangesRef.current = false;
    }, 400);
  }, [update, resumeId]);

  const handleChange = useCallback(
    (index: number) => (name: keyof EducationItem, value: string | boolean) => {
      pendingChangesRef.current = true;
      setEducation((prevEducation) => {
        const newEducation = { ...prevEducation };
        const updatedItem = { ...newEducation.education[index] };

        if (name === "studyingHere") {
          updatedItem.studyingHere = value as boolean;
          if (updatedItem.studyingHere) {
            updatedItem.endMonth = "";
            updatedItem.endYear = "Present";
          }
        } else {
          updatedItem[name] = value as string;
        }

        newEducation.education[index] = updatedItem;
        debouncedUpdate(newEducation);
        return newEducation;
      });
    },
    [debouncedUpdate]
  );

  const addEducation = () => {
    setEducation((prev) => ({
      education: [...prev.education, emptyEducation],
    }));
  };

  const removeEducation = useCallback(
    (index: number) => {
      setEducation((prev) => {
        const newEducation = {
          ...prev,
          education: prev.education.filter((_, i) => i !== index),
        };
        debouncedUpdate(newEducation);
        return newEducation;
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
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) =>
    (currentYear - i).toString()
  );

  return (
    <div className="mb-16">
      {education?.education?.map((item, index) => (
        <motion.form
          key={index}
          className="mt-8 relative bg-[radial-gradient(circle,_#fff_0%,_#ffe4e6_50%)] p-6 rounded-lg shadow shadow-primary"
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
              label="Institute Name"
              name="instituteName"
              value={item.instituteName}
              onChange={handleChange(index)}
              placeholder="University of California, Berkeley"
            />
            <InputField
              label="Course Name"
              name="courseName"
              value={item.courseName}
              onChange={handleChange(index)}
              placeholder="Bachelor of Science"
            />
            <InputField
              label="Location"
              name="location"
              value={item.location}
              onChange={handleChange(index)}
              placeholder="California, USA"
            />
            <InputField
              label="Grade"
              name="grade"
              value={item.grade}
              onChange={handleChange(index)}
              placeholder="8.2 CGPA"
            />
            <InputField
              label="Start Month"
              name="startMonth"
              value={item.startMonth}
              onChange={handleChange(index)}
              placeholder="Select Month"
              type="select"
              options={months}
            />
            <InputField
              label="Start Year"
              name="startYear"
              value={item.startYear}
              onChange={handleChange(index)}
              placeholder="Select Year"
              type="select"
              options={years}
            />
            <InputField
              label="End Month"
              name="endMonth"
              value={item.endMonth}
              onChange={handleChange(index)}
              placeholder="Select Month"
              type="select"
              options={months}
              disabled={item.studyingHere}
            />
            <InputField
              label="End Year"
              name="endYear"
              value={item.endYear}
              onChange={handleChange(index)}
              placeholder="Select Year or Present"
              type="select"
              options={[...years, "Present"]}
              disabled={item.studyingHere}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.5,
                ease: [0, 0.71, 0.2, 1.01],
              }}
              className="flex items-center space-x-2"
            >
              <Checkbox
                id={`studyingHere-${index}`}
                checked={item.studyingHere}
                onCheckedChange={(checked) =>
                  handleChange(index)("studyingHere", checked)
                }
              />
              <Label
                htmlFor={`studyingHere-${index}`}
                className="text-lg font-normal"
              >
                I currently study here
              </Label>
            </motion.div>
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
        <Button onClick={addEducation} className="mt-4">
          Add Another Education
        </Button>
      </motion.div>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  name: keyof EducationItem;
  value: string;
  onChange: (name: keyof EducationItem, value: string) => void;
  placeholder: string;
  type?: "text" | "select";
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

export default EducationForm;
