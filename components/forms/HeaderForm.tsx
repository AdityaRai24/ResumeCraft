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
import { motion, AnimatePresence } from "framer-motion";
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
  Upload,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useChatBotStore } from "@/store";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import ChatBotModal from "../ChatBotModal";

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
  photo?: string;
  role: string;
}

interface SummaryOption {
  title: string;
  content: string;
}

const initialHeader: HeaderContent = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  socialLinks: [],
  photo: "",
  role: "",
};

const HeaderForm = ({
  resumeId,
  item,
}: {
  resumeId: Id<"resumes">;
  item: HeaderSection;
}) => {
  const [header, setHeader] = useState<HeaderContent>(initialHeader);
  const [uploading, setUploading] = useState(false);
  const [generatedSummaries, setGeneratedSummaries] = useState<SummaryOption[]>(
    []
  );
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { pushText, pushOptions } = useChatBotStore((state) => state);

  const resume = useQuery(api.resume.getTemplateDetails, { id: resumeId });
  const firstTimeRef = useRef(false);
  const hasPhoto = resume?.globalStyles.photo || false;
  const { user } = useUser();

  const { onboardingData } = useChatBotStore((state) => state);

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

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show loading toast
    const loadingToast = toast.loading("Uploading image...");

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET as string
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      setHeader((prev) => {
        const newHeader = { ...prev, photo: data.secure_url };
        debouncedUpdate(newHeader);
        return newHeader;
      });

      // Success toast
      toast.success("Image uploaded successfully!", {
        id: loadingToast,
      });
    } catch (error) {
      // Error toast
      toast.error("Failed to upload image. Please try again.", {
        id: loadingToast,
      });
    } finally {
      setUploading(false);
    }
  };

  const socialOptions = [
    { value: "github", label: "GitHub", icon: Github },
    { value: "linkedin", label: "LinkedIn", icon: Linkedin },
    { value: "portfolio", label: "Portfolio", icon: Globe },
    { value: "twitter", label: "Twitter", icon: Twitter },
    { value: "other", label: "Other", icon: Link },
  ];

  const generateSummary = async () => {
    try {
      setIsGeneratingSummary(true);
      setShowSummaryModal(true);

      const response = await axios.post("/api/generateSummary", {
        desiredRole: onboardingData.desiredRole,
        experienceLevel: onboardingData.experienceLevel,
      });

      setGeneratedSummaries(response.data.summaryOptions || []);
      setIsGeneratingSummary(false);
      console.log(response.data.summaryOptions);
    } catch (error) {
      console.log(error);
      setIsGeneratingSummary(false);
      toast.error("Failed to generate summaries. Please try again.");
    }
  };

  const closeModal = () => {
    setShowSummaryModal(false);
  };

  const selectSummary = (summary: string, title: string) => {
    handleChange(summary);
    closeModal();
    pushText(
      `✅ "${title}" professional summary has been added to your resume!`,
      "bot"
    );
  };

  setTimeout(() => {
    if (
      header.email &&
      header.firstName &&
      header.lastName &&
      header.phone &&
      !firstTimeRef.current
    ) {
      pushText(
        `Great job! You've got your basic info all set. Now, let's add some social links like Github and LinkedIn to make your profile pop!`,
        "bot"
      );
      firstTimeRef.current = true;
    }
  }, 2000);

  const summaryFocus = () => {
    pushOptions(
      `Want help with your professional summary?`,
      [
        {
          label: "✍️ Write Summary For Me",
          value: "write-summary",
          onClick: () => {
            generateSummary();
          },
        },
        {
          label: "🛠 Improve My Summary",
          value: "improve-summary",
          onClick: () => {
            pushText("Improve Summary", "bot");
          },
        },
      ],
      "bot"
    );
  };

  return (
    <>
      <motion.form className="mt-8 relative bg-[radial-gradient(circle,_#fff_0%,_#ffe4e6_50%)] p-6 md:p-8 rounded-lg shadow-sm shadow-primary">
        {hasPhoto && (
          <div className="flex items-center gapp-8 mb-6">
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative cursor-pointer group"
              >
                {header.photo ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary">
                    <img
                      src={header.photo}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-primary flex items-center justify-center bg-white/50 hover:bg-white/80 transition-colors">
                    <Upload
                      className={`w-5 h-5 ${uploading ? "animate-pulse" : ""}`}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
            onFocus={() =>
              pushText(
                `Skip the funky emails from high school 😅 — go for something simple and clear!`,
                "bot"
              )
            }
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
          {(header.role || header.role == "") && (
            <InputField
              label="Role"
              name="role"
              value={header.role}
              onChange={handleChange}
              placeholder="Software Developer"
            />
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Social Links</h3>
          {header?.socialLinks?.map((link, index) => (
            <div
              key={link.type}
              className="mb-4 flex flex-col md:flex-row flex-wrap  items-start justify-start md:items-center gap-6"
            >
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
                className="mb-8 absolute right-20 md:block"
                onClick={() => handleRemoveSocialLink(index)}
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:flex flex-wrap items-center justify-start gap-4">
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
          <div className="mt-8 w-full md:w-[85%]">
            <QuillEditorComponent
              label="Summary"
              placeholder="Write something about yourself..."
              value={header.summary}
              magicWrite={() => generateSummary()}
              onFocus={() => summaryFocus()}
              onChange={(content) => handleChange(content)}
            />
          </div>
        )}
      </motion.form>

      {/* Summary Options Modal */}
      <AnimatePresence>
        {showSummaryModal && (
          <ChatBotModal
            isGenerating={isGeneratingSummary}
            generatedContent={generatedSummaries}
            selectOption={selectSummary}
            closeModal={closeModal}
            title="Professional Summary Options"
            loadingText="Crafting professional summaries tailored to your experience..."
          />
        )}
      </AnimatePresence>
    </>
  );
};

interface InputFieldProps {
  label: string;
  name: keyof HeaderContent | string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  onFocus?: () => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  onFocus,
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
      onFocus={onFocus}
      placeholder={placeholder}
      className="border border-muted-foreground"
    />
  </motion.div>
);

export default HeaderForm;
