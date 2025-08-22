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
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { XIcon } from "lucide-react";
import { useChatBotStore } from "@/store";
import axios from "axios";
import toast from "react-hot-toast";
import ModifyModal from "../ModifyModal";
import { useUser } from "@clerk/nextjs";
import QuillEditorComponent from "../QuillEditors/QuillEditorComponent";

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
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useUser();

  const {
    pushText,
    pushTyping,
    removeTyping,
    desiredRole,
    experienceLevel,
    setResume,
    getResume,
    pushOptions,
    removeMessageById,
  } = useChatBotStore((state) => state);

  const resume = getResume(resumeId);

  const firstTimeRef = useRef(false);

  useEffect(() => {
    if (!pendingChangesRef.current) {
      setExperience(item?.content);
    }
  }, [item?.content, pendingChangesRef]);

  const debouncedUpdate = useMemo(() => {
    return debounce((newExperience: ExperienceContent) => {
      if (resume) {
        const updatedSections = resume.sections.map((section: any) =>
          section.type === "experience"
            ? { ...section, content: newExperience }
            : section
        );
        setResume(resumeId, { ...resume, sections: updatedSections });
      }
      pendingChangesRef.current = false;
    }, 400);
  }, [resume, setResume, resumeId]);

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

  const closeModifyModal = () => {
    setShowModifyModal(false);
    setTargetIndex(null);
  };

  const generateExperience = async (index: number) => {
    const currentExp = experience.experience[index];

    if (!currentExp.companyName || !currentExp.role) {
      toast.error(
        "Please fill in Company Name and Role before generating experience."
      );
      return;
    }

    if (!desiredRole || !experienceLevel) {
      toast.error("Onboarding incomplete! Please complete your profile setup.");
      return;
    }

    setShowModifyModal(true);
    setTargetIndex(index);
  };

  const handleGenerateFromRough = async (roughExperience: string) => {
    if (targetIndex === null) {
      toast.error("Target index not set. Please try again.");
      return;
    }

    const currentExp = experience.experience[targetIndex];

    if (!currentExp.companyName || !currentExp.role) {
      toast.error("Company name and role are required.");
      return;
    }

    setIsGenerating(true);
    setShowModifyModal(false);

    // Show typing indicator
    pushTyping("Generating professional experience descriptions...");

    try {
      // Determine intent based on whether the experience item at targetIndex has a description
      let intent: "edit" | "generate" = "generate";
      if (
        typeof targetIndex === "number" &&
        experience.experience[targetIndex] &&
        experience.experience[targetIndex].jobDescription &&
        experience.experience[targetIndex].jobDescription.trim() !== ""
      ) {
        intent = "edit";
      }

      const chatbotRequest = {
        message: {
          sender: "user",
          content: { type: "text", message: roughExperience },
        },
        userId: user?.id,
        resumeId: resumeId as Id<"resumes">,
        resume: resume,
        desiredRole: desiredRole,
        experienceLevel: experienceLevel,
        intent,
        section: "experience",
      };

      const response = await axios.post("/api/chatbot", chatbotRequest, {
        timeout: 30000, // 30 second timeout
        headers: {
          "Content-Type": "application/json",
        },
      });

      removeTyping();

      // Check if response is successful and contains updatedResume
      if (response.status !== 200 || !response.data?.updatedResume) {
        throw new Error(
          response.data?.error ||
            `Server responded with status: ${response.status}`
        );
      }

      // Find the updated experience section and update the job description for the relevant index
      const updatedSection = response.data.updatedResume.sections.find(
        (section: any) => section.type === "experience"
      );
      if (updatedSection && updatedSection.content?.experience?.[targetIndex]) {
        const updatedExp = updatedSection.content.experience[targetIndex];
        handleChange(targetIndex)("jobDescription", updatedExp.jobDescription);
      }
      // Optionally, update the whole resume in your store if needed
      setResume(resumeId, response.data.updatedResume);

      pushText(
        "✅ Professional experience descriptions have been generated and added to your resume!",
        "bot",
        { messageType: "success" }
      );

      toast.success("Experience generated successfully!");
    } catch (error) {
      removeTyping();
      console.error("Error generating experience:", error);

      // Handle different types of errors
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
        toast.error("Failed to generate experience. Please try again.");
      }

      pushText(
        "❌ Sorry, I couldn't generate the experience description. Please try again or write it manually.",
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
      {experience.experience.map((exp, index) => {
        if (
          exp.companyName &&
          exp.role &&
          !firstTimeRef.current &&
          (exp.jobDescription === undefined || exp.jobDescription.trim() === "")
        ) {
          const experienceText = [
            "Nice! Let's turn your role at this company into something impressive on your resume. Want help writing the job description?",
            `Got it — you've been working as a ${exp.role} at ${exp.companyName}! Want me to help generate a description for this experience?`,
            `Awesome! Ready to craft a powerful job description for your role at ${exp.companyName}?`,
            `Looks great so far. Want help turning your work at ${exp.companyName} into a standout bullet list?`,
          ];

          const noReplies = [
            "No problem. Writing it in your own words adds a personal touch. 😊",
            "That's totally fine. You know your experience best!",
            "Got it! Let me know if you need help polishing it later.",
            "Fair enough! I'm here if you ever change your mind. 😉",
          ];

          // Generate a unique id for the options message
          const optionId = `exp-option-${index}-${Date.now()}-${Math.random()}`;
          pushOptions(
            experienceText[Math.floor(Math.random() * experienceText.length)],
            [
              {
                label: "Yes, please!",
                value: "yes",
                onClick: () => {
                  removeMessageById(optionId);
                  generateExperience(index);
                },
              },
              {
                label: "No, thanks",
                value: "no",
                onClick: () => {
                  removeMessageById(optionId);
                  pushText(
                    noReplies[Math.floor(Math.random() * noReplies.length)],
                    "bot",
                    {
                      messageType: "info",
                    }
                  );
                },
              },
            ],
            "bot",
            "info",
            optionId
          );
          firstTimeRef.current = true;
        }

        return (
          <motion.form
            key={index}
            className="mt-8 relative bg-[radial-gradient(circle,_#fff_0%,_#ffe4e6_50%)] p-6 md:p-8 rounded-lg shadow-sm shadow-primary"
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
                  checked={exp.workingHere}
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
            <div className="mt-8 w-full md:w-[85%]">
              <QuillEditorComponent
                sectionType="experience"
                fullDescription={item.description}
                label="Job Description"
                value={exp.jobDescription}
                onChange={(content: string) =>
                  handleChange(index)("jobDescription", content)
                }
                placeholder="E.g., I worked on building websites for 3 years, handling mostly frontend work with React and collaborated with design teams"
                magicWrite={() => generateExperience(index)}
                requiredFieldLabel="Company Name"
                requiredFieldValue={exp.companyName}
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
        <Button
          onClick={addExperience}
          className="mt-4 md:mb-8"
          disabled={isGenerating}
        >
          Add Another Experience
        </Button>
      </motion.div>

      <AnimatePresence>
        {showModifyModal && (
          <ModifyModal
            heading="Experience Generator"
            text="Write a rough description of your experience, and we'll generate professional bullet points for you."
            label="Describe your experience"
            buttonText="Generate Professional Experience"
            closeModal={closeModifyModal}
            placeholder="E.g., I worked on building websites for 3 years, handling mostly frontend work with React and collaborated with design teams"
            onGenerate={handleGenerateFromRough}
          />
        )}
      </AnimatePresence>
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
