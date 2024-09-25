import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Id } from "@/convex/_generated/dataModel";
import { debounce, set } from "lodash";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import QuillEditorComponent from "../QuillEditors/QuillEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SkillsForm = ({
  item,
  resumeId,
  styles,
}: {
  item: any;
  resumeId: Id<"resumes">;
  styles: any;
}) => {
  
  const [skillDescription, setSkillDescription] = useState<string>("");
  const [currentFormat, setCurrentFormat] = useState("paragraph");
  const pendingChangesRef = useRef(false);
  const update = useMutation(api.resume.updateSkills);

  useEffect(() => {
    if (!pendingChangesRef.current) {
      setSkillDescription(item?.content?.description || "");
    }
  }, [item?.content?.description]);

  const debouncedUpdate = useMemo(
    () =>
      debounce((newSkills: string) => {
        update({ id: resumeId, content: { description: newSkills } });
        pendingChangesRef.current = false;
      }, 400),
    [update, resumeId]
  );

  const handleChange = useCallback(
    (description: string) => {
      pendingChangesRef.current = true;
      setSkillDescription(description);
      debouncedUpdate(description);
    },
    [debouncedUpdate]
  );

  return (
    <>
      <div className="">
        <QuillEditorComponent
          value={skillDescription}
          onChange={handleChange}
          currentFormat={currentFormat}
          label="Description"
        />
      </div>

    </>
  );
};

export default SkillsForm;
