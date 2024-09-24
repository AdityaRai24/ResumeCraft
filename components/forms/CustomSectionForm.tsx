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
import { Input } from "../ui/input";

const SkillsForm = ({
  item,
  resumeId,
  styles,
}: {
  item: any;
  resumeId: Id<"resumes">;
  styles: any;
}) => {
  const [sectionDescription, setSectionDescription] = useState<string>("");
  const pendingChangesRef = useRef(false);
  const update = useMutation(api.resume.updateSkills);

  useEffect(() => {
    if (!pendingChangesRef.current) {
      setSectionDescription(item?.content?.description || "");
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
      setSectionDescription(description);
      debouncedUpdate(description);
    },
    [debouncedUpdate]
  );

  return (
    <>
      <div className="flex flex-col gap-3">
        <Input placeholder="Section Title" name="title" className="w-full border border-muted-foreground"/>
        <QuillEditorComponent
          value={sectionDescription}
          onChange={handleChange}
          label="Section Description"
        />
      </div>
    </>
  );
};

export default SkillsForm;
