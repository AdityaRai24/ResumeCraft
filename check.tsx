"use client";
import React, { useEffect, useMemo, useState } from "react";
import FinalLayout from "./layout";
import { ColorPicker, useColor, Color } from "react-color-palette";
import "react-color-palette/css";
import { debounce } from "lodash";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";

interface Section {
  type: string;
  title: string;
  orderNumber: number;
  isVisible: boolean;
  content?: {
    sectionTitle: string;
  };
}

interface GlobalStyles {
  primaryTextColor: string;
  primaryColor: string;
  fontFamily: string;
}

interface Resume {
  sections: Section[];
  globalStyles: GlobalStyles;
}

interface StyleSectionProps {
  title: string;
  description: string;
  showColorPicker: boolean;
  setShowColorPicker: (show: boolean) => void;
  colorOptions: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  colorPickerComponent: React.ReactNode;
}

interface FontSectionProps {
  fontOptions: string[];
  currentFont: string;
  onFontChange: (font: string) => void;
}

const Page = () => {
  const [primaryTextColor, setPrimaryTextColor] = useColor("#000");
  const [primaryColor, setPrimaryColor] = useColor("#000");
  const [showPrimaryTextColorBox, setShowPrimaryTextColorBox] = useState(false);
  const [showPrimaryColorBox, setShowPrimaryColorBox] = useState(false);

  const params = useParams();
  const resumeId = params.id as string;
  const resume = useQuery(api.resume.getTemplateDetails, {
    id: resumeId as Id<"resumes">,
  });

  const [sections, setSections] = useState<Section[]>([]);

  const reorder = useMutation(api.resume.reorderSections);
  const update = useMutation(api.resume.updateColor);
  const updatePC = useMutation(api.resume.updateColorPC);
  const updateFont = useMutation(api.resume.updateFont);
  const hideSection = useMutation(api.resume.hideSection);

  useEffect(() => {
    if (resume?.sections) {
      const mainSections = resume.sections.filter(
        (item) => item.type !== "custom"
      );
      const customSections = resume.sections.filter(
        (item) => item.type === "custom"
      );
      const updatedSections = [...mainSections, ...customSections].sort(
        (a, b) => a.orderNumber - b.orderNumber
      );
      setSections(updatedSections);
    }
  }, [resume]);

  const toggleSectionVisibility = (sectionId: string) => {
    hideSection({ id: resumeId as Id<"resumes">, sectionId });
  };

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setSections((prev) => {
      const newSections = arrayMoveImmutable(prev, oldIndex, newIndex);
      const updatedSections = newSections.map((section, index) => ({
        ...section,
        orderNumber: index,
      }));

      reorder({
        id: resumeId as Id<"resumes">,
        updatedSections,
      });
      return updatedSections;
    });
  };

  const handlePrimaryTextColorChange = useMemo(() => {
    return debounce((color: Color) => {
      setPrimaryTextColor(color);
      update({ id: resumeId as Id<"resumes">, color: color.hex });
    }, 400);
  }, [update, setPrimaryTextColor, resumeId]);

  const handlePrimaryColorChange = useMemo(() => {
    return debounce((color: Color) => {
      setPrimaryColor(color);
      updatePC({ id: resumeId as Id<"resumes">, color: color.hex });
    }, 400);
  }, [setPrimaryColor, updatePC, resumeId]);

  const handleChosePrimaryColor = (color: string) => {
    updatePC({ id: resumeId as Id<"resumes">, color });
  };

  const handleChosePrimaryTextColor = (color: string) => {
    update({ id: resumeId as Id<"resumes">, color });
  };

  const colorOptions = ["#000", "#C026D3", "#153b66", "#a1be29", "#955b15"];
  const fontOptions = [
    "Raleway",
    "Inter",
    "OpenSans",
    "Poppins",
    "Montserrat",
    "Geologica",
  ];

  const handleFontChange = (font: string) => {
    updateFont({ id: resumeId as Id<"resumes">, font });
  };

  const currentFont = resume?.globalStyles?.fontFamily || "Inter";

  const StyleSection: React.FC<StyleSectionProps> = ({
    title,
    description,
    showColorPicker,
    setShowColorPicker,
    colorOptions,
    selectedColor,
    onColorSelect,
    colorPickerComponent,
  }) => {
    return (
      <div className="mb-8 w-full">
        <div className="mb-4">
          <Label className="text-xl">{title}</Label>
          <p className="text-gray-600 text-sm md:text-base">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {colorOptions.map((color) => (
            <motion.div
              key={color}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              onClick={() => onColorSelect(color)}
              className={`size-[28px] md:size-[35px] ${
                selectedColor === color &&
                "ring-2 ring-offset-2 ring-black scale-110"
              } rounded-full cursor-pointer`}
              style={{ backgroundColor: color }}
            />
          ))}

          <Button
            onClick={() => setShowColorPicker(!showColorPicker)}
            variant="outline"
            className="flex items-center gap-2 text-sm md:text-base"
          >
            Custom
            <motion.div
              initial={false}
              animate={{ rotate: showColorPicker ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </Button>
        </div>

        <AnimatePresence>
          {showColorPicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 w-full md:w-[400px] overflow-hidden"
            >
              {colorPickerComponent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const FontSection: React.FC<FontSectionProps> = ({
    fontOptions,
    currentFont,
    onFontChange,
  }) => {
    return (
      <div className="mb-8">
        <div className="mb-4">
          <Label className="text-xl">Font Style :</Label>
          <p className="text-gray-600 text-sm md:text-base">
            Choose a font style for your resume...
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {fontOptions.map((font, index) => (
            <Button
              key={index}
              onClick={() => onFontChange(font)}
              className={`${
                font === currentFont ? "border-primary scale-105" : ""
              } text-sm md:text-base hover:border hover:border-primary hover:scale-[1.05] transition duration-300 ease`}
              variant="outline"
            >
              {font}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <FinalLayout>
      <div className="max-w-[95%] md:max-w-[70%] mt-16 mx-4 md:mx-16">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold">Almost Done !!</h1>
          <p className="font-normal text-lg text-gray-700">
            Change the theme color and font of your resume if you want...
          </p>
        </div>

        <div className="mb-8">
          <div className="mb-4">
            <Label className="text-xl">Reorder Sections :</Label>
            <p className="text-gray-600">Reorder the sections if you want...</p>
          </div>
          <SortableList
            onSortEnd={onSortEnd}
            className="list"
            draggedItemClassName="dragged"
          >
            {sections?.map((item, index) => (
              <SortableItem key={index}>
                <div className="flex items-center gap-1 uppercase">
                  <div className="w-[35px] bg-[white] shadow-sm hover:cursor-move border flex items-center justify-center border-black/30 p-[10px] my-[4px]">
                    {item?.orderNumber + 1}
                  </div>
                  <div className="w-[80%] md:w-[60%] bg-white shadow-sm border hover:cursor-move border-black/30 px-[10px] py-[5px] my-[4px] flex justify-between items-center">
                    <span>
                      {item.type === "custom"
                        ? item.content?.sectionTitle
                        : item.type}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSectionVisibility(item.type)}
                      className="ml-2"
                    >
                      {item.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </Button>
                  </div>
                </div>
              </SortableItem>
            ))}
          </SortableList>
        </div>

        <StyleSection
          title="Primary Text Color"
          description="This is for all the title text that you can see in the resume.."
          showColorPicker={showPrimaryTextColorBox}
          setShowColorPicker={setShowPrimaryTextColorBox}
          colorOptions={colorOptions}
          selectedColor={resume?.globalStyles?.primaryTextColor}
          onColorSelect={handleChosePrimaryTextColor}
          colorPickerComponent={
            <ColorPicker
              hideAlpha
              height={200}
              hideInput={["rgb", "hsv"]}
              color={primaryTextColor}
              onChange={handlePrimaryTextColorChange}
            />
          }
        />

        <StyleSection
          title="Border/Design Style"
          description="This is for all the borders or designs that you can see in the resume."
          showColorPicker={showPrimaryColorBox}
          setShowColorPicker={setShowPrimaryColorBox}
          colorOptions={colorOptions}
          selectedColor={resume?.globalStyles?.primaryColor}
          onColorSelect={handleChosePrimaryColor}
          colorPickerComponent={
            <ColorPicker
              hideAlpha
              height={200}
              hideInput={["rgb", "hsv"]}
              color={primaryColor}
              onChange={handlePrimaryColorChange}
            />
          }
        />

        <FontSection
          fontOptions={fontOptions}
          currentFont={currentFont}
          onFontChange={handleFontChange}
        />
      </div>
    </FinalLayout>
  );
};

export default Page;