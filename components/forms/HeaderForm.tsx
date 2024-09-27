import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { debounce } from "lodash";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import QuillEditorComponent from "../QuillEditors/QuillEditor";
import { motion } from "framer-motion";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { HeaderSection } from "@/types/templateTypes";

interface HeaderContent {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  location: string;
  summary: string;
}

const initialHeader: HeaderContent = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  github: "",
  linkedin: "",
  location: "",
  summary: "",
};

const HeaderForm = ({
  resumeId,
  item,
}: {
  resumeId: Id<"resumes">;
  item: HeaderSection;
}) => {
  const [header, setHeader] = useState<HeaderContent>(initialHeader);
  const update = useMutation(api.resume.updateHeader);
  const pendingChangesRef = useRef(false);

  useEffect(() => {
    if (item?.content && !pendingChangesRef.current) {
      setHeader(item.content as HeaderContent);
    }
  }, [item?.content, pendingChangesRef]);

  const debouncedUpdate = useMemo(() => {
    return debounce((newHeader: HeaderContent) => {
      update({ id: resumeId, content: newHeader });
      pendingChangesRef.current = false;
    }, 400);
  }, [update, resumeId]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement> | string) => {
      pendingChangesRef.current = true;
      setHeader((prevHeader) => {
        let newHeader;
        if (typeof e === "string") {
          newHeader = { ...prevHeader, summary: e };
        } else {
          newHeader = { ...prevHeader, [e.target.name]: e.target.value };
        }
        debouncedUpdate(newHeader);
        return newHeader;
      });
    },
    [debouncedUpdate]
  );

  return (
    <>
      <motion.form className="mt-8 relative bg-[radial-gradient(circle,_#fff_0%,_#ffe4e6_50%)] p-8 rounded-lg shadow shadow-primary">
        <div className="grid grid-cols-2 w-full max-w-[85%] gap-8">
          <InputField
            label="First Name"
            name="firstName"
            value={header.firstName}
            onChange={handleChange}
            placeholder="John"
            required
          />
          <InputField
            label="Last Name"
            name="lastName"
            value={header.lastName}
            onChange={handleChange}
            placeholder="Doe"
          />
          <InputField
            label="Email"
            name="email"
            value={header.email}
            onChange={handleChange}
            placeholder="johndoe@gmail.com"
            type="email"
            required
          />
          <InputField
            label="Phone"
            name="phone"
            value={header.phone}
            onChange={handleChange}
            placeholder="9876543210"
            type="tel"
          />
          <InputField
            label="Github Username"
            name="github"
            value={header.github}
            onChange={handleChange}
            placeholder="JohnDoe56"
            type="text"
          />
          <InputField
            label="Linkedin"
            name="linkedin"
            value={header.linkedin}
            onChange={handleChange}
            placeholder="linkedin.com/JohnDoe56"
            type="text"
          />
        </div>
        {item?.content?.summary !== undefined && (
          <div className="mt-8 w-[85%] ">
            <QuillEditorComponent
              label="Summary"
              placeholder="Write something about yourself..."
              value={header.summary}
              onChange={(content) => handleChange(content)}
            />
          </div>
        )}
      </motion.form>
    </>
  );
};

interface InputFieldProps {
  label: string;
  name: keyof HeaderContent;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
    className="flex flex-col justify-center gap-2"
  >
    <Label htmlFor={name} className="text-md">
      {label}
      {required && "*"}
    </Label>
    <Input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border border-muted-foreground"
    />
  </motion.div>
);

export default HeaderForm;
