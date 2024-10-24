import ChooseTemplates from "@/components/ChooseTemplates";
import Navbar from "@/components/Navbar";

const Page = () => {
  return (
    <>
      <div className="w-full">
        <Navbar />
        <div className="flex items-center mt-8 mb-6 w-[90%] md:w-[85%] mx-auto">
          <div>
            <h1 className="text-2xl text-left font-medium tracking-normal pt-3 pb-1">
              Recommended Templates
            </h1>
            <p className="text-[15px] text-gray-600">
              Start with a solid foundation — select a template and build your
              perfect resume.
            </p>
          </div>
        </div>

        <div className="max-w-[90%] md:max-w-[85%] mx-auto flex items-center justify-start">
          <ChooseTemplates />
        </div>
      </div>
    </>
  );
};

export default Page;
