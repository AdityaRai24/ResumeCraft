import { Id } from "@/convex/_generated/dataModel";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import QuillEditorComponent from "../QuillEditors/QuillEditor";
import { Button } from "../ui/button";
import { debounce } from "lodash";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { XIcon } from "lucide-react";

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
  }

  const [sectionsContent, setSectionsContent] = useState<SectionItem[]>([
    { sectionTitle: "", sectionDescription: "", sectionNumber: 1 },
  ]);
  const update = useMutation(api.resume.updateCustomSection);
  const removeSectionUpdate = useMutation(api.resume.removeCustomSection);
  const pendingChangesRef = useRef(false);

  const handleAddSection = () => {
    setSectionsContent([
      ...sectionsContent,
      {
        sectionTitle: "",
        sectionDescription: "",
        sectionNumber: sectionsContent.length + 1,
      },
    ]);
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

  return (
    <div className="flex flex-col gap-6">
      {sectionsContent.map((section, index) => (
        <div
          key={section.sectionNumber}
          className="mt-8 relative bg-[radial-gradient(circle,_#fff_0%,_#ffe4e6_50%)] p-6 rounded-lg shadow shadow-primary"
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
            <QuillEditorComponent
              value={section.sectionDescription}
              onChange={(value) => handleDescriptionChange(index, value)}
              label="Section Description"
            />
          </div>
        </div>
      ))}
      <Button className="px-3 w-[200px]" onClick={handleAddSection}>
        Add Another Section
      </Button>
    </div>
  );
};

export default CustomForm;
