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

interface Section {
  type: string;
  title: string;
}

const Page = () => {
  const [primaryTextColor, setPrimaryTextColor] = useColor("#000");
  const [primaryColor, setPrimaryColor] = useColor("#000");
  const [showPrimaryTextColorBox, setShowPrimaryTextColorBox] = useState(false);
  const [showPrimaryColorBox, setShowPrimaryColorBox] = useState(false);

  const params = useParams();
  const resumeId = params.id;
  const resume = useQuery(api.resume.getTemplateDetails, {
    id: resumeId as Id<"resumes">,
  });

  const sortedSections = resume?.sections.sort(
    (a: any, b: any) => a.orderNumber - b.orderNumber
  );
  const [sections, setSections] = useState<any>(sortedSections);

  const reorder = useMutation(api.resume.reorderSections);
  const update = useMutation(api.resume.updateColor);
  const updatePC = useMutation(api.resume.updateColorPC);
  const updateFont = useMutation(api.resume.updateFont);

  const hideSection = useMutation(api.resume.hideSection);

  const toggleSectionVisibility = (sectionId: string) => {
    hideSection({ id: resumeId as Id<"resumes">, sectionId: sectionId });
  };

  useEffect(() => {
    if (resume?.sections) {
      const mainSections = resume.sections.filter(
        (item) => item.type !== "custom"
      );
      const customSections = resume.sections.filter(
        (item) => item.type === "custom"
      );
      const updatedSections = [...mainSections, ...customSections].sort(
        (a: any, b: any) => a.orderNumber - b.orderNumber
      );
      setSections(updatedSections);
    }
  }, [resume]);

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    setSections((prev: any) => {
      const newSections = arrayMoveImmutable(prev, oldIndex, newIndex);
      const updatedSections = newSections.map(
        (section: any, index: number) => ({
          ...section,
          orderNumber: index,
        })
      );

      reorder({
        id: resumeId as Id<"resumes">,
        updatedSections: updatedSections,
      });
      return updatedSections;
    });
  };

  const handlePrimaryTextColorChange = useMemo(() => {
    return debounce((color: any) => {
      setPrimaryTextColor(color);
      update({ id: resumeId as Id<"resumes">, color: color.hex });
    }, 400);
  }, [update, setPrimaryTextColor, resumeId]);

  const handlePrimaryColorChange = useMemo(() => {
    return debounce((color: any) => {
      setPrimaryColor(color);
      updatePC({ id: resumeId as Id<"resumes">, color: color.hex });
    }, 400);
  }, [setPrimaryColor, updatePC, resumeId]);

  const handleChosePrimaryColor = (color: string) => {
    updatePC({ id: resumeId as Id<"resumes">, color: color });
  };

  const handleChosePrimaryTextColor = (color: string) => {
    update({ id: resumeId as Id<"resumes">, color: color });
  };

  const colorOptions = [
    "#000",
    "#C026D3",
    "#153b66",
    "#a1be29",
    "#955b15",
  ];

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

  return (
    <FinalLayout>
      <div className="max-w-[95%] md:max-w-[70%] overflow-y-hidden px-0 md:px-2 mt-16 mx-4 md:mx-16">
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
            {sections?.map((item: any, index: number) => {
              return (
                <SortableItem key={index}>
                  <div className="flex items-center gap-1 uppercase">
                    <div className="w-[35px] bg-[white] shadow-sm hover:cursor-move border flex items-center justify-center border-black/30 p-[10px] my-[4px]">
                      {item?.orderNumber + 1}
                    </div>
                    <div className="w-[80%] md:w-[60%] bg-white shadow-sm border hover:cursor-move border-black/30 px-[10px] py-[5px] my-[4px] flex justify-between items-center">
                      <span>
                        {item.type === "custom"
                          ? item.content.sectionTitle
                          : item.type}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSectionVisibility(item.type)}
                        className="ml-2"
                      >
                        {item.isVisible ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </Button>
                    </div>
                  </div>
                </SortableItem>
              );
            })}
          </SortableList>
        </div>

        <div className="mb-8">
          <div className="mb-4">
            <Label className="text-xl">Primary Text Color :</Label>
            <p className="text-gray-600">
              This is for all the title text that you can see in the resume..
            </p>
          </div>
          <div className="flex items-center justify-start gap-2 ">
            {colorOptions.map((item) => {
              return (
                <motion.div
                  key={item}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  onClick={() => handleChosePrimaryTextColor(item)}
                  className={`size-[35px] ${
                    resume?.globalStyles?.primaryTextColor === item &&
                    "size-[38px] ring-2 ring-offset-2 ring-black"
                  } rounded-full cursor-pointer`}
                  style={{ backgroundColor: item }}
                ></motion.div>
              );
            })}

            <motion.div
              initial={false}
              animate={showPrimaryTextColorBox ? "open" : "closed"}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                onClick={() =>
                  setShowPrimaryTextColorBox(!showPrimaryTextColorBox)
                }
                variant={"outline"}
                className="flex items-center justify-center gap-2"
              >
                <p>Custom</p>{" "}
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
        </div>

        {showPrimaryTextColorBox && (
          <div className="max-w-[80%] md:max-w-[50%]">
            <ColorPicker
              hideAlpha
              height={200}
              hideInput={["rgb", "hsv"]}
              color={primaryTextColor}
              onChange={handlePrimaryTextColorChange}
            />
          </div>
        )}

        <div className="mt-4 mb-8">
          <div className="mb-4">
            <Label className="text-xl">Border/Design Style :</Label>
            <p className="text-gray-600">
              This is for all the borders or designs that you can see in the
              resume.
            </p>
          </div>
          <div className="flex items-center justify-start gap-2 ">
            {colorOptions.map((item) => {
              return (
                <motion.div
                  key={item}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  onClick={() => handleChosePrimaryColor(item)}
                  className={`size-[35px] ${
                    resume?.globalStyles?.primaryColor === item &&
                    "size-[38px] ring-2 ring-offset-2 ring-black"
                  } rounded-full cursor-pointer`}
                  style={{ backgroundColor: item }}
                ></motion.div>
              );
            })}

            <motion.div
              initial={false}
              animate={showPrimaryTextColorBox ? "open" : "closed"}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                onClick={() => setShowPrimaryColorBox(!showPrimaryColorBox)}
                variant={"outline"}
                className="flex items-center justify-center gap-2"
              >
                <p>Custom</p>{" "}
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
        </div>

        {showPrimaryColorBox && (
          <div className="max-w-[80%] md:max-w-[50%]">
            <ColorPicker
              hideAlpha
              height={200}
              hideInput={["rgb", "hsv"]}
              color={primaryColor}
              onChange={handlePrimaryColorChange}
            />
          </div>
        )}

        <div className="mb-4">
          <Label className="text-xl">Font Style :</Label>
          <p className="text-gray-600">
            Choose a font style for your resume...
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-2 md:gap-3">
          {fontOptions?.map((item, index) => {
            return (
              <Button
                onClick={() => handleFontChange(item)}
                className={`${item === currentFont ? "border-primary scale-[1.065]" : ""} hover:border  hover:border-primary hover:scale-[1.05] transition duration-300 ease`}
                key={index}
                variant={"outline"}
              >
                {item}
              </Button>
            );
          })}
        </div>
      </div>
    </FinalLayout>
  );
};

export default Page;
