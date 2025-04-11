"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { poppinsFont } from "@/lib/font";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { WandSparkles } from "lucide-react";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

interface QuillEditorComponentProps {
  value: string;
  onChange: (content: string) => void;
  label: string;
  currentFormat?: string;
  placeholder?: string;
  onFocus?: () => void;
  magicWrite?: () => void;
}

export default function QuillEditorComponent({
  value,
  onChange,
  label,
  currentFormat,
  onFocus,
  placeholder,
  magicWrite,
}: QuillEditorComponentProps) {
  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      ["link"],
    ],
  };

  const quillFormats = [
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
    >
      <div className="flex items-center justify-between">
        <Label className="text-md">{label}</Label>

        <div className="flex gap-2">
          <Button type="button" onClick={magicWrite}>
            Magic Write <WandSparkles className="ml-2" size={14} />
          </Button>
        </div>
      </div>
      <QuillEditor
        value={value}
        onChange={onChange}
        modules={quillModules}
        formats={quillFormats}
        onFocus={onFocus}
        className={`${poppinsFont.className} bg-white mt-2`}
        placeholder={placeholder}
      />
    </motion.div>
  );
}
