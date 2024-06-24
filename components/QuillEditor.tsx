"use client";
import React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

interface QuillEditorComponentProps {
  value: string;
  onChange: (content: string) => void;
}

export default function QuillEditorComponent({ value, onChange }: QuillEditorComponentProps) {
  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: 'ordered' }, { list: 'bullet' }],
    ],
  };

  const quillFormats = [
    "bold",
    "italic",
    "underline",
    'list',
    'bullet',
  ];

  return (
    <div>
      <QuillEditor
        value={value}
        onChange={onChange}
        modules={quillModules}
        formats={quillFormats}
        className="bg-white mt-2" 
      />
    </div>
  );
}