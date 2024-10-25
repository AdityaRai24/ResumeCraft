import { usePreview } from "@/lib/use-preview";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ResumeTemplate } from "@/types/templateTypes";
import {
  templateComponents,
  TemplateComponentType,
} from "@/templates/templateStructures";

const PreviewModal = () => {
  const preview = usePreview();

  const TemplateComponent: TemplateComponentType | null =
    preview?.currentTemplate
      ? templateComponents[preview?.currentTemplate.templateName]
      : null;

  if (!TemplateComponent) return null;

  return (
    <Dialog open={preview.isOpen}  onOpenChange={preview.onClose}>
      <DialogContent className="p-0">
        <DialogHeader className="p-0">
          <DialogDescription className="p-0">
            <div className="h-[473px] max-h-[550px] !m-6 md:h-auto md:max-h-[90vh] md:w-[218mm]  overflow-y-hidden md:overflow-y-scroll">
              {TemplateComponent && preview.currentTemplate && (
                <TemplateComponent
                  obj={preview.currentTemplate}
                  size="lg"
                  isPreview={true}
                />
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
