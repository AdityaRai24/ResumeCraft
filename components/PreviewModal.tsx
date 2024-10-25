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
    <Dialog open={preview.isOpen} onOpenChange={preview.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>
            <div className="!overflow-scroll max-h-[90vh] w-auto">
              {TemplateComponent && preview.currentTemplate && (
                <TemplateComponent
                  obj={preview.currentTemplate}
                  size="md"
                  isPreview={true}
                />
              )}{" "}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
