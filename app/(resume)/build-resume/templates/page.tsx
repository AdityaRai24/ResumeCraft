import ChooseTemplates from "@/components/ChooseTemplates";
import Navbar from "@/components/Navbar";

const Page = () => {
  return (
    <>
      <div>
        <Navbar />
        <div className="flex items-center justify-center my-16">
          <div>
            <h1 className="text-4xl font-semibold py-3">
              Templates recommended for you
            </h1>
          </div>
        </div>

        <div className="max-w-[70%] mx-auto ">
          <ChooseTemplates />
        </div>
      </div>
    </>
  );
};

export default Page;
