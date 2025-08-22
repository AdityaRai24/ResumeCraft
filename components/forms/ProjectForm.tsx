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
import { debounce } from "lodash";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectSection } from "@/types/templateTypes";
import { XIcon } from "lucide-react";
import { useChatBotStore } from "@/store";
import axios from "axios";
import toast from "react-hot-toast";
import ModifyModal from "../ModifyModal";
import { useUser } from "@clerk/nextjs";
import QuillEditorComponent from "../QuillEditors/QuillEditorComponent";

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
  item,
  resumeId,
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
  const {
    pushText,
    pushTyping,
    removeTyping,
    setResume,
    getResume,
  } = useChatBotStore();
  const resume = getResume(resumeId);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!pendingChangesRef.current) {
      setProjects(item?.content as ProjectContent);
    }
  }, [item?.content, pendingChangesRef]);

  const debouncedUpdate = useMemo(() => {
    return debounce((newProject: ProjectContent) => {
      if (resume) {
        const updatedSections = resume.sections.map((section: any) =>
          section.type === "projects"
            ? { ...section, content: newProject }
            : section
        );
        setResume(resumeId, { ...resume, sections: updatedSections });
      }
      pendingChangesRef.current = false;
    }, 400);
  }, [resume, setResume, resumeId]);

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
    const project = projects.projects[index];
    if (!project.name.trim()) {
      toast.error("Project Title is required to generate a description.");
      return;
    }
    setShowModifyModal(true);
    setTargetIndex(index);
  };

  const closeModifyModal = () => {
    setShowModifyModal(false);
    setTargetIndex(null);
  };

  const handleGenerateFromRough = async (roughProject: string) => {
    if (targetIndex === null) {
      toast.error("Target index not set. Please try again.");
      return;
    }
    const project = projects.projects[targetIndex];
    if (!project.name.trim()) {
      toast.error("Project Title is required.");
      return;
    }
    setIsGenerating(true);
    setShowModifyModal(false);
    pushTyping("Generating professional project description...");
    try {
      // Determine intent based on whether the project at targetIndex has a description
      let intent: "edit" | "generate" = "generate";
      if (
        typeof targetIndex === "number" &&
        projects.projects[targetIndex] &&
        projects.projects[targetIndex].description &&
        projects.projects[targetIndex].description.trim() !== ""
      ) {
        intent = "edit";
      }

      // Prepare chatbot request
      const resume = getResume(resumeId);
      // Get desiredRole and experienceLevel from the store (like ExperienceForm)
      const { desiredRole, experienceLevel } = useChatBotStore.getState();
      const chatbotRequest = {
        message: {
          sender: "user",
          content: { type: "text", message: roughProject }
        },
        userId: user?.id,
        resumeId: resumeId,
        resume: resume,
        desiredRole: desiredRole,
        experienceLevel: experienceLevel,
        intent,
        section: 'projects'
      };

      const response = await axios.post("/api/chatbot", chatbotRequest, {
        timeout: 30000,
        headers: { "Content-Type": "application/json" },
      });
      removeTyping();
      if (response.status !== 200 || !response.data?.updatedResume) {
        throw new Error(
          response.data?.error || `Server responded with status: ${response.status}`
        );
      }
      // Find the updated projects section and update the description for the relevant index
      const updatedSection = response.data.updatedResume.sections.find(
        (section: any) => section.type === "projects"
      );
      if (updatedSection && updatedSection.content?.projects?.[targetIndex]) {
        const updatedProj = updatedSection.content.projects[targetIndex];
        handleChange(targetIndex)(updatedProj.description, "description");
      }
      setResume(resumeId, response.data.updatedResume);
      pushText(
        "✅ Professional project description has been generated and added to your resume!",
        "bot",
        { messageType: "success" }
      );
      toast.success("Project description generated successfully!");
    } catch (error) {
      removeTyping();
      console.error("Error generating project description:", error);
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          toast.error("Request timed out. Please try again.");
        } else if (error.response?.status === 400) {
          toast.error(
            error.response.data?.error ||
              "Invalid request. Please check your input."
          );
        } else if (error.response?.status === 500) {
          toast.error("Server error. Please try again later.");
        } else if (error.response?.status === 503) {
          toast.error("Service temporarily unavailable. Please try again.");
        } else {
          toast.error(
            error.response?.data?.error ||
              "Network error. Please check your connection."
          );
        }
      } else {
        toast.error("Failed to generate project description. Please try again.");
      }
      pushText(
        "❌ Sorry, I couldn't generate the project description. Please try again or write it manually.",
        "bot",
        { messageType: "error" }
      );
    } finally {
      setIsGenerating(false);
      setTargetIndex(null);
    }
  };

  return (
    <>
      {projects?.projects.map((item, index) => {
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
                <QuillEditorComponent
                  label="Project Description"
                  value={item.description}
                  itemIndex={index}
                  magicWrite={() => generateProject(index)}
                  onChange={(content: string) => handleChange(index)(content, "description")}
                  requiredFieldLabel="Project Title"
                  requiredFieldValue={item.name}
                  sectionType="projects"
                  fullDescription={item.description}
                />
              </div>
            </form>
          </div>
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
        <Button onClick={addProject} className="my-4" disabled={isGenerating}>
          Add Another Project
        </Button>
      </motion.div>

      <AnimatePresence>
        {showModifyModal && (
          <ModifyModal
            heading="Project Description Generator"
            text="Write a rough description of your project, and we'll generate professional bullet points for you."
            label="Describe your project"
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
