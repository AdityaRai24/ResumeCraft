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
  companyName?: string;
  role?: string;
}

export default function QuillExpEditor({
  value,
  onChange,
  label,
  companyName,
  role,
}: QuillEditorComponentProps) {
  const [generatedContent, setGeneratedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };

  const quillFormats = ["bold", "italic", "underline", "list", "bullet"];

  const handleGenerate = async () => {


    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/generateJD",
        { companyName: companyName, role: role,jobDescription : generatedContent }
      );
      // Convert the array of strings to an HTML list
      const listItems = response.data.textArray
        .map((item : string) => `<li>${item}</li>`)
        .join("");
      const generatedHtml = `<ul>${listItems}</ul>`;
      setGeneratedContent(generatedHtml);
      onChange(generatedHtml);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
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
          if (!companyName.trim() && !role.trim()) {
            toast.error("Company name and role required...")
          } else {
            setDialogIsOpen(true);
          }
        }}
      >
        Magic Write <WandSparkles className="ml-2" size={14} />
      </Button>

      <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Write ATS friendly, professional job descriptions with our AI
              </DialogTitle>
              <DialogDescription>
                Write something and click on generate to see the magic !!
              </DialogDescription>
              <div>
                <QuillEditor
                  value={generatedContent}
                  onChange={setGeneratedContent}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white mt-2"
                />
                {loading ? (
                  <Button disabled onClick={handleGenerate} className="mt-2 w-full">
                    Generating Description{" "}
                    <Loader2 className="animate-spin ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleGenerate} className="mt-2 w-full">
                    Generate Description
                  </Button>
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
