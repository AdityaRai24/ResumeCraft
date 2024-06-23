"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { montserrat } from "@/utils/font";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import React, { ChangeEvent, useState, useCallback, useEffect, useMemo, useRef } from "react";
import debounce from "lodash/debounce";

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

const Page: React.FC = () => {
  const [header, setHeader] = useState<HeaderContent>(initialHeader);
  const update = useMutation(api.resume.updateHeader);
  const params = useParams();
  const resumeId = params.id as Id<"resumes">;
  const pendingChangesRef = useRef(false);

  const resume = useQuery(api.resume.getTemplateDetails, { id: resumeId });

  useEffect(() => {
    if (resume?.sections && !pendingChangesRef.current) {
      const headerSection = resume.sections.find(item => item.type === "header");
      if (headerSection?.content) {
        setHeader(prevHeader => ({
          ...prevHeader,
          ...headerSection.content as HeaderContent
        }));
      }
    }
  }, [resume?.sections]);

  const debouncedUpdate = useMemo(
    () =>
      debounce((newHeader: HeaderContent) => {
        update({ id: resumeId, content: newHeader });
        pendingChangesRef.current = false;
      }, 500),
    [update, resumeId]
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    pendingChangesRef.current = true;
    setHeader(prevHeader => {
      const newHeader = { ...prevHeader, [name]: value };
      debouncedUpdate(newHeader);
      return newHeader;
    });
  }, [debouncedUpdate]);

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
            <div key={idx} className="mt-32 mx-16">
              <h1 className={cn("text-[45px] font-extrabold", montserrat.className)}>
                Let's start with your header.
              </h1>
              <p className="text-lg">
                Include your full name and at least one way for employers to reach you.
              </p>
              <form className="mt-8">
                <div className="grid grid-cols-2 w-full max-w-[70%] gap-8">
                  <InputField
                    label="First Name"
                    name="firstName"
                    value={header.firstName}
                    onChange={handleChange}
                    placeholder="Aditya"
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
                  />
                  <InputField
                    label="Phone"
                    name="phone"
                    value={header.phone}
                    onChange={handleChange}
                    placeholder="1234567890"
                    type="tel"
                  />
                </div>
              </form>
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
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text"
}) => (
  <div className="flex flex-col justify-center gap-2">
    <Label htmlFor={name} className="text-md">
      {label}
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