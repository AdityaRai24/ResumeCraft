"use client";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import {motion} from "framer-motion"

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

  return (
    <motion.div whileHover={{scale : 1.03}} whileTap={{scale: 0.97}} className="inline-block">
      <Button
        variant={type === "outline" ? "outline" : "default"}
        onClick={() => router.push(path)}
        className={cn(
          "px-16 py-8 rounded-full border border-primary text-md",
          type === "outline" && "shadow-md border border-black   "
        )}
      >
        {text}
      </Button>
    </motion.div>
  );
};

export default ContineBtn;
