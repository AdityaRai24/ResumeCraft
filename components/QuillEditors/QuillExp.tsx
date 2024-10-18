"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { motion } from "framer-motion";
import { LinkIcon, Loader2, WandSparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import toast from "react-hot-toast";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

interface QuillEditorComponentProps {
  value: string;
  onChange: (content: string) => void;
  label: string;
  companyName: string;
  role: string;
}

export default function QuillExpEditor({
  value,
  onChange,
  label,
  companyName,
  role,
}: QuillEditorComponentProps) {
  const [generatedContent, setGeneratedContent] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"], // Add link button to toolbar
    ],
  };

  const quillFormats = ["bold", "italic", "underline", "list", "bullet","link"];

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/generateJD`,
        { companyName: companyName, role: role, jobDescription: tempValue }
      );
      const listItems = response.data.textArray
        .map((item: string) => `<li>${item}</li>`)
        .join("");
      const generatedHtml = `<ul>${listItems}</ul>`;
      setGeneratedContent(generatedHtml);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong Quill Experience");
    }
  };

  const continueData = () => {
    onChange(generatedContent);
    setTempValue("");
    setGeneratedContent("");
    setDialogIsOpen(false);
  };

  const cancelData = () => {
    setDialogIsOpen(false);
    setGeneratedContent("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
    >
      <div className="flex items-center justify-between">
        <Label className="text-md">{label}</Label>


       <div className="flex gap-2">
     
        <Button
          type="button"
          onClick={() => {
            if (!companyName.trim() && !role.trim()) {
              toast.error("Company name and role required...");
            } else {
              setDialogIsOpen(true);
            }
          }}
        >
          Magic Write <WandSparkles className="ml-2" size={14} />
        </Button>
       </div>

        <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
          <DialogContent className="!max-w-lg">
            <DialogHeader>
              <DialogTitle>
                Write ATS friendly, professional job descriptions with our AI
              </DialogTitle>
              <DialogDescription>
                Enter your experience details in the text area provided. Click
                &apos;Generate Description&apos; to refine and enhance your input. If you
                leave the text area blank and click &apos;Generate Description&apos;, our
                AI will create experience points based on the job title.
              </DialogDescription>
              <div>
                <QuillEditor
                  value={generatedContent ? generatedContent : tempValue}
                  onChange={setTempValue}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white mt-2"
                />
                {loading ? (
                  <Button
                    disabled
                    onClick={handleGenerate}
                    className="mt-2 w-full"
                  >
                    Generating Description{" "}
                    <Loader2 className="animate-spin ml-2" />
                  </Button>
                ) : (
                  <>
                    {!generatedContent ? (
                      <Button onClick={handleGenerate} className="mt-2 w-full">
                        Generate Description
                      </Button>
                    ) : (
                      <div className="mt-2 flex items-center justify-between gap-4 min-w-full">
                        <Button
                          onClick={() => cancelData()}
                          className="w-[50%] hover:scale-[1.03] active:scale-[0.97] duration-300 transition ease-in-out"
                          variant={"outline"}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => continueData()}
                          className="w-[50%] hover:scale-[1.03] active:scale-[0.97] duration-300 transition ease-in-out"
                        >
                          Continue
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <QuillEditor
        value={value}
        onChange={onChange}
        readOnly={loading}
        modules={quillModules}
        formats={quillFormats}
        className="bg-white mt-2"
      />
    </motion.div>
  );
}
