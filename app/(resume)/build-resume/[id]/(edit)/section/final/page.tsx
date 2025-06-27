"use client";
import React, { useEffect, useMemo, useState } from "react";
import FinalLayout from "./layout";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { debounce } from "lodash";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import SortableList, { SortableItem } from "react-easy-sort";
import { arrayMoveImmutable } from "array-move";
import { fontOptions } from "@/lib/font";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useChatBotStore } from "@/store";

const Page = () => {
  const [primaryTextColor, setPrimaryTextColor] = useColor("#000");
  const [primaryColor, setPrimaryColor] = useColor("#000");
  const [showPrimaryTextColorBox, setShowPrimaryTextColorBox] = useState(false);
  const [showPrimaryColorBox, setShowPrimaryColorBox] = useState(false);
  const [sections, setSections] = useState<any>([]);
  const [leftSections, setLeftSections] = useState<any>([]);
  const [rightSections, setRightSections] = useState<any>([]);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [showMarginDropdown, setShowMarginDropdown] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const colorOptions = ["#000", "#C026D3", "#153b66", "#a1be29", "#955b15"];
  const fontSizeOptions = [
    { label: "Small", value: "sm" },
    { label: "Medium", value: "md" },
    { label: "Large", value: "lg" }
  ];
  const marginOptions = [
    { label: "Extra Small", value: "xs" },
    { label: "Small", value: "sm" },
    { label: "Medium", value: "md" },
    { label: "Large", value: "lg" }
  ];
  const [initialTextColor, setInitialTextColor] = useState<string | null>(null);
  const [initialColor, setInitialColor] = useState<string | null>(null);

  const params = useParams();
  const resumeId = params.id;
  const reorder = useMutation(api.resume.reorderSections);
  const update = useMutation(api.resume.updateColor);
  const updatePC = useMutation(api.resume.updateColorPC);
  const updateFont = useMutation(api.resume.updateFont);
  const updateFontSize = useMutation(api.resume.updateFontSize);
  const updateMarginSize = useMutation(api.resume.updateMarginSize);
  const hideSection = useMutation(api.resume.hideSection);
  const resume = useQuery(api.resume.getTemplateDetails, {
    id: resumeId as Id<"resumes">,
  });

  const { resume: zustandResume, setResume } = useChatBotStore((state) => state);

  const [currentFont, setCurrentFont] = useState(
    zustandResume?.globalStyles?.fontFamily || "Inter"
  );
  const [currentFontSize, setCurrentFontSize] = useState(
    zustandResume?.globalStyles?.textSize || "md"
  );
  const [currentMargin, setCurrentMargin] = useState(
    zustandResume?.globalStyles?.margin || "md"
  );

  const headerObj =
    zustandResume?.sections?.filter((item: any) => item.type === "header") || [];

  useEffect(() => {
    if (!zustandResume) return;

    if (zustandResume?.globalStyles?.columns === 2) {
      const tempLeftSections = zustandResume?.sections?.filter((item: any) =>
        item.type === "custom"
          ? item?.content?.sectionDirection === "left"
          : item?.style?.sectionDirection === "left"
      );
      const tempRightSections = zustandResume?.sections?.filter((item: any) =>
        item.type === "custom"
          ? item?.content?.sectionDirection === "right"
          : item?.style?.sectionDirection === "right"
      );

      setLeftSections(
        tempLeftSections.map((section: any, index: any) => ({
          ...section,
          orderNumber: index,
        }))
      );
      setRightSections(
        tempRightSections.map((section: any, index: any) => ({
          ...section,
          orderNumber: index,
        }))
      );
    } else {
      const sortedSections = zustandResume?.sections.sort(
        (a: any, b: any) => a.orderNumber - b.orderNumber
      );
      setSections(sortedSections);
    }
  }, [zustandResume]);

  useEffect(() => {
    if (zustandResume?.globalStyles) {
      if (!initialTextColor) {
        setInitialTextColor(zustandResume.globalStyles.primaryTextColor);
      }
      if (!initialColor) {
        setInitialColor(zustandResume.globalStyles.primaryColor);
      }
      setCurrentFont(zustandResume.globalStyles.fontFamily || "Inter");
    }
  }, [zustandResume?.globalStyles, initialTextColor, initialColor]);

  const toggleSectionVisibility = (sectionId: string, secondType: string) => {
    hideSection({
      id: resumeId as Id<"resumes">,
      sectionId: sectionId,
      secondType: secondType,
    });
  };

  const onSortEndSingleColumn = (oldIndex: number, newIndex: number) => {
    setSections((prev: any) => {
      const newSections = arrayMoveImmutable(prev, oldIndex, newIndex);
      const updatedSections = newSections.map(
        (section: any, index: number) => ({
          ...section,
          orderNumber: index,
        })
      );
      if (zustandResume) {
        setResume({ ...zustandResume, sections: updatedSections });
      }
      reorder({
        id: resumeId as Id<"resumes">,
        updatedSections: updatedSections,
      });
      return updatedSections;
    });
  };

  const onSortEndLeftColumn = (oldIndex: number, newIndex: number) => {
    setLeftSections((prev: any) => {
      const newSections = arrayMoveImmutable(prev, oldIndex, newIndex);
      const updatedSections = newSections.map(
        (section: any, index: number) => ({
          ...section,
          orderNumber: index,
        })
      );
      if (zustandResume) {
        setResume({
          ...zustandResume,
          sections: [...headerObj, ...updatedSections, ...rightSections],
        });
      }
      reorder({
        id: resumeId as Id<"resumes">,
        updatedSections: [...headerObj, ...updatedSections, ...rightSections],
      });
      return updatedSections;
    });
  };

  const onSortEndRightColumn = (oldIndex: number, newIndex: number) => {
    setRightSections((prev: any) => {
      const newSections = arrayMoveImmutable(prev, oldIndex, newIndex);
      const updatedSections = newSections.map(
        (section: any, index: number) => ({
          ...section,
          orderNumber: index,
        })
      );
      if (zustandResume) {
        setResume({
          ...zustandResume,
          sections: [...headerObj, ...leftSections, ...updatedSections],
        });
      }
      reorder({
        id: resumeId as Id<"resumes">,
        updatedSections: [...headerObj, ...leftSections, ...updatedSections],
      });
      return updatedSections;
    });
  };

  const handlePrimaryTextColorChange = useMemo(() => {
    return debounce((color: any) => {
      setPrimaryTextColor(color);
      if (zustandResume) {
        setResume({
          ...zustandResume,
          globalStyles: {
            ...zustandResume.globalStyles,
            primaryTextColor: color.hex,
          },
        });
      }
      update({ id: resumeId as Id<"resumes">, color: color.hex });
    }, 400);
  }, [update, setPrimaryTextColor, resumeId, zustandResume, setResume]);

  const handlePrimaryColorChange = useMemo(() => {
    return debounce((color: any) => {
      setPrimaryColor(color);
      if (zustandResume) {
        setResume({
          ...zustandResume,
          globalStyles: {
            ...zustandResume.globalStyles,
            primaryColor: color.hex,
          },
        });
      }
      updatePC({ id: resumeId as Id<"resumes">, color: color.hex });
    }, 400);
  }, [setPrimaryColor, updatePC, resumeId, zustandResume, setResume]);

  const handleChosePrimaryColor = (color: string) => {
    if (zustandResume) {
      setResume({
        ...zustandResume,
        globalStyles: {
          ...zustandResume.globalStyles,
          primaryColor: color,
        },
      });
    }
    updatePC({ id: resumeId as Id<"resumes">, color: color });
  };

  const handleChosePrimaryTextColor = (color: string) => {
    if (zustandResume) {
      setResume({
        ...zustandResume,
        globalStyles: {
          ...zustandResume.globalStyles,
          primaryTextColor: color,
        },
      });
    }
    update({ id: resumeId as Id<"resumes">, color: color });
  };

  const handleFontChange = (font: string) => {
    setCurrentFont(font);
    if (zustandResume) {
      setResume({
        ...zustandResume,
        globalStyles: {
          ...zustandResume.globalStyles,
          fontFamily: font,
        },
      });
    }
    updateFont({ id: resumeId as Id<"resumes">, font });
    setShowFontDropdown(false);
  };

  const handleFontSizeChange = (size: string) => {
    setCurrentFontSize(size);
    if (zustandResume) {
      setResume({
        ...zustandResume,
        globalStyles: {
          ...zustandResume.globalStyles,
          textSize: size,
        },
      });
    }
    updateFontSize({ id: resumeId as Id<"resumes">, textSize: size });
    setShowFontSizeDropdown(false);
  };

  const handleMarginChange = (margin: string) => {
    setCurrentMargin(margin);
    if (zustandResume) {
      setResume({
        ...zustandResume,
        globalStyles: {
          ...zustandResume.globalStyles,
          margin: margin,
        },
      });
    }
    updateMarginSize({ id: resumeId as Id<"resumes">, marginSize: margin });
    setShowMarginDropdown(false);
  };

  const SectionItem = ({ item }: { item: any }) => (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-10 h-10 bg-white shadow-sm hover:cursor-move border flex items-center justify-center border-gray-300 rounded-lg font-medium text-sm">
        {item?.orderNumber + 1}
      </div>
      <div className="flex-1 bg-white shadow-sm border hover:cursor-move border-gray-300 rounded-lg px-4 py-3 flex justify-between items-center">
        <span className="text-sm font-medium uppercase text-gray-700">
          {item.type === "custom" ? item.content.sectionTitle : item.type}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            toggleSectionVisibility(
              item.type,
              item.type === "custom" ? item.content.sectionTitle : item.type
            )
          }
          className="h-8 w-8 p-0 hover:bg-gray-100"
        >
          {item.isVisible ? (
            <Eye size={16} className="text-gray-600" />
          ) : (
            <EyeOff size={16} className="text-gray-400" />
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <FinalLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pb-32">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
            Almost Done !!
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
            Change the theme color and font of your resume if you want...
          </p>
        </div>

        {/* Reorder Sections */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              Reorder Sections
            </h2>
            <p className="text-gray-600">Reorder the sections if you want...</p>
          </div>

          {zustandResume?.globalStyles?.columns === 2 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Left Column
                </h3>
                <SortableList
                  onSortEnd={onSortEndLeftColumn}
                  className="space-y-2"
                  draggedItemClassName="opacity-50"
                >
                  {leftSections.map((item: any, index: number) => (
                    <SortableItem key={index}>
                      <div>
                        <SectionItem item={item} />
                      </div>
                    </SortableItem>
                  ))}
                </SortableList>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Right Column
                </h3>
                <SortableList
                  onSortEnd={onSortEndRightColumn}
                  className="space-y-2"
                  draggedItemClassName="opacity-50"
                >
                  {rightSections.map((item: any, index: number) => (
                    <SortableItem key={index}>
                      <div>
                        <SectionItem item={item} />
                      </div>
                    </SortableItem>
                  ))}
                </SortableList>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6">
              <SortableList
                onSortEnd={onSortEndSingleColumn}
                className="space-y-2"
                draggedItemClassName="opacity-50"
              >
                {sections.length > 0 &&
                  sections?.map((item: any, index: number) => (
                    <SortableItem key={index}>
                      <div>
                        <SectionItem item={item} />
                      </div>
                    </SortableItem>
                  ))}
              </SortableList>
            </div>
          )}
        </div>

        {/* Color Customization */}
        <div className="space-y-12">
          {/* Primary Text Color */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                Primary Text Color
              </h2>
              <p className="text-gray-600">
                This is for all the title text that you can see in the resume.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {colorOptions.map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  onClick={() => handleChosePrimaryTextColor(item)}
                  className={`w-10 h-10 relative ${
                    zustandResume?.globalStyles?.primaryTextColor === item &&
                    "ring-2 ring-offset-2 ring-gray-800"
                  } rounded-full cursor-pointer shadow-sm hover:shadow-md transition-shadow`}
                  style={{ backgroundColor: item }}
                >
                  {initialTextColor === item && (
                    <div className="absolute -top-2 -right-2 bg-white text-xs px-2 py-1 rounded-full border border-gray-300 shadow-sm">
                      Default
                    </div>
                  )}
                </motion.div>
              ))}

              {initialTextColor && !colorOptions.includes(initialTextColor) && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  onClick={() => handleChosePrimaryTextColor(initialTextColor)}
                  className={`w-10 h-10 relative ${
                    zustandResume?.globalStyles?.primaryTextColor ===
                      initialTextColor && "ring-2 ring-offset-2 ring-gray-800"
                  } rounded-full cursor-pointer shadow-sm hover:shadow-md transition-shadow`}
                  style={{ backgroundColor: initialTextColor }}
                >
                  <div className="absolute -top-2 -right-2 bg-white text-xs px-2 py-1 rounded-full border border-gray-300 shadow-sm">
                    Default
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={false}
                animate={showPrimaryTextColorBox ? "open" : "closed"}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  onClick={() =>
                    setShowPrimaryTextColorBox(!showPrimaryTextColorBox)
                  }
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-10"
                >
                  <span>Custom</span>
                  <motion.div
                    variants={{ open: { rotate: 180 }, closed: { rotate: 0 } }}
                    transition={{ duration: 0.2 }}
                    style={{ originY: 0.55 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </Button>
              </motion.div>
            </div>

            {showPrimaryTextColorBox && (
              <div className="max-w-md bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <ColorPicker
                  hideAlpha
                  height={200}
                  hideInput={["rgb", "hsv"]}
                  color={primaryTextColor}
                  onChange={handlePrimaryTextColorChange}
                />
              </div>
            )}
          </div>

          {/* Border/Design Style */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                Border/Design Style
              </h2>
              <p className="text-gray-600">
                This is for all the borders or designs that you can see in the
                resume.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {colorOptions.map((item) => (
                <motion.div
                  key={item}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  onClick={() => handleChosePrimaryColor(item)}
                  className={`w-10 h-10 relative ${
                    zustandResume?.globalStyles?.primaryColor === item &&
                    "ring-2 ring-offset-2 ring-gray-800"
                  } rounded-full cursor-pointer shadow-sm hover:shadow-md transition-shadow`}
                  style={{ backgroundColor: item }}
                >
                  {initialColor === item && (
                    <div className="absolute -top-2 -right-2 bg-white text-xs px-2 py-1 rounded-full border border-gray-300 shadow-sm">
                      Default
                    </div>
                  )}
                </motion.div>
              ))}

              {initialColor && !colorOptions.includes(initialColor) && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  onClick={() => handleChosePrimaryColor(initialColor)}
                  className={`w-10 h-10 relative ${
                    zustandResume?.globalStyles?.primaryColor === initialColor &&
                    "ring-2 ring-offset-2 ring-gray-800"
                  } rounded-full cursor-pointer shadow-sm hover:shadow-md transition-shadow`}
                  style={{ backgroundColor: initialColor }}
                >
                  <div className="absolute -top-2 -right-2 bg-white text-xs px-2 py-1 rounded-full border border-gray-300 shadow-sm">
                    Default
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={false}
                animate={showPrimaryColorBox ? "open" : "closed"}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  onClick={() => setShowPrimaryColorBox(!showPrimaryColorBox)}
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-10"
                >
                  <span>Custom</span>
                  <motion.div
                    variants={{ open: { rotate: 180 }, closed: { rotate: 0 } }}
                    transition={{ duration: 0.2 }}
                    style={{ originY: 0.55 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </Button>
              </motion.div>
            </div>

            {showPrimaryColorBox && (
              <div className="max-w-md bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <ColorPicker
                  hideAlpha
                  height={200}
                  hideInput={["rgb", "hsv"]}
                  color={primaryColor}
                  onChange={handlePrimaryColorChange}
                />
              </div>
            )}
          </div>

          {/* Font Settings */}
          <div className="space-y-8">
            {/* Font Style */}
            <div>
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                  Font Style
                </h2>
                <p className="text-gray-600">
                  Choose a font style for your resume...
                </p>
              </div>

              <div className="max-w-md">
                <div className="relative">
                  <Select value={currentFont} onValueChange={handleFontChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions?.map((font, index) => (
                        <SelectItem key={index} value={font}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Font Size and Margins */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Font Size
                </h3>
                <div className="relative">
                  <Select value={currentFontSize} onValueChange={handleFontSizeChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizeOptions.map((size, index) => (
                        <SelectItem key={index} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Page Margins
                </h3>
                <div className="relative">
                  <Select value={currentMargin} onValueChange={handleMarginChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select margin size" />
                    </SelectTrigger>
                    <SelectContent>
                      {marginOptions.map((margin, index) => (
                        <SelectItem key={index} value={margin.value}>
                          {margin.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FinalLayout>
  );
};

export default Page;
