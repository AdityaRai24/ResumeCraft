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
import { Skeleton } from "./ui/skeleton";

const ChooseTemplates = () => {
  const { user } = useUser();
  const templates = useQuery(api.resume.getTemplates);

  const createUserResume = useMutation(api.resume.createUserResume);
  const router = useRouter();

  if (templates === null) {
    return <div>No templates</div>;
  }
  if (templates === undefined) {
    return <ChooseSkeleton />;
  }
  if (!user) return null;

  const selectResume = async (id: Id<"resumes">) => {
    const promise = createUserResume({
      id: id,
      userId: user?.id,
    })
      .then((res) => {
        return router.push(`/build-resume/${res}/tips?sec=header`);
      })
      .catch((err) => {
        toast.error("Something went wrong...");
      });
  };

  return (
    <div className="grid grid-cols-3 gap-6  mt-5">
      {templates?.map((item) => {
        console.log(item);
        return (
          <div
            key={item?._id}
            className="relative group inline-block w-[319px] h-[449px]"
          >
            <Template1 obj={item} isPreview />
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

const ChooseSkeleton = () => {
  return (
    <>
      <div className="grid grid-cols-3 gap-6 mt-5">
        {[0, 1, 2].map((item) => (
          <Skeleton className=" w-[319px] h-[449px] bg-slate-500/20" />
        ))}
      </div>
    </>
  );
};

export default ChooseTemplates;
