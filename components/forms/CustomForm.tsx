import { Id } from "@/convex/_generated/dataModel";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import QuillCustomEditor from "../QuillEditors/QuillCustom";
import { Button } from "../ui/button";
import { debounce } from "lodash";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  XIcon,
  ArrowLeftCircle,
  ArrowRightCircle,
  XCircle,
} from "lucide-react";
import { useChatBotStore } from "@/store";
import axios from "axios";
import toast from "react-hot-toast";
import ModifyModal from "../ModifyModal";
import CustomSectionTypeSelector from "../CustomSectionTypeSelector";
import { useUser } from "@clerk/nextjs";

const CustomForm = ({
  resumeId,
  styles,
  item,
}: {
  resumeId: Id<"resumes">;
  styles: string;
  item: any;
}) => {
  interface SectionItem {
    sectionTitle: string;
    sectionDescription: string;
    sectionNumber: number;
    sectionDirection: "left" | "right";
    sectionType?: string;
  }

  const [sectionsContent, setSectionsContent] = useState<SectionItem[]>([]);
  const [isChoosingDirection, setIsChoosingDirection] = useState(false);
  const pendingChangesRef = useRef(false);
  const { pushText, pushTyping, removeTyping, setResume, getResume } =
    useChatBotStore();
  const update = useMutation(api.resume.updateCustomSection);
  const resume = getResume(resumeId);
  const isTwoColumn = resume?.globalStyles.columns === 2;
  const removeSectionUpdate = useMutation(api.resume.removeCustomSection);
  
  // Magic write states
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSectionType, setSelectedSectionType] = useState("other");
  const { user } = useUser();

  const addSection = (direction: "left" | "right" = "left") => {
    const newSection: SectionItem = {
      sectionTitle: "",
      sectionDescription: "",
      sectionNumber: sectionsContent.length + 1,
      sectionDirection: direction,
      sectionType: "other",
    };

    setSectionsContent((prev) => [...prev, newSection]);
    setIsChoosingDirection(false);
  };

  console.log(item);

  const debouncedUpdate = useMemo(() => {
    return debounce((newSection: SectionItem[], index: number) => {
      const resume = getResume(resumeId);
      if (resume) {
        const content = newSection[index];
        const resumeSections = resume?.sections;
        const customSection = resumeSections.filter(
          (item: any) => item.type === "custom"
        );
        const currentCustomSectionIndex = customSection.findIndex(
          (item: any) => item.content.sectionNumber === content.sectionNumber
        );

        const allOrderNumbers: any =
          resumeSections?.map((item: any) => item.orderNumber) || [];
        const maxNumber = Math.max(...allOrderNumbers);

        if (
          content.sectionTitle.trim() === "" &&
          (content.sectionDescription.trim() === "<p><br></p>" ||
            content.sectionDescription.trim() === "")
        ) {
          const updatedSections = resumeSections.filter(
            (item: any) =>
              !(
                item.type === "custom" &&
                item.content.sectionNumber === content.sectionNumber
              )
          );
          setResume(resumeId, { ...resume, sections: updatedSections });
        }

        if (currentCustomSectionIndex === -1) {
          resumeSections.push({
            type: "custom",
            content: {
              sectionTitle: content.sectionTitle,
              sectionDescription: content.sectionDescription,
              sectionNumber: content.sectionNumber,
              sectionDirection: content.sectionDirection,
              sectionType: content.sectionType,
            },
            orderNumber: maxNumber + 1,
            isVisible: true,
          });
          setResume(resumeId, { ...resume, sections: resumeSections });
        } else {
          customSection[currentCustomSectionIndex].content = content;
          setResume(resumeId, { ...resume, sections: resumeSections });
        }
      }
      pendingChangesRef.current = false;
      update({ id: resumeId, content: newSection[index] });
    }, 400);
  }, [update, resumeId, getResume, setResume]);

  const handleTitleChange = (index: number, value: string) => {
    pendingChangesRef.current = true;
    setSectionsContent((prev) => {
      const updatedSections = [...prev];
      updatedSections[index].sectionTitle = value;
      debouncedUpdate(updatedSections, index);
      return updatedSections;
    });
  };

  const handleDescriptionChange = (index: number, value: string) => {
    pendingChangesRef.current = true;
    setSectionsContent((prev) => {
      const updatedSections = [...prev];
      updatedSections[index].sectionDescription = value;
      debouncedUpdate(updatedSections, index);
      return updatedSections;
    });
  };

  console.log(sectionsContent);

  useEffect(() => {
    if (!pendingChangesRef.current) {
      setSectionsContent(item);
    }
  }, [item, pendingChangesRef]);

  const debouncedRemoveUpdate = useMemo(() => {
    return debounce((toRemoveSectionNumber: number) => {
      removeSectionUpdate({
        id: resumeId,
        sectionNumber: toRemoveSectionNumber,
      });
    }, 400);
  }, [removeSectionUpdate, resumeId]);

  const removeSection = (index: number) => {
    // Find the section to remove by its actual sectionNumber
    const removedSection = sectionsContent.find(
      (section) => section.sectionNumber === index
    );
    
    if (!removedSection) {
      console.warn("Section not found for removal:", index);
      return;
    }

    const toRemoveSectionNumber = removedSection.sectionNumber;
    
    // Remove the section from local state
    const filteredContent = sectionsContent.filter(
      (section) => section.sectionNumber !== toRemoveSectionNumber
    );

    // Update local state immediately
    setSectionsContent(filteredContent);

    // Update resume in store immediately
    if (resume) {
      const updatedSections = resume.sections.filter(
        (item: any) =>
          !(
            item.type === "custom" &&
            item.content.sectionNumber === toRemoveSectionNumber
          )
      );
      setResume(resumeId, { ...resume, sections: updatedSections });
    }

    // Debounce backend update
    debouncedRemoveUpdate(toRemoveSectionNumber);
  };

  // Magic write functions
  const generateCustomSection = (index: number) => {
    const section = sectionsContent[index];
    if (!section.sectionTitle.trim()) {
      toast.error("Section Title is required to generate content.");
      return;
    }
    
    setTargetIndex(index);
    setSelectedSectionType(section.sectionType || "other");
    setShowTypeSelector(true);
  };

  const getPlaceholderByType = (sectionType?: string) => {
    switch (sectionType?.toLowerCase()) {
      case "courses":
        return "E.g., Completed React.js course on Udemy, learned modern JavaScript, built portfolio projects...";
      case "achievements":
        return "E.g., Led team of 5 developers, increased website traffic by 40%, won hackathon competition...";
      case "certifications":
        return "E.g., AWS Certified Developer, Google Cloud Professional, Microsoft Azure Fundamentals...";
      case "awards":
        return "E.g., Employee of the Year 2023, Best Innovation Award, Dean's List recognition...";
      case "volunteer":
        return "E.g., Mentored junior developers, organized coding workshops, contributed to open source...";
      case "publications":
        return "E.g., Published article on Medium about React best practices, wrote technical blog posts...";
      case "languages":
        return "E.g., Fluent in English and Spanish, conversational in French, basic knowledge of German...";
      case "interests":
        return "E.g., Passionate about AI/ML, enjoy hiking and photography, love reading tech blogs...";
      default:
        return "E.g., Describe your section content here...";
    }
  };

  const handleTypeSelect = (type: string) => {
    setSelectedSectionType(type);
    setShowTypeSelector(false);
    setShowModifyModal(true);
  };

  const closeModifyModal = () => {
    setShowModifyModal(false);
    setTargetIndex(null);
  };

  const handleGenerateFromRough = async (roughDescription: string) => {
    if (targetIndex === null) {
      toast.error("Target index not set. Please try again.");
      return;
    }
    const section = sectionsContent[targetIndex];
    if (!section.sectionTitle.trim()) {
      toast.error("Section Title is required.");
      return;
    }
    setIsGenerating(true);
    setShowModifyModal(false);
    pushTyping("Generating professional content for your section...");
    try {
      // Prepare chatbot request
      const resume = getResume(resumeId);
      const { desiredRole, experienceLevel } = useChatBotStore.getState();
      const chatbotRequest = {
        message: {
          sender: "user",
          content: { type: "text", message: roughDescription }
        },
        userId: user?.id,
        resumeId: resumeId,
        resume: resume,
        desiredRole: desiredRole,
        experienceLevel: experienceLevel,
        intent: "generate",
        section: 'custom'
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
      // Find the updated custom section and update the description
      const updatedSection = response.data.updatedResume.sections.find(
        (section: any) => section.type === "custom" && section.content.sectionNumber === section.sectionNumber
      );
      if (updatedSection && updatedSection.content?.sectionDescription) {
        handleDescriptionChange(targetIndex, updatedSection.content.sectionDescription);
      }
      setResume(resumeId, response.data.updatedResume);
      pushText(
        "✅ Professional content has been generated and added to your section!",
        "bot",
        { messageType: "success" }
      );
      toast.success("Section content generated successfully!");
    } catch (error) {
      removeTyping();
      console.error("Error generating section content:", error);
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
        toast.error("Failed to generate section content. Please try again.");
      }
      pushText(
        "❌ Sorry, I couldn't generate the content. Please try again or write it manually.",
        "bot",
        { messageType: "error" }
      );
    } finally {
      setIsGenerating(false);
      setTargetIndex(null);
    }
  };

  const DirectionChoice = () => (
    <div className="mt-8">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-lg font-semibold">Choose Section Direction</h2>
        <button
          onClick={() => setIsChoosingDirection(false)}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <XCircle className="w-6 h-6 text-gray-500" />
        </button>
      </div>
      <div className="flex gap-6">
        <button
          onClick={() => addSection("left")}
          className="w-32 h-32 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-primary hover:bg-primary/5 transition-colors"
        >
          <ArrowLeftCircle className="w-12 h-12 text-primary" />
          <span className="font-medium">Left</span>
        </button>
        <button
          onClick={() => addSection("right")}
          className="w-32 h-32 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-primary hover:bg-primary/5 transition-colors"
        >
          <ArrowRightCircle className="w-12 h-12 text-primary" />
          <span className="font-medium">Right</span>
        </button>
      </div>
    </div>
  );

  if (sectionsContent?.length === 0) {
    return (
      <div>
        <Button
          className="px-3 w-[200px] mb-8"
          onClick={() =>
            isTwoColumn ? setIsChoosingDirection(true) : addSection()
          }
        >
          Add Section
        </Button>
        {isTwoColumn && isChoosingDirection && <DirectionChoice />}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {sectionsContent.map((section, index) => (
          <div
            key={section.sectionNumber}
            className="mt-8 relative bg-[radial-gradient(circle,_#fff_0%,_#ffe4e6_50%)] p-6 rounded-lg shadow-sm shadow-primary"
          >
            <div className="flex items-center justify-between">
              <Label>Section Title</Label>
              <XIcon
                onClick={() => removeSection(section.sectionNumber)}
                className="mr-4 cursor-pointer"
                width={16}
              />
            </div>
            <Input
              placeholder="Section Title"
              className="w-full mt-2 border border-muted-foreground"
              value={section.sectionTitle}
              onChange={(e) => handleTitleChange(index, e.target.value)}
            />
            <div className="mt-4 w-full">
              <QuillCustomEditor
                magicWrite={() => generateCustomSection(index)}
                value={section.sectionDescription}
                onChange={(value) => handleDescriptionChange(index, value)}
                label="Section Description"
                sectionTitle={section.sectionTitle}
                placeholder={getPlaceholderByType(section.sectionType)}
              />
            </div>
            {isTwoColumn && (
              <p className="text-sm mt-2">
                Direction: {section.sectionDirection}
              </p>
            )}
            {section.sectionType && section.sectionType !== "other" && (
              <p className="text-sm mt-1 text-gray-600">
                Type: {section.sectionType.charAt(0).toUpperCase() + section.sectionType.slice(1)}
              </p>
            )}
          </div>
        ))}
        {!isChoosingDirection ? (
          <Button
            className="px-3 w-[200px]"
            onClick={() =>
              isTwoColumn ? setIsChoosingDirection(true) : addSection()
            }
          >
            Add Another Section
          </Button>
        ) : (
          isTwoColumn && <DirectionChoice />
        )}
      </div>

      {/* Type Selector Modal */}
      {showTypeSelector && (
        <CustomSectionTypeSelector
          selectedType={selectedSectionType}
          onTypeSelect={handleTypeSelect}
          onClose={() => setShowTypeSelector(false)}
        />
      )}

      {/* Modify Modal */}
      {showModifyModal && (
        <ModifyModal
          heading="Custom Section Content Generator"
          text="Write a rough description of your section content, and we'll generate professional bullet points for you."
          label="Describe your section"
          buttonText="Generate Professional Content"
          closeModal={closeModifyModal}
          placeholder={getPlaceholderByType(selectedSectionType)}
          onGenerate={handleGenerateFromRough}
        />
      )}
    </>
  );
};

export default CustomForm;
