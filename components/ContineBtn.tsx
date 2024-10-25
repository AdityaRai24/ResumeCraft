"use client";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useRouter } from "nextjs-toploader/app";
import useMobile from "@/lib/useMobile";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ContineBtn = ({
  path,
  type,
  text,
}: {
  path: string;
  type: string;
  text: string;
}) => {
  const router = useRouter();
  const isMobile = useMobile();

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-block w-full md:w-auto`}
    >
      <Button
        variant={type === "outline" ? "outline" : "default"}
        onClick={() => router.push(path)}
        className={cn(
          text === "Back" && "border-2 border-primary",
          isMobile && "!rounded-md !px-6 !py-6 active:scale-[0.97] hover:scale-[1.03] transition-all duration-300 ease-out",
          "px-16 flex items-center gap-2 py-8 rounded-full w-full text-md mt-4",
        )}
      >
        {text}{" "}
        {(text === "Continue" || text === "Next") ? (
          <ArrowRight size={18} className="mb-[2px]" />
        ) : (
          <ArrowLeft size={18} className="mb-[2px]" />
        )}
      </Button>
    </motion.div>
  );
};

export default ContineBtn;
