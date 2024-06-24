"use client";
import Template1 from "@/templates/template1/template1";
import React from "react";
import { Button } from "./ui/button";
import { Edit, Eye } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ChooseTemplates = () => {
  const { user } = useUser();
  const templates = useQuery(api.resume.getTemplates);

  const createUserResume = useMutation(api.resume.createUserResume);
  const router = useRouter()

  if (templates === null) {
    return <div>No templates</div>;
  }
  if (templates === undefined) {
    return <div>Loading...</div>;
  }
  if (!user) return null;


  const selectResume = async (id: Id<"resumes">) => {

    const promise = createUserResume({
      id: id,
      userId: user?.id,
    }).then((res)=>{
       return router.push(`/build-resume/${res}/section/header`)
    })

    toast.promise(promise, {
      loading: "Creating Resume...",
      success: "Resume Created Successfully",
      error: "Error while creating resume...",
    })


  };

  return (
    <div className="grid grid-cols-3 gap-6  mt-5">
      {templates?.map((item) => {
        return (
          <div
            key={item?._id}
            className="relative group inline-block w-[340px] h-[420px]"
          >
            <Template1 obj={item} size="preview" />
            <div
              className="absolute inset-0 w-full h-full p-10  flex items-center gap-5 rounded-xl cursor-pointer justify-center
             opacity-0 group-hover:opacity-100 transition-opacity  duration-300 bg-black bg-opacity-50"
            >
              <Button className="py-2 px-5 flex items-center justify-center gap-2 ">
                <p>Preview</p> <Eye />
              </Button>
              <Button
                onClick={() => selectResume(item?._id)}
                variant={"secondary"}
                className="py-2 px-5 flex items-center justify-center gap-2"
              >
                <p>Select</p> <Edit />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChooseTemplates;
