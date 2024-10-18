"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { motion } from "framer-motion";
import { Loader2, WandSparkles } from "lucide-react";
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
  projectTitle: string;
}

export default function QuillProjectEditor({
  value,
  onChange,
  label,
  projectTitle,
}: QuillEditorComponentProps) {
  const [generatedContent, setGeneratedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState("");

  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
    ],
  };

  const quillFormats = ["bold", "italic", "underline", "list", "bullet","link"];

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/generatePD`,
        { projectTitle: projectTitle, projectDescription: tempValue }
      );
      const listItems = response.data.textArray
        .map((item: string) => `<li>${item}</li>`)
        .join("");
      const generatedHtml = `<ul>${listItems}</ul>`;
      setGeneratedContent(generatedHtml);
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong Quill Project");
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

        <Button
          type="button"
          onClick={() => {
            if (!projectTitle.trim()) {
              toast.error("Project Title required...");
            } else {
              setDialogIsOpen(true);
            }
          }}
        >
          Magic Write <WandSparkles className="ml-2" size={14} />
        </Button>

        <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
          <DialogContent className="!max-w-lg">
            <DialogHeader>
              <DialogTitle>
                Write ATS friendly, project descriptions with our AI
              </DialogTitle>
              <DialogDescription>
                Compose your description in the text area provided. Select
                &apos;Generate Description&apos; to enhance your writing. If you leave the
                text area empty and click &apos;Generate Description&apos;, our AI will
                create a description for you based on the title.
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
