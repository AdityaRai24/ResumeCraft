"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

interface QuillEditorComponentProps {
  value: string;
  onChange: (content: string) => void;
  label: string;
  currentFormat?: string;
}

export default function QuillEditorComponent({
  value,
  onChange,
  label,
  currentFormat,
}: QuillEditorComponentProps) {


  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    ],
  };
  
  const quillFormats = ["bold", "italic", "underline", "list", "bullet"];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
    >
      <QuillEditor
        value={value}
        onChange={onChange}
        modules={quillModules}
        formats={quillFormats}
        className="bg-white"
        placeholder={"Write Something about your skills..."}
      />
    </motion.div>
  );
}
