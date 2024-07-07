"use client";
import React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { motion } from "framer-motion";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { WandSparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from 'axios'
import toast from "react-hot-toast";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

interface QuillEditorComponentProps {
  value: string;
  onChange: (content: string) => void;
  label: string;
}

export default function QuillEditorComponent({
  value,
  onChange,
  label,
}: QuillEditorComponentProps) {
  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };

  const quillFormats = ["bold", "italic", "underline", "list", "bullet"];

  const handleGenerate = async()=>{
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/generateJD`)
    } catch (error) {
      toast.error("Something went wrong Quill Editor")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
    >
      <div className="flex items-center justify-between">
        <Label className="text-md">{label}</Label>
        <Dialog>
          <DialogTrigger>
            <Button type="button">
              Magic Write <WandSparkles className="ml-2" size={14} />{" "}
            </Button>
          </DialogTrigger>
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
                  value={value}
                  onChange={onChange}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white mt-2"
                />
                <Button onClick={handleGenerate} className="mt-2 w-full">Generate Description</Button>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <QuillEditor
        value={value}
        onChange={onChange}
        modules={quillModules}
        formats={quillFormats}
        className="bg-white mt-2"
      />
    </motion.div>
  );
}
