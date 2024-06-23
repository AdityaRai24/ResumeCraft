import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Template1 from "@/templates/template1/template1";
import { Edit, Eye } from "lucide-react";
import Link from "next/link";

const page = () => {
  return (
    <>
      <div>
        <div className="flex items-center justify-center my-16">
          <div>
            <h1 className="text-4xl font-extrabold py-3">
              Templates recommended for you
            </h1>
            <p className="text-lg font-normal text-center">
              You can always change your template later.
            </p>
          </div>
        </div>

        <div className="max-w-[70%] mx-auto ">
          <div className="flex items-center shadow-lg rounded-lg p-3 bg-slate-100 justify-between">
            <div className="flex items-center justify-center gap-3">
              <h1 className="font-semibold">Filters : </h1>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Photo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="withphoto" className="cursor-pointer">
                    With Photo
                  </SelectItem>
                  <SelectItem value="withoutphoto" className="cursor-pointer">
                    Without Photo
                  </SelectItem>
                  <SelectItem value="any" className="cursor-pointer">
                    Any
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Columns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1" className="cursor-pointer">
                    One Column
                  </SelectItem>
                  <SelectItem value="2" className="cursor-pointer">
                    Two Column
                  </SelectItem>
                  <SelectItem value="any" className="cursor-pointer">
                    Any
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <h1 className="font-semibold">Color :</h1>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6  mt-5">
            <div className="relative group inline-block w-[360px] h-[420px]">
              <Template1 size="preview" />
              <div className="absolute inset-0 w-full h-full p-10  flex items-center gap-5 rounded-xl cursor-pointer justify-center opacity-0 group-hover:opacity-100 transition-opacity  duration-300 bg-black bg-opacity-50">
                <Button className="py-2 px-5 flex items-center justify-center gap-2 ">
                  <p>Preview</p> <Eye />
                </Button>
                <Button
                  variant={"secondary"}
                  className="py-2 px-5 flex items-center justify-center gap-2"
                >
                  <Link href={"/build-resume/123456"}>Select</Link> <Edit />
                </Button>
              </div>
            </div>

            <div className="relative group inline-block w-[360px] h-[420px]">
              <Template1 size="preview" />
              <div className="absolute inset-0 w-full h-full p-10  flex items-center gap-5 rounded-xl cursor-pointer justify-center opacity-0 group-hover:opacity-100 transition-opacity  duration-300 bg-black bg-opacity-50">
                <Button className="py-2 px-5 flex items-center justify-center gap-2 ">
                  <p>Preview</p> <Eye />
                </Button>
                <Button
                  variant={"secondary"}
                  className="py-2 px-5 flex items-center justify-center gap-2"
                >
                  <p>Select</p> <Edit />
                </Button>
              </div>
            </div>

            <div className="relative group inline-block w-[360px] h-[420px]">
              <Template1 size="preview" />
              <div className="absolute inset-0 w-full h-full p-10  flex items-center gap-5 rounded-xl cursor-pointer justify-center opacity-0 group-hover:opacity-100 transition-opacity  duration-300 bg-black bg-opacity-50">
                <Button className="py-2 px-5 flex items-center justify-center gap-2 ">
                  <p>Preview</p> <Eye />
                </Button>
                <Button
                  variant={"secondary"}
                  className="py-2 px-5 flex items-center justify-center gap-2"
                >
                  <p>Select</p> <Edit />
                </Button>
              </div>
            </div>

            <div className="relative group inline-block w-[360px] h-[420px]">
              <Template1 size="preview" />
              <div className="absolute inset-0 w-full h-full p-10  flex items-center gap-5 rounded-xl cursor-pointer justify-center opacity-0 group-hover:opacity-100 transition-opacity  duration-300 bg-black bg-opacity-50">
                <Button className="py-2 px-5 flex items-center justify-center gap-2 ">
                  <p>Preview</p> <Eye />
                </Button>
                <Button
                  variant={"secondary"}
                  className="py-2 px-5 flex items-center justify-center gap-2"
                >
                  <p>Select</p> <Edit />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
