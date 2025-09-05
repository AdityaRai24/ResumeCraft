import { usePreview } from "@/lib/use-preview";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "./ui/dialog";
import {
  templateComponents,
  TemplateComponentType,
} from "@/templates/templateStructures";
import { cn } from "@/lib/utils";
import { getFontClass } from "@/lib/font";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";

const PreviewModal = () => {
  const preview = usePreview();
  const router = useRouter();

  const TemplateComponent: TemplateComponentType | null =
    preview?.currentTemplate
      ? templateComponents[preview?.currentTemplate.templateName]
      : null;

  if (!TemplateComponent) return null;

  const handleDownload = () => {
    const template = preview.currentTemplate as any;
    if (template?._id) {
      window.open(
        `/build-resume/${template._id}/download`,
        "_blank"
      );
    }
  };

  return (
    <Dialog open={preview.isOpen} onOpenChange={preview.onClose}>
      <DialogContent className="p-0">
        <DialogHeader className="p-0">
          <DialogDescription className="p-0">
            <div
              className={cn(
                "h-[473px] max-h-[550px] m-6! md:h-auto md:max-h-[90vh] md:w-[218mm] overflow-y-hidden md:overflow-y-scroll",
                getFontClass(preview.currentTemplate?.globalStyles?.fontFamily)
              )}
            >
              {TemplateComponent && preview.currentTemplate && (
                <TemplateComponent
                  obj={preview.currentTemplate}
                  textSize={
                    (preview.currentTemplate?.globalStyles?.textSize ||
                      "md") as "sm" | "md" | "lg"
                  }
                  marginSize={
                    (preview.currentTemplate?.globalStyles?.margin || "md") as
                      | "sm"
                      | "md"
                      | "lg"
                  }
                  size="lg"
                  isPreview={true}
                />
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Download Button - Show only for live-preview and my-resumes contexts */}
        {(preview.sourceContext === "live-preview" ||
          preview.sourceContext === "my-resumes") && (
          <Button
            onClick={handleDownload}
            className="absolute top-4 right-4 z-10 bg-primary hover:bg-primary/90 text-white shadow-lg"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;
