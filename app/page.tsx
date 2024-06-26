"use client"
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { montserrat } from "@/utils/font";
import Link from "next/link";
import { motion } from "framer-motion";
import { container, item } from "@/lib/motion";

export default function Home() {
  return (
    <>
      <Navbar />
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="my-24 w-[80%] mx-auto flex items-center justify-between"
      >
        <div className="max-w-[70%]">
          <motion.h1
            className={cn(
              "text-6xl font-extrabold leading-tight",
              montserrat.className
            )}
            variants={item}
          >
            Craft a Winning Resume <br /> in Minutes
          </motion.h1>
          <motion.p variants={item} className="font-normal text-md py-3">
            Choose from a variety of customizable templates, fill in your
            details, and watch your resume come to life in real-time. Our
            intuitive platform ensures you present your best self to potential
            employers. Start building your dream career today!
          </motion.p>
          <motion.div variants={item}>
            <Link href={"/build-resume/steps"}>
              <Button className="my-4 py-[30px] hover:scale-[1.03] active:scale-[0.97] transition duration-300 ease-in-out text-lg rounded-full px-8">
                Create Your Resume
              </Button>
            </Link>
          </motion.div>
        </div>
        <div></div>
      </motion.div>
    </>
  );
}
