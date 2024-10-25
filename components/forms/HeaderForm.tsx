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
import {
  Github,
  Globe,
  Link,
  Linkedin,
  Plus,
  Twitter,
  XIcon,
} from "lucide-react";

interface SocialLink {
  type: string;
  name: string;
  url: string;
}

interface HeaderContent {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  socialLinks: SocialLink[];
}

const initialHeader: HeaderContent = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  socialLinks: [],
};

const HeaderForm = ({
  resumeId,
  item,
}: {
  resumeId: Id<"resumes">;
  item: HeaderSection;
}) => {
  const [header, setHeader] = useState<HeaderContent>(initialHeader);
  const [activeLink, setActiveLink] = useState("");
  const [activeLinkValue, setActiveLinkValue] = useState("");

  const update = useMutation(api.resume.updateHeader);
  const pendingChangesRef = useRef(false);

  useEffect(() => {
    if (item?.content && !pendingChangesRef.current) {
      setHeader(item.content as HeaderContent);
      console.log(item.content);
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

  const handleSocialChange = useCallback(
    (index: number, name: string, value: string) => {
      pendingChangesRef.current = true;
      setHeader((prevHeader) => {
        const newSocialLinks = [...prevHeader.socialLinks];
        newSocialLinks[index] = { ...newSocialLinks[index], [name]: value };
        const newHeader = { ...prevHeader, socialLinks: newSocialLinks };
        debouncedUpdate(newHeader);
        return newHeader;
      });
    },
    [debouncedUpdate]
  );

  const handleAddSocialLink = useCallback(
    (type: string) => {
      pendingChangesRef.current = true;
      setHeader((prevHeader) => {
        const existingLink = prevHeader.socialLinks.find(
          (link) => link.type === type && link.type !== "other"
        );
        if (existingLink) {
          return prevHeader;
        }
        const newSocialLinks = [
          ...prevHeader.socialLinks,
          { type, name: "", url: "" },
        ];
        const newHeader = { ...prevHeader, socialLinks: newSocialLinks };
        debouncedUpdate(newHeader);
        return newHeader;
      });
    },
    [debouncedUpdate]
  );

  const handleRemoveSocialLink = useCallback(
    (index: number) => {
      pendingChangesRef.current = true;
      setHeader((prevHeader) => {
        const newSocialLinks = [...prevHeader.socialLinks];
        const filteredArray = newSocialLinks.filter((_, i) => i !== index);
        const newHeader = { ...prevHeader, socialLinks: filteredArray };
        debouncedUpdate(newHeader);
        return newHeader;
      });
    },
    [debouncedUpdate]
  );

  const socialOptions = [
    { value: "github", label: "GitHub", icon: Github },
    { value: "linkedin", label: "LinkedIn", icon: Linkedin },
    { value: "portfolio", label: "Portfolio", icon: Globe },
    { value: "twitter", label: "Twitter", icon: Twitter },
    { value: "other", label: "Other", icon: Link },
  ];

  return (
    <>
      <motion.form className="mt-8 relative bg-[radial-gradient(circle,_#fff_0%,_#ffe4e6_50%)] p-6 md:p-8 rounded-lg shadow shadow-primary">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full md:max-w-[85%] gap-6 md:gap-8">
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
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Social Links</h3>
          {header?.socialLinks?.map((link, index) => (
            <div key={link.type} className="mb-4 flex flex-col md:flex-row items-start justify-start md:items-center gap-6">
              <InputField
                label={link.type}
                name={`socialLinks`}
                value={link.name}
                onChange={(e) =>
                  handleSocialChange(index, "name", e.target.value)
                }
                placeholder={`Enter ${link.type}`}
              />
              <InputField
                label="URL"
                name={`socialLinks`}
                value={link.url}
                onChange={(e) =>
                  handleSocialChange(index, "url", e.target.value)
                }
                placeholder={`Enter your ${link.type} URL`}
              />
              <button
                type="button"
                className="mb-8 absolute right-20 md:block "
                onClick={() => handleRemoveSocialLink(index)}
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:flex items-center justify-start gap-4">
          {socialOptions.map((option) => (
            <span
              key={option.value}
              onClick={() => handleAddSocialLink(option.value)}
              className={`flex items-center gap-2 bg-[#FFF5F5] shadow-sm shadow-primary/40 cursor-pointer border-2 ${
                header?.socialLinks?.some((link) => link.type === option.value)
                  ? "border-primary/60"
                  : "border-transparent hover:border-primary/60"
              } transition duration-300 ease rounded-lg p-2`}
            >
              <Plus className="w-5 h-5" /> {option.label}
            </span>
          ))}
        </div>

        {item?.content?.summary !== undefined && (
          <div className="mt-8 w-full md:w-[85%] ">
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
    <Label htmlFor={name} className="text-base font-normal capitalize">
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
