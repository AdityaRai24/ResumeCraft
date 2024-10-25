"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import { usePreview } from "@/lib/use-preview";
import temp1Obj from "@/templates/template1/temp1obj";
import { ResumeTemplate } from "@/types/templateTypes";

const MobilePreviewButton = ({ item }: { item: ResumeTemplate }) => {
  const preview = usePreview();
  const handlePreview = () => {
    if (preview) {
      preview.onOpen(item);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="block md:hidden z-[100001]"
    >
     {!preview.isOpen && <Button
        onClick={handlePreview}
        className="rounded-md !px-4 flex items-center gap-2 bg-primary shadow-lg hover:shadow-xl transition-shadow"
      >
        Preview <Eye className="h-6 w-6" />
      </Button>}
    </motion.div>
  );
};

export default MobilePreviewButton;
