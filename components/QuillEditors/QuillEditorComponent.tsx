"use client";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { motion } from "framer-motion";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { WandSparkles } from "lucide-react";
import toast from "react-hot-toast";
import React, { useRef, useState } from "react";
import { useChatBotStore } from "@/store";

const ForwardedQuillEditor = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => null,
}) as any;

interface QuillEditorComponentProps {
  value: string;
  onChange: (content: string) => void;
  label: string;
  placeholder?: string;
  magicWrite?: () => void;
  requiredFieldLabel?: string;
  requiredFieldValue?: string;
  onFocus?: () => void;
  readOnly?: boolean;
  toolbarModules?: any;
  formats?: string[];
  sectionType: string;
  fullDescription: string;
  itemIndex?: number; // <-- add this line
}

export default function QuillEditorComponent({
  value,
  onChange,
  label,
  placeholder,
  magicWrite,
  requiredFieldLabel,
  requiredFieldValue,
  onFocus,
  readOnly = false,
  toolbarModules,
  formats,
  sectionType,
  fullDescription,
  itemIndex, 
}: QuillEditorComponentProps) {
  const quillRef = useRef<any>(null);
  const [showTagButton, setShowTagButton] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [currentRange, setCurrentRange] = useState<any>(null); // Store the current selection range

  const defaultModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      ["link"],
    ],
  };
  const defaultFormats = [
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
  ];

  const handleMagicWrite = () => {
    if (magicWrite) {
      if (
        requiredFieldLabel &&
        requiredFieldValue !== undefined &&
        !requiredFieldValue.trim()
      ) {
        toast.error(`${requiredFieldLabel} is required for Magic Write.`);
        console.error(`${requiredFieldLabel} is required for Magic Write.`);
        return;
      }
      magicWrite();
    }
  };

  const handleSelectionChange = (range: any, source: any, editor: any) => {
    if (range && range.length > 0) {
      const text = editor.getText(range.index, range.length).trim();
      if (text && text.length > 0) {
        setSelectedText(text);
        setCurrentRange(range);
        setShowTagButton(true);
      } else {
        setShowTagButton(false);
        setSelectedText("");
        setCurrentRange(null);
      }
    } else {
      setShowTagButton(false);
      setSelectedText("");
      setCurrentRange(null);
    }
  };

  const handleTag = () => {
    if (!selectedText) {
      console.log("No selected text available");
      return;
    }
    // Set taggedTag in Zustand with text, section, description, and index
    useChatBotStore.getState().setTaggedTag({
      text: selectedText,
      section: sectionType,
      description: fullDescription,
      index: itemIndex, // <-- include the index
    });
    setShowTagButton(false);
    setSelectedText("");
    setCurrentRange(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
      style={{ position: "relative" }}
    >
      <div className="flex items-center justify-between">
        <Label className="text-md">{label}</Label>
        {magicWrite && (
          <div className="flex gap-2">
            <Button type="button" onClick={handleMagicWrite}>
              Magic Write <WandSparkles className="ml-2" size={14} />
            </Button>
          </div>
        )}
      </div>
      <div style={{ position: "relative" }}>
        <ForwardedQuillEditor
          ref={quillRef}
          value={value}
          onChange={onChange}
          modules={toolbarModules || defaultModules}
          formats={formats || defaultFormats}
          onFocus={onFocus}
          className="bg-white mt-2"
          placeholder={placeholder}
          readOnly={readOnly}
          onChangeSelection={handleSelectionChange}
        />
        {showTagButton && selectedText && (
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 9999,
              background: "#fffbe6",
              color: "#222",
              border: "2px solid red", // debug border
              borderRadius: "999px",
              fontWeight: 500,
              fontSize: "13px",
              padding: "7px 16px 7px 12px",
              display: "flex",
              alignItems: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
              cursor: "pointer",
              gap: "8px",
              pointerEvents: "auto"
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Tag button clicked");
              handleTag();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            title="Tag and send to chatbot"
          >
            <span style={{
              background: "#ffe066",
              color: "#b48a00",
              borderRadius: "50%",
              fontWeight: 700,
              padding: "2px 7px",
              marginRight: "6px",
              fontSize: "14px"
            }}>@</span>
            <span style={{
              maxWidth: 120,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}>
              {selectedText.length > 18
                ? selectedText.substring(0, 18) + "…"
                : selectedText}
            </span>
            <span style={{
              marginLeft: "8px",
              fontSize: "15px",
              color: "#b48a00"
            }}>Send</span>
          </div>
        )}
      </div>
      <style>{`
          .ql-editor .tagged { 
            background: #ffe066; 
            color: #222; 
            border-radius: 3px; 
            padding: 0 2px; 
          }
          .ql-toolbar {
            z-index: 100;
          }
          .ql-container {
            position: relative;
            z-index: 50;
          }
        `}</style>
    </motion.div>
  );
}