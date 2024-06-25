"use client";
import React, { useEffect, useMemo } from "react";
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

const page = () => {
  const [primaryTextColor, setPrimaryTextColor] = useColor("#000");
  const [primaryColor, setPrimaryColor] = useColor("#000");


  const update = useMutation(api.resume.updateColor);
  const updatePC = useMutation(api.resume.updateColorPC);

  const params = useParams()
  const resumeId = params.id
  const resume = useQuery(api.resume.getTemplateDetails, {id:resumeId as Id<"resumes">})
  const router = useRouter()

  const handlePrimaryTextColorChange = useMemo(() => {
    return debounce((color: any) => {
      setPrimaryTextColor(color);
      update({ id: resumeId as Id<"resumes">, color: color.hex });
    }, 400);
  }, [primaryTextColor]);

  
  const handlePrimaryColorChange = useMemo(() => {
    return debounce((color: any) => {
      setPrimaryColor(color);
      updatePC({ id: resumeId as Id<"resumes">, color: color.hex });
    }, 400);
  }, [primaryColor]);

  return (
    <FinalLayout>
      <div className="max-w-[50%] mt-32 mx-16">
        <div>
          <Label className="mb-[100px]">
            Primary Text Color :
          </Label>
        <ColorPicker hideAlpha height={200} hideInput={["rgb", "hsv"]}  color={primaryTextColor} onChange={handlePrimaryTextColorChange} />
        <ColorPicker hideAlpha height={200} hideInput={["rgb", "hsv"]}  color={primaryColor} onChange={handlePrimaryColorChange} />

        </div>
        <Button onClick={()=>router.push(`/build-resume/${resumeId}/download`)}>
          Complete
        </Button>
      </div>
    </FinalLayout>
  );
};

export default page;
