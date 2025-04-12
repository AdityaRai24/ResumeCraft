import React from "react";
import { motion } from "framer-motion";
import { Loader2, XIcon } from "lucide-react";

const ChatBotModal = ({
  isGenerating,
  generatedContent,
  selectOption,
  closeModal,
  title,
  loadingText,
}: {
  isGenerating: boolean;
  generatedContent: any;
  selectOption: any;
  closeModal: any;
  title: string;
  loadingText: string;
}) => {
  console.log(generatedContent);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-primary/80 to-primary p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={closeModal}
            className="text-white/80 hover:text-white transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Loader2 className="w-10 h-10 text-primary" />
              </motion.div>
              <p className="mt-4 text-gray-600 text-center">{loadingText}</p>
            </div>
          ) : (
            <div className="">
              <div className="bg-gray-50 p-3 border-b border-gray-200">
                <h3 className="font-medium text-gray-800">Generated Content</h3>
              </div>
              <ul>
                {Array.isArray(generatedContent) ? (
                  generatedContent.map((summary: any, index: any) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all"
                    >
                      <div className="p-4 pl-8">
                        <li
                          dangerouslySetInnerHTML={{ __html: summary }}
                          className="text-gray-700"
                        />
                      </div>
                    </motion.li>
                  ))
                ) : (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div
                        dangerouslySetInnerHTML={{ __html: generatedContent }}
                        className="text-gray-700 mb-4"
                      />
                     
                    </div>
                  </div>
                )}
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectOption(generatedContent)}
                    className="bg-primary cursor-pointer w-full mt-4 text-center justify-center text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    Select These Options
                  </motion.button>
                </div>
              </ul>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={closeModal}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatBotModal;
