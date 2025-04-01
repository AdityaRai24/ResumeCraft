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

const CustomForm = ({
  resumeId,
  styles,
  item,
}: {
  resumeId: Id<"resumes">;
  styles: string;
  item: string;
}) => {
  interface SectionItem {
    sectionTitle: string;
    sectionDescription: string;
    sectionNumber: number;
    sectionDirection: "left" | "right";
  }

  const [sectionsContent, setSectionsContent] = useState<SectionItem[]>([]);
  const [isChoosingDirection, setIsChoosingDirection] = useState(false);
  const pendingChangesRef = useRef(false);

  const update = useMutation(api.resume.updateCustomSection);
  const resume = useQuery(api.resume.getTemplateDetails, { id: resumeId });
  const isTwoColumn = resume?.globalStyles.columns === 2;
  const removeSectionUpdate = useMutation(api.resume.removeCustomSection);

  const addSection = (direction: "left" | "right" = "left") => {
    const newSection: SectionItem = {
      sectionTitle: "",
      sectionDescription: "",
      sectionNumber: sectionsContent.length + 1,
      sectionDirection: direction,
    };

    setSectionsContent((prev) => [...prev, newSection]);
    setIsChoosingDirection(false);
  };

  const debouncedUpdate = useMemo(() => {
    return debounce((newSection: SectionItem[], index: number) => {
      update({ id: resumeId, content: newSection[index] });
      pendingChangesRef.current = false;
    }, 400);
  }, [update, resumeId]);

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

  const initialData = useQuery(api.resume.getCustomSections, { id: resumeId });
  useEffect(() => {
    if (initialData && initialData.length > 0 && !pendingChangesRef.current) {
      const modified: any[] = initialData.map((item) => item.content);
      setSectionsContent(modified);
    }
  }, [initialData]);

  const debouncedRemoveUpdate = useMemo(() => {
    return debounce((toRemoveSectionNumber: number) => {
      removeSectionUpdate({
        id: resumeId,
        sectionNumber: toRemoveSectionNumber,
      });
    }, 400);
  }, [removeSectionUpdate, resumeId]);

  const removeSection = (index: number) => {
    const removedSection = sectionsContent.find(
      (section) => section.sectionNumber === index
    );
    const toRemoveSectionNumber = removedSection?.sectionNumber;
    const filteredContent = sectionsContent.filter((_, i) => i + 1 !== index);
    debouncedRemoveUpdate(toRemoveSectionNumber || 0);
    setSectionsContent(filteredContent);
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

  if (sectionsContent.length === 0) {
    return (
      <div>
        <Button
          className="px-3 w-[200px] mb-8"
          onClick={() => isTwoColumn ? setIsChoosingDirection(true) : addSection()}
        >
          Add Section
        </Button>
        {isTwoColumn && isChoosingDirection && <DirectionChoice />}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {sectionsContent.map((section, index) => (
        <div
          key={section.sectionNumber}
          className="mt-8 relative bg-[radial-gradient(circle,_#fff_0%,_#ffe4e6_50%)] p-6 rounded-lg shadow-sm shadow-primary"
        >
          <div className="flex items-center justify-between">
            <Label>Section Title</Label>
            {index !== 0 && (
              <XIcon
                onClick={() => removeSection(index + 1)}
                className="mr-4 cursor-pointer"
                width={16}
              />
            )}
          </div>
          <Input
            placeholder="Section Title"
            className="w-full mt-2 border border-muted-foreground"
            value={section.sectionTitle}
            onChange={(e) => handleTitleChange(index, e.target.value)}
          />
          <div className="mt-4 w-full">
            <QuillCustomEditor
              value={section.sectionDescription}
              onChange={(value) => handleDescriptionChange(index, value)}
              label="Section Description"
              sectionTitle={section.sectionTitle}
            />
          </div>
          {isTwoColumn && (
            <p className="text-sm mt-2">Direction: {section.sectionDirection}</p>
          )}
        </div>
      ))}
      {!isChoosingDirection ? (
        <Button
          className="px-3 w-[200px]"
          onClick={() => isTwoColumn ? setIsChoosingDirection(true) : addSection()}
        >
          Add Another Section
        </Button>
      ) : (
        isTwoColumn && <DirectionChoice />
      )}
    </div>
  );
};

export default CustomForm;