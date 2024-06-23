import { Button } from "@/components/ui/button";
import { montserrat, partyone } from "@/utils/font";
import {
  Computer,
  LayoutTemplate,
  LucideBookTemplate,
  PencilLine,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <>
      <div className="flex items-center justify-center w-full h-screen">
        <div className="max-w-[70%] mx-auto">
          <h1
            className={`${partyone.className} text-center text-6xl font-extrabold `}
          >
            Here's what you need to know
          </h1>
          <div className="flex items-center justify-between gap-16 mt-24">
            <div className="flex flex-col gap-2 items-center justify-center">
              <LayoutTemplate size={70} />
              <h1 className="font-semibold text-3xl">Step 1</h1>
              <p className="text-md text-justify">
                Check out our pre-designed templates and guided steps, allowing
                you to create a polished resume faster.
              </p>
            </div>

            <div className="flex flex-col gap-2 items-center justify-center">
              <PencilLine size={70} />
              <h1 className="font-semibold text-3xl">Step 2</h1>
              <p className="text-md text-justify">
                Check out our pre-designed templates and guided steps, allowing
                you to create a polished resume faster.
              </p>
            </div>

            <div className="flex flex-col gap-2 items-center justify-center">
              <Computer size={70} />
              <h1 className="font-semibold text-3xl">Step 3</h1>
              <p className="text-md text-justify">
                Check out our pre-designed templates and guided steps, allowing
                you to create a polished resume faster.
              </p>
            </div>
          </div>
          <Button className="block mx-auto mt-8 px-24 pt-8 pb-8 rounded-full">
            <Link
              href={"/build-resume/templates"}
              className="w-full h-full flex items-center text-xl justify-center"
            >
              Continue
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default page;
