import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Id } from "@/convex/_generated/dataModel";
import { debounce } from "lodash";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import QuillEditorComponent from "../QuillEditors/QuillEditor";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";

interface SectionItem {
  sectionTitle: string;
  sectionDescription: string;
  sectionNumber: number;
}

interface SkillsFormProps {
  item: any;
  resumeId: Id<"resumes">;
  styles: any;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ item, resumeId, styles }) => {
  const initialSection: SectionItem = {
    sectionTitle: "",
    sectionDescription: "",
    sectionNumber: 0,
  };

  const [sectionContent, setSectionContent] = useState<SectionItem[]>([initialSection]);
  const pendingChangesRef = useRef(false);
  const update = useMutation(api.resume.updateCustomSection);

  const debouncedUpdate = useMemo(() => {
    return debounce((newSection: SectionItem[], index: number) => {
      update({ id: resumeId, content: newSection[index] });
      pendingChangesRef.current = false;
    }, 400);
  }, [update, resumeId]);

  const handleChange = useCallback(
    (index: number, field: keyof SectionItem, value: string | boolean) => {
      pendingChangesRef.current = true;
      setSectionContent((prev) => {
        const newSectionContent = prev.map((section, i) =>
          i === index ? { ...section, [field]: value } : section
        );
        debouncedUpdate(newSectionContent, index);
        return newSectionContent;
      });
    },
    [debouncedUpdate]
  );

  useEffect(() => {
    if (!pendingChangesRef.current && item?.content) {
      setSectionContent(item.content.length > 0 ? item.content : [initialSection]);
    }
  }, [item?.content]);

  const addNewSection = () => {
    setSectionContent((prev) => [...prev, { ...initialSection, sectionNumber: prev.length }]);
  };

  const removeSection = useCallback((index: number) => {
    setSectionContent((prev) => {
      const newContent = prev.filter((_, i) => i !== index).map((section, i) => ({
        ...section,
        sectionNumber: i,
      }));
      debouncedUpdate(newContent, index);
      return newContent;
    });
  }, [debouncedUpdate]);

  return (
    <div className="flex flex-col gap-6">
      {sectionContent.map((section, index) => (
        <div key={index} className="mt-8 relative bg-[radial-gradient(circle,_#fff_0%,_#ffe4e6_50%)] p-8 rounded-lg shadow shadow-primary">
          <div className="flex items-center justify-between">
            <Label>Section Title</Label>
            {index !== 0 && <XIcon onClick={() => removeSection(index)} className="mr-4 cursor-pointer" width={16}/>}
          </div>
          <Input
            onChange={(e) => handleChange(index, "sectionTitle", e.target.value)}
            value={section.sectionTitle}
            placeholder="Section Title"
            className="w-full mt-2 border border-muted-foreground"
          />
          <div className="mt-2">
            <QuillEditorComponent
              value={section.sectionDescription}
              onChange={(content) => handleChange(index, "sectionDescription", content)}
              label="Section Description"
            />
          </div>
        </div>
      ))}
      <Button onClick={addNewSection} className="px-3 w-[200px]">Add Another Section</Button>
    </div>
  );
};

export default SkillsForm;