"use client";

import {
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
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { EducationSection } from "@/types/templateTypes";

interface EducationItem {
  courseName: string;
  instituteName: string;
  location: string;
  startMonth : string;
  startYear :string;
  endMonth : string;
  endYear : string;
}

interface EducationContent {
  education: EducationItem[];
}

interface EducationFormProps {
  item: EducationSection;
  resumeId: Id<"resumes">;
}

const EducationForm = ({ item, resumeId }: EducationFormProps) => {

  const emptyEducation: EducationItem = {
    courseName: "",
    instituteName: "",
    location: "",
    startMonth:"",
    startYear:"",
    endMonth:"",
    endYear:""
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
  }, [item?.content,pendingChangesRef]);

  const debouncedUpdate = useMemo(() => {
    return debounce((newEducation: EducationContent) => {
      update({ id: resumeId, content: newEducation });
      pendingChangesRef.current = false;
    }, 400);
  }, [update, resumeId]);


  const handleChange = useCallback((index: number) =>(name: keyof EducationItem, value: string) => {
        pendingChangesRef.current = true;
        setEducation((prevEducation) => {
          const newEducation = { ...prevEducation };
          newEducation.education[index][name] = value;
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

  
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "July", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());

  return (
    <>
      {education?.education?.map((item, index) => {
        return (
          <motion.form key={index} className="mt-8">
            <div className="grid grid-cols-2 w-full max-w-[85%] gap-8">
              <InputField
                label="Institue Name"
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
            />
            <InputField
              label="End Year"
              name="endYear"
              value={item.endYear}
              onChange={handleChange(index)}
              placeholder="Select Year or Present"
              type="select"
              options={[...years, "Present"]}
            />
            </div>
          </motion.form>
        );
      })}
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
    </>
  );
};

interface InputFieldProps {
  label: string;
  name: keyof EducationItem;
  value: string;
  onChange: (name: keyof EducationItem, value: string) => void;
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
        <option value="" disabled>{placeholder}</option>
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


export default EducationForm;
