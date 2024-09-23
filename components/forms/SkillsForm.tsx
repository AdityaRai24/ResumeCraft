import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { debounce } from "lodash";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import QuillEditorComponent from "../QuillEditor";

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
    <QuillEditorComponent
      value={skillDescription}
      onChange={handleChange}
      label="Description"
    />
  );
};

export default SkillsForm;