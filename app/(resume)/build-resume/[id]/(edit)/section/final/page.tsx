"use client";
import React, { useEffect, useMemo, useState } from "react";
import FinalLayout from "./layout";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { debounce } from "lodash";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { ArrowDown, ChevronDown, ChevronUp } from "lucide-react";

const Page = () => {
  const [primaryTextColor, setPrimaryTextColor] = useColor("#000");
  const [primaryColor, setPrimaryColor] = useColor("#000");
  const [showPrimaryTextColorBox, setShowPrimaryTextColorBox] = useState(false);
  const [showPrimaryColorBox, setShowPrimaryColorBox] = useState(false);

  const update = useMutation(api.resume.updateColor);
  const updatePC = useMutation(api.resume.updateColorPC);

  const params = useParams();
  const resumeId = params.id;
  const resume = useQuery(api.resume.getTemplateDetails, {
    id: resumeId as Id<"resumes">,
  });
  const updateFont = useMutation(api.resume.updateFont)

  const handlePrimaryTextColorChange = useMemo(() => {
    return debounce((color: any) => {
      setPrimaryTextColor(color);
      update({ id: resumeId as Id<"resumes">, color: color.hex });
    }, 400);
  }, [update,setPrimaryTextColor,resumeId]);

  const handlePrimaryColorChange = useMemo(() => {
    return debounce((color: any) => {
      setPrimaryColor(color);
      updatePC({ id: resumeId as Id<"resumes">, color: color.hex });
    }, 400);
  }, [setPrimaryColor,updatePC,resumeId]);

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
    "#9d161d",
  ];


  const fontOptions = ["Raleway","Inter","OpenSans","Poppins","Montserrat","Geologica"]; ;

  const handleFontChange = async(font: string)=>{
    await updateFont({id:resumeId as Id<"resumes">,font})
  }

  const currentFont = resume?.globalStyles?.fontFamily || "Inter";

  return (
    <FinalLayout>
      <div className="max-w-[70%] mt-16 mx-16">
        <div className="mb-16">
          <h1 className="text-6xl font-bold">Almost Done !!</h1>
          <p className="font-normal text-lg">
            Change the theme color and font of your resume if you want...
          </p>
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
          <div className="max-w-[50%]">
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
          <div className="max-w-[50%]">
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
        <div className="flex items-center justify-start gap-2">
          {fontOptions?.map((item, index) => {
            return (
              <Button
              onClick={()=>handleFontChange(item)}
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
