"use client";
import React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { motion } from "framer-motion";
import { Label } from "./ui/label";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

interface QuillEditorComponentProps {
  value: string;
  onChange: (content: string) => void;
  label : string;
}

export default function QuillEditorComponent({
  value,
  onChange,
  label
}: QuillEditorComponentProps) {
  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };

  const quillFormats = ["bold", "italic", "underline", "list", "bullet"];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
    >
      <Label className="text-md">{label}</Label>

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
