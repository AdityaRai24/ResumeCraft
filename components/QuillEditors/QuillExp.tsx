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
  magicWrite: () => void;
}

export default function QuillExpEditor({
  value,
  onChange,
  label,
  companyName,
  role,
  magicWrite,
}: QuillEditorComponentProps) {
  const [loading, setLoading] = useState(false);

  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"], // Add link button to toolbar
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
        readOnly={loading}
        modules={quillModules}
        formats={quillFormats}
        className="bg-white mt-2"
      />
    </motion.div>
  );
}
