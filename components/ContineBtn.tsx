"use client"
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const ContineBtn = ({path,type,text}: {path: string,type:string,text:string}) => {

    const router = useRouter()

  return (
    <Button
      variant={type === "outline" ? "outline" : "default"}
      onClick={() =>
        router.push(path)
      }
      className={cn("px-16 py-8 rounded-full border border-primary text-md",type==="outline" && "shadow-md border border-black   ")}
    >
        {text}
    </Button>
  );
};

export default ContineBtn;
