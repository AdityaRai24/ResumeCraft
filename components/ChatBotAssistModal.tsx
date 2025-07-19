import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, BriefcaseBusiness } from "lucide-react";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "react-hot-toast";
import { useChatBotStore } from "@/store";

interface OnboardingFormData {
  desiredRole: string;
  experienceLevel: string;
}

interface ChatBotAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatBotAssistModal: React.FC<ChatBotAssistModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [onboardingData, setOnboardingData] = useState<OnboardingFormData>({
    desiredRole: "",
    experienceLevel: "",
  });

  const { user } = useUser();
  const params = useParams();
  const resumeId = params.id;

  const chatBotData = useQuery(api.chatBot.getChatbotData, {
    userId: user?.id || "",
    resumeId: resumeId as Id<"resumes">,
  });

  const updateUserProfile = useMutation(api.chatBot.updateUserProfile);
  const initializeChat = useMutation(api.chatBot.initializeChat);
  const pushMessage = useMutation(api.chatBot.pushMessage);
  const { fillMessages, setResume, setDesiredRole, setExperienceLevel } =
    useChatBotStore();
  const convex = useConvex();
  const resume = useQuery(api.resume.getTemplateDetails, {
    id: resumeId as Id<"resumes">,
  });

  const [customRole, setCustomRole] = useState("");

  const handleRoleSelect = (role: string) => {
    setOnboardingData({ ...onboardingData, desiredRole: role });
    if (role !== "Other") setCustomRole("");
  };

  const handleExperienceSelect = (level: string) => {
    setOnboardingData({ ...onboardingData, experienceLevel: level });
  };

  const submitUserInfo = async () => {
    if (chatBotData && resumeId && user) {
      const finalRole = onboardingData.desiredRole === "Other" ? customRole : onboardingData.desiredRole;
      await updateUserProfile({
        userId: user.id,
        resumeId: resumeId as Id<"resumes">,
        desiredRole: finalRole,
        experienceLevel: onboardingData.experienceLevel,
      });

      setDesiredRole(finalRole);
      setExperienceLevel(onboardingData.experienceLevel);
      if (resume) setResume(String(resumeId), resume);

      toast.success("Your profile has been updated successfully!");
      onClose();

      // const welcomeMessage = `👋 Hi ${user?.firstName || "there"}! I'm CraftBot, your personal AI assistant.\nI'm here to guide you through building a job-winning resume – step by step.`;
      // const alreadyWelcomed =
      //   Array.isArray(chatBotData.content) &&
      //   chatBotData.content.some(
      //     (msg: any) =>
      //       msg.sender === "bot" && msg.content?.message === welcomeMessage
      //   );
      // if (!alreadyWelcomed) {
      //   await pushMessage({
      //     userId: user.id,
      //     resumeId: resumeId as Id<"resumes">,
      //     message: {
      //       sender: "bot",
      //       content: {
      //         type: "text",
      //         message: welcomeMessage,
      //         messageType: "info",
      //       },
      //     },
      //   });
      // }

      await initializeChat({
        userId: user.id,
        resumeId: resumeId as Id<"resumes">,
      });

      // const updatedChatBotData = await convex.query(
      //   api.chatBot.getChatbotData,
      //   {
      //     userId: user.id,
      //     resumeId: resumeId as Id<"resumes">,
      //   }
      // );
      // if (updatedChatBotData && Array.isArray(updatedChatBotData.content)) {
      //   fillMessages(updatedChatBotData.content);
      // }
    }
  };

  // Check if user info is needed
  const needsUserInfo =
    chatBotData &&
    (!chatBotData.desiredRole ||
      chatBotData.desiredRole === "" ||
      !chatBotData.experienceLevel ||
      chatBotData.experienceLevel === "");

  // Auto-close modal if user info is not needed
  useEffect(() => {
    if (chatBotData && !needsUserInfo) {
      onClose();
    }
  }, [chatBotData, needsUserInfo, onClose]);

  return (
    <AnimatePresence>
      {isOpen && needsUserInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <User size={24} className="text-primary" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to ResumeCraft!
              </h2>
              <p className="text-gray-600 text-sm">
                Let's personalize your resume building experience
              </p>
            </div>

            {/* Form */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What is your desired job role?
                </label>
                <select
                  value={onboardingData.desiredRole}
                  onChange={(e) => handleRoleSelect(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-white"
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="UX/UI Designer">UX/UI Designer</option>
                  <option value="Marketing Specialist">
                    Marketing Specialist
                  </option>
                  <option value="Other">Other (please specify below)</option>
                </select>
                {onboardingData.desiredRole === "Other" && (
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="Enter your desired job role (e.g., Frontend Developer, DevOps Engineer, etc.)"
                    className="w-full mt-2 px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-white"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What is your experience level?
                </label>
                <select
                  value={onboardingData.experienceLevel}
                  onChange={(e) => handleExperienceSelect(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 bg-white"
                >
                  <option value="" disabled>
                    Select experience level
                  </option>
                  <option value="Entry Level">Entry Level (0-2 years)</option>
                  <option value="Mid Level">Mid Level (2-5 years)</option>
                  <option value="Senior Level">Senior Level (5-10 years)</option>
                  <option value="Executive">Executive (10+ years)</option>
                </select>
              </div>

              <Button
                onClick={submitUserInfo}
                disabled={
                  !onboardingData.desiredRole ||
                  (onboardingData.desiredRole === "Other" && !customRole) ||
                  !onboardingData.experienceLevel
                }
                className="w-full mt-6 flex items-center justify-center gap-2 py-3 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <BriefcaseBusiness size={18} />
                <span>Get Started</span>
              </Button>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-6"
            >
              <p className="text-xs text-gray-500">
                Please complete this form to continue with your resume building
                experience
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatBotAssistModal;
