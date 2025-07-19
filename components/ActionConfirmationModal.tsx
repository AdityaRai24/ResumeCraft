import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, XIcon } from "lucide-react";

interface ActionConfirmationModalProps {
  closeModal: () => void;
  onConfirm: () => void;
  heading: string;
  description: string;
  buttonText: string;
  isProcessing: boolean;
}

const ActionConfirmationModal: React.FC<ActionConfirmationModalProps> = ({
  closeModal,
  onConfirm,
  heading,
  description,
  buttonText,
  isProcessing,
}) => {
  const handleConfirm = async () => {
    await onConfirm();
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
            <p className="text-gray-600 whitespace-pre-line">{description}</p>
          </div>

          <div className="flex justify-end gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={closeModal}
              disabled={isProcessing}
              className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConfirm}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-md text-white font-medium flex items-center gap-2 ${
                isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90 cursor-pointer"
              }`}
            >
              {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
              {buttonText}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ActionConfirmationModal; 