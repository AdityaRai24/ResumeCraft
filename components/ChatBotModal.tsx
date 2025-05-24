import React from "react";
import { motion } from "framer-motion";
import { Loader2, XIcon, Check } from "lucide-react";

interface SummaryOption {
  title: string;
  content: string;
}

const ChatBotModal = ({
  isGenerating,
  generatedContent,
  selectOption,
  closeModal,
  title,
  loadingText,
}: {
  isGenerating: boolean;
  generatedContent: SummaryOption[] | string;
  selectOption: (option: SummaryOption) => void;
  closeModal: () => void;
  title: string;
  loadingText: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100"
      >
        <div className="bg-gradient-to-r from-primary/90 to-primary p-5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {title}
          </h2>
          <button
            onClick={closeModal}
            className="text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10 p-1"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Loader2 className="w-12 h-12 text-primary" />
              </motion.div>
              <p className="mt-6 text-gray-600 text-center font-medium">
                {loadingText}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 border-l-4 border-primary rounded-md">
                <h3 className="font-medium text-gray-800">Generated Content</h3>
              </div>
              <ul className="space-y-4">
                {Array.isArray(generatedContent) ? (
                  generatedContent.map(
                    (summary: SummaryOption, index: number) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        <div className="p-5 pl-6">
                          <h2 className="font-semibold text-gray-900 mb-2">
                            {summary.title}
                          </h2>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: summary.content,
                            }}
                            className="text-gray-700 prose prose-sm max-w-none"
                          />
                          <div className="mt-4 flex justify-end">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => selectOption(summary)}
                              className="bg-primary cursor-pointer text-center justify-center text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
                            >
                              <Check className="w-4 h-4" />
                              Select This Option
                            </motion.button>
                          </div>
                        </div>
                      </motion.li>
                    )
                  )
                ) : (
                  <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300">
                    <div className="p-5">
                      <div
                        dangerouslySetInnerHTML={{ __html: generatedContent }}
                        className="text-gray-700 prose prose-sm max-w-none mb-4"
                      />
                      <div className="mt-4 flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            selectOption({
                              title: "Generated Content",
                              content: generatedContent as string,
                            })
                          }
                          className="bg-primary cursor-pointer text-center justify-center text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
                        >
                          <Check className="w-4 h-4" />
                          Select This Content
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-200 flex justify-end bg-gray-50">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={closeModal}
            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium shadow-sm"
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatBotModal;
