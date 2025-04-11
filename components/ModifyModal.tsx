import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, XIcon } from "lucide-react";
import { useChatBotStore } from "@/store";

const ModifyModal = ({
  closeModal,
  onGenerate,
  heading,
  text,
  label,
  buttonText,
  placeholder,
}: {
  closeModal: () => void;
  onGenerate: (roughDescription: string) => void;
  heading: string;
  text: string;
  label: string;
  buttonText: string;
  placeholder: string;
}) => {
  const [roughDescription, setRoughDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { onboardingData } = useChatBotStore((state) => state);

  const handleGenerate = async () => {
    if (!roughDescription.trim()) return;
    setIsGenerating(true);
    onGenerate(roughDescription);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-primary/80 to-primary p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{heading}</h2>
          <button
            onClick={closeModal}
            className="text-white/80 hover:text-white transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">
              {label}
            </label>
            <textarea
              value={roughDescription}
              onChange={(e) => setRoughDescription(e.target.value)}
              placeholder={placeholder}
              className="w-full border border-gray-300 rounded-md p-3 h-32 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
            <p className="text-gray-500 text-sm mt-2">{text}</p>
          </div>

          <div className="flex justify-end mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerate}
              disabled={!roughDescription.trim() || isGenerating}
              className={`px-4 py-2 rounded-md text-white font-medium flex items-center gap-2 ${
                !roughDescription.trim() || isGenerating
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90 cursor-pointer"
              }`}
            >
              {isGenerating && <Loader2 className="w-4 h-4 animate-spin" />}
              {buttonText}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModifyModal;
