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
import { motion, AnimatePresence } from "framer-motion";
import QuillProjectEditor from "../QuillEditors/QuillProject";
import { ProjectSection } from "@/types/templateTypes";
import { XIcon } from "lucide-react";
import { useChatBotStore } from "@/store";
import axios from "axios";
import toast from "react-hot-toast";
import ChatBotModal from "../ChatBotModal";
import ModifyModal from "../ModifyModal";
import ChatBotProject from "../ChatBotProject";

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
  const firstTimeRef = useRef(false);
  const { pushOptions, pushText } = useChatBotStore();
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [isGeneratingProject, setIsGeneratingProject] = useState(false);
  const [generatedProjects, setGeneratedProjects] = useState<any[]>([]);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

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

  const handleChange = useCallback(
    (index: number) =>
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

  const removeProject = useCallback(
    (index: number) => {
      setProjects((prev) => {
        const newProjects = {
          ...prev,
          projects: prev.projects.filter((_, i) => i !== index),
        };
        debouncedUpdate(newProjects);
        return newProjects;
      });
    },
    [debouncedUpdate]
  );

  const generateProject = (index: number) => {
    setShowModifyModal(true);
    setTargetIndex(index);
  };

  const closeModal = () => {
    setShowProjectModal(false);
    setTargetIndex(null);
  };

  const closeModifyModal = () => {
    setShowModifyModal(false);
  };

  const handleGenerateFromRough = async (roughProject: string) => {
    if (!roughProject.trim() || targetIndex === null) return;

    setShowModifyModal(false);
    setShowProjectModal(true);
    setIsGeneratingProject(true);

    try {
      const response = await axios.post("/api/generateProject", {
        desiredRole: useChatBotStore.getState().onboardingData.desiredRole,
        experienceLevel: useChatBotStore.getState().onboardingData.experienceLevel,
        projectName: projects.projects[targetIndex].name,
        roughProject: roughProject,
      });
      setGeneratedProjects(response.data.generatedProjects);
      setIsGeneratingProject(false);
    } catch (error) {
      console.log(error);
      setIsGeneratingProject(false);
      toast.error("Failed to generate project descriptions. Please try again.");
    }
  };

  const selectProject = (projectText: string, title: string) => {
    if (targetIndex !== null) {
      handleChange(targetIndex)(projectText, "description");
      closeModal();
      pushText(`✅ "${title}" project description has been added to your resume!`, "bot");
    }
  };

  const noReplies = [
    "No problem. Writing it in your own words adds a personal touch. 😊",
    "That's totally fine. You know your project best!",
    "Got it! Let me know if you need help polishing it later.",
    "Fair enough! I'm here if you ever change your mind. 😉",
  ];

  return (
    <>
      {projects?.projects.map((item, index) => {
        if (item.name && !firstTimeRef.current) {
          const projectText = [
            "Nice! Let's turn your project into something impressive on your resume. Want help writing the project description?",
            `Got it — you've worked on ${item.name}! Want me to help generate a description for this project?`,
            `Awesome! Ready to craft a powerful description for your ${item.name} project?`,
            `Looks great so far. Want help turning your ${item.name} project into a standout description?`,
          ];

          pushOptions(
            projectText[Math.floor(Math.random() * projectText.length)],
            [
              {
                label: "Yes, please!",
                value: "yes",
                onClick: () => {
                  generateProject(index);
                },
              },
              {
                label: "No, thanks",
                value: "no",
                onClick: () => {
                  pushText(
                    noReplies[Math.floor(Math.random() * noReplies.length)],
                    "bot"
                  );
                },
              },
            ]
          );
          firstTimeRef.current = true;
        }

        return (
          <div key={index}>
            <form className="mt-8 relative bg-[radial-gradient(circle,_#fff_0%,_#ffe4e6_50%)] p-6 rounded-lg shadow-xs shadow-primary">
              {index !== 0 && (
                <XIcon
                  width={20}
                  onClick={() => removeProject(index)}
                  className="right-8 top-4 absolute cursor-pointer"
                />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 w-full md:max-w-[85%] gap-6 md:gap-8">
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
              <div className="mt-8 w-full  md:w-[85%]">
                <QuillProjectEditor
                  label="Project Description"
                  value={item.description}
                  projectTitle={item.name}
                  magicWrite={() => generateProject(index)}
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
              <Button onClick={addProject} className="my-4">
                Add Another Project
              </Button>
            </motion.div>
          </div>
        );
      })}

      <AnimatePresence>
        {showProjectModal && (
          <ChatBotProject
            isGenerating={isGeneratingProject}
            generatedContent={generatedProjects}
            selectOption={selectProject}
            closeModal={closeModal}
            title="Project Description Options"
            loadingText="Crafting project description options..."
          />
        )}
        {showModifyModal && (
          <ModifyModal
            heading="Project Description Generator"
            text="Write a rough description of your project, and we'll generate professional versions for you."
            label="Write your project description roughly"
            buttonText="Generate Professional Description"
            closeModal={closeModifyModal}
            placeholder="E.g., I built a full-stack e-commerce website with React and Node.js"
            onGenerate={handleGenerateFromRough}
          />
        )}
      </AnimatePresence>
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
        className="border bg-[#FFF5F5] border-muted-foreground"
      />
    </motion.div>
  );
};

export default ProjectForm;
