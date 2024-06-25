import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Input } from "../ui/input";
import { Id } from "@/convex/_generated/dataModel";
import { debounce } from "lodash";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { motion } from "framer-motion";

const SkillsForm = ({
  item,
  resumeId,
  styles,
}: {
  item: any;
  resumeId: Id<"resumes">;
  styles: any;
}) => {
  const initialSkillPlaceholders = [
    "HTML, CSS, Bootstrap",
    "React JS, Javascript, Typescript",
    "Node JS, Express JS",
    "Mongo DB, Firebase",
    "AWS, GCP, Azure",
    "Docker, Kubernetes",
  ];

  interface SkillContent {
    skills: string[];
  }

  const [skills, setSkills] = useState<SkillContent>({
    skills: Array(6).fill(""),
  });
  const [columns, setColumns] = useState<number>(2);
  const pendingChangesRef = useRef(false);

  const update = useMutation(api.resume.updateSkills);

  useEffect(() => {
    if (!pendingChangesRef.current) {
      const contentSkills = item?.content?.skills || [];
      setSkills({
        skills: [
          ...contentSkills,
          ...Array(Math.max(6 - contentSkills.length, 0)).fill(""),
        ],
      });
      setColumns(styles?.columns || 2);
    }
  }, [item?.content?.skills, styles?.columns]);

  const debouncedUpdate = useMemo(() => {
    return debounce((newSkills: SkillContent, newColumns?: number) => {
      update({ id: resumeId, content: newSkills, columns: newColumns });
      pendingChangesRef.current = false;
    }, 400);
  }, [update, resumeId]);

  const handleChange = useCallback(
    (index: number, value: string) => {
      pendingChangesRef.current = true;
      setSkills((prevSkills) => {
        const newSkills = [...prevSkills.skills];
        newSkills[index] = value;
        const updatedSkills = {
          skills: newSkills.filter((skill) => skill !== ""),
        };
        debouncedUpdate(updatedSkills, columns);
        return { skills: newSkills };
      });
    },
    [debouncedUpdate, columns]
  );

  const handleColumnChange = useCallback(
    (e: string) => {
      const newColumns = Number(e);
      setColumns(newColumns);
      update({ id: resumeId, content: skills, columns: newColumns });
    },
    [resumeId, update, skills]
  );

  const addSkillField = () => {
    setSkills((prevSkills) => ({
      skills: [...prevSkills.skills, ""],
    }));
  };

  return (
    <>
      <form className="mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <Label>Number of Columns</Label>
          <Select
            onValueChange={(e) => handleColumnChange(e)}
            value={columns.toString()}
          >
            <SelectTrigger className="w-[40.4%] mt-2 mb-8 border border-muted-foreground">
              <SelectValue placeholder="Number of Columns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
        <div className="grid grid-cols-2 w-full max-w-[85%] gap-8">
          {skills.skills.map((skill, index) => (
            <InputField
              key={index}
              name={`skill-${index}`}
              value={skill}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={initialSkillPlaceholders[index] || "Enter a skill"}
              type="text"
            />
          ))}
        </div>{" "}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <Button type="button" onClick={addSkillField} className="mt-4">
            Add More Skills
          </Button>
        </motion.div>
      </form>
    </>
  );
};

interface InputFieldProps {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  value,
  onChange,
  placeholder,
  type,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
      className="flex flex-col justify-center gap-2"
    >
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        className="border border-muted-foreground"
      />
    </motion.div>
  );
};

export default SkillsForm;
