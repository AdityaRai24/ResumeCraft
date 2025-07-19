"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { motion } from "framer-motion";
import { WandSparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

interface QuillEditorComponentProps {
  value: string;
  onChange: (content: string) => void;
  label: string;
  sectionTitle: string;
  magicWrite: () => void;
  placeholder?: string;
}

export default function QuillCustomEditor({
  value,
  onChange,
  label,
  sectionTitle,
  magicWrite,
  placeholder,
}: QuillEditorComponentProps) {
  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
    ],
  };

  const quillFormats = ["bold", "italic", "underline", "list", "bullet", "link"];

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
            if (!sectionTitle.trim()) {
              // You can add toast notification here if needed
              console.error("Section Title required...");
            } else {
              magicWrite();
            }
          }}
        >
          Magic Write <WandSparkles className="ml-2" size={14} />
        </Button>
      </div>
      <QuillEditor
        value={value}
        onChange={onChange}
        modules={quillModules}
        formats={quillFormats}
        className="bg-white mt-2"
        placeholder={placeholder}
      />
    </motion.div>
  );
} 