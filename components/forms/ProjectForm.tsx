import { Id } from "@/convex/_generated/dataModel";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { debounce } from "lodash";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import QuillProjectEditor from "../QuillEditors/QuillProject";
import { ProjectSection } from "@/types/templateTypes";

interface ProjectType {
  name: string;
  description: string;
  githuburl: string;
  liveurl: string;
}

interface ProjectContent {
  projects: ProjectType[];
}

const ProjectForm = ({
  resumeId,
  item,
}: {
  resumeId: Id<"resumes">;
  item: ProjectSection;
}) => {
  const emptyProject: ProjectType = {
    name: "",
    description: "",
    githuburl: "",
    liveurl: "",
  };

  const [projects, setProjects] = useState<ProjectContent>({ projects: [] });
  const pendingChangesRef = useRef(false);
  const update = useMutation(api.resume.updateProjects);

  useEffect(() => {
    if (!pendingChangesRef.current) {
      setProjects(item?.content as ProjectContent);
    }
  }, [item?.content, pendingChangesRef]);

  const debouncedUpdate = useMemo(() => {
    return debounce((newProject: ProjectContent) => {
      update({ id: resumeId, content: newProject });
      pendingChangesRef.current = false;
    }, 400);
  }, [update, resumeId]);

  const handleChange = useCallback(  (index: number) =>
      (
        e: ChangeEvent<HTMLInputElement> | string,
        field?: keyof ProjectType
      ) => {
        pendingChangesRef.current = true;
        setProjects((prevProjects) => {
          const newProject = { ...prevProjects };
          if (typeof e === "string" && field) {
            newProject.projects[index][field] = e;
          } else if (typeof e !== "string") {
            newProject.projects[index][e.target.name as keyof ProjectType] =
              e.target.value;
          }
          debouncedUpdate(newProject);
          return newProject;
        });
      },
    [debouncedUpdate]
  );

  const addProject = () => {
    setProjects((prev) => ({
      ...prev,
      projects: [...prev.projects, emptyProject],
    }));
  };

  return (
    <>
      {projects?.projects.map((item, index) => {
        return (
          <div key={index}>
            <form className="mt-8">
              <div className="grid grid-cols-2 max-w-[85%]  gap-8">
                <InputField
                  label="Project Title"
                  name="name"
                  value={item.name}
                  onChange={handleChange(index)}
                  placeholder="Project Name"
                />
                <InputField
                  label="Github URL"
                  name="githuburl"
                  value={item.githuburl}
                  onChange={handleChange(index)}
                  placeholder="https://github.com/johndoe/portfolio"
                />
                <InputField
                  label="Live URL"
                  name="liveurl"
                  value={item.liveurl}
                  onChange={handleChange(index)}
                  placeholder="https://myproject.com/johndoe"
                />
              </div>
              <div className="mt-8 w-[85%]">
                <QuillProjectEditor
                  label="Project Description"
                  value={item.description}
                  projectTitle={item.name}
                  onChange={(content) =>
                    handleChange(index)(content, "description")
                  }
                />
              </div>
            </form>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.5,
                ease: [0, 0.71, 0.2, 1.01],
              }}
            >
              <Button onClick={addProject} className="mt-4">
                Add Another Project
              </Button>
            </motion.div>
          </div>
        );
      })}
    </>
  );
};

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
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
      <Label htmlFor={name} className="text-md">
        {label}
      </Label>
      <Input
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type="text"
        className="border border-muted-foreground"
      />
    </motion.div>
  );
};

export default ProjectForm;
