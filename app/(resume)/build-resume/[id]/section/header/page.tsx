"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { montserrat } from "@/utils/font";
import { useMutation, useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import debounce from "lodash/debounce";
import QuillEditorComponent from "@/components/QuillEditor";
import { Button } from "@/components/ui/button";

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

const Page = () => {
  const [header, setHeader] = useState<HeaderContent>(initialHeader);
  const update = useMutation(api.resume.updateHeader);
  const params = useParams();
  const resumeId = params.id as Id<"resumes">;
  const pendingChangesRef = useRef(false);
  const resume = useQuery(api.resume.getTemplateDetails, { id: resumeId });
  const router = useRouter();

  let sectionArray : string[] = [];
  resume?.sections?.map((item)=>(
    sectionArray.push(item.type)
  ))
  let headerIndex = sectionArray.findIndex((item)=>item === "header")


  useEffect(() => {
    if (resume?.sections && !pendingChangesRef.current) {
      const headerSection = resume.sections.find(
        (item) => item.type === "header"
      );
      if (headerSection?.content) {
        const savedHeader = headerSection.content as HeaderContent;
        setHeader(savedHeader);
      }
    }
  }, [resume?.sections]);

  const debouncedUpdate = useMemo(() => {
    return debounce((newHeader: HeaderContent) => {
      update({ id: resumeId, content: newHeader });
      pendingChangesRef.current = false;
    }, 400);
  }, [update, resumeId]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement> | string, name?: string) => {
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

  if (resume === null) {
    return <div>Template not found</div>;
  }

  if (resume === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {resume.sections?.map((item, idx) => {
        if (item?.type === "header") {
          return (
            <div key={idx} className="mt-24 mx-16">
              <h1
                className={cn(
                  "text-[45px] font-extrabold",
                  montserrat.className
                )}
              >
                Let's start with your header.
              </h1>
              <p className="text-lg">
                Include your full name and at least one way for employers to
                reach you.
              </p>
              <form className="mt-8">
                <div className="grid grid-cols-2 w-full max-w-[85%] gap-8">
                  <InputField
                    label="First Name"
                    name="firstName"
                    value={header.firstName}
                    onChange={handleChange}
                    placeholder="Aditya"
                    required
                  />
                  <InputField
                    label="Last Name"
                    name="lastName"
                    value={header.lastName}
                    onChange={handleChange}
                    placeholder="Rai"
                  />
                  <InputField
                    label="Email"
                    name="email"
                    value={header.email}
                    onChange={handleChange}
                    placeholder="aditya@gmail.com"
                    type="email"
                    required
                  />
                  <InputField
                    label="Phone"
                    name="phone"
                    value={header.phone}
                    onChange={handleChange}
                    placeholder="1234567890"
                    type="tel"
                  />
                  <InputField
                    label="Github"
                    name="github"
                    value={header.github}
                    onChange={handleChange}
                    placeholder="github.com/AdityaRai24"
                    type="text"
                  />
                  <InputField
                    label="Linkedin"
                    name="linkedin"
                    value={header.linkedin}
                    onChange={handleChange}
                    placeholder="linkedin.com/AdityaRai24"
                    type="text"
                  />
                </div>
                <div className="mt-8 w-[85%] ">
                  <Label className="text-md">Summary</Label>
                  <QuillEditorComponent
                    value={header.summary}
                    onChange={(content) => handleChange(content, "summary")}
                  />
                </div>
              </form>
              <div className="flex ">
                <Button
                  onClick={() => {
                    router.push(`/build-resume/${resumeId}/tips/${sectionArray[headerIndex+1]}`);
                  }}
                  className="px-16 py-8 mt-6 text-xl rounded-full"
                >
                  Next
                </Button>
              </div>
            </div>
          );
        }
        return null;
      })}
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
  <div className="flex flex-col justify-center gap-2">
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
  </div>
);
export default Page;
