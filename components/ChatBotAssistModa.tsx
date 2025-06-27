import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, BriefcaseBusiness } from 'lucide-react';
import { Button } from './ui/button';
import { useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from 'react-hot-toast';
import { useChatBotStore } from '@/store';

interface OnboardingFormData {
  desiredRole: string;
  experienceLevel: string;
}

interface ChatBotAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatBotAssistModal: React.FC<ChatBotAssistModalProps> = ({ isOpen, onClose }) => {
  const [onboardingData, setOnboardingData] = useState<OnboardingFormData>({
    desiredRole: '',
    experienceLevel: '',
  });

  const { user } = useUser();
  const params = useParams();
  const resumeId = params.id;

  const chatBotData = useQuery(api.chatBot.getChatbotData, {
    userId: user?.id || '',
    resumeId: resumeId as Id<"resumes">,
  });

  const updateUserProfile = useMutation(api.chatBot.updateUserProfile);
  const initializeChat = useMutation(api.chatBot.initializeChat);
  const pushMessage = useMutation(api.chatBot.pushMessage);
  const { pushText, fillMessages, setResume, setDesiredRole, setExperienceLevel } = useChatBotStore();
  const convex = useConvex();
  const resume = useQuery(api.resume.getTemplateDetails, { id: resumeId as Id<"resumes"> });

  const handleRoleSelect = (role: string) => {
    setOnboardingData({ ...onboardingData, desiredRole: role });
  };

  const handleExperienceSelect = (level: string) => {
    setOnboardingData({ ...onboardingData, experienceLevel: level });
  };

  const submitUserInfo = async () => {
    if (chatBotData && resumeId && user) {
      await updateUserProfile({
        userId: user.id,
        resumeId: resumeId as Id<"resumes">,
        desiredRole: onboardingData.desiredRole,
        experienceLevel: onboardingData.experienceLevel,
      });

      // Store onboarding info and resume in Zustand
      setDesiredRole(onboardingData.desiredRole);
      setExperienceLevel(onboardingData.experienceLevel);
      if (resume) setResume(resume);

      toast.success('Your profile has been updated successfully!');
      onClose();

      // Add a welcome message after info is submitted, only if not already present
      const welcomeMessage = `👋 Hi ${user?.firstName || 'there'}! I'm CraftBot, your personal AI assistant.\nI'm here to guide you through building a job-winning resume – step by step.`;
      const alreadyWelcomed = Array.isArray(chatBotData.content) && chatBotData.content.some(
        (msg: any) => msg.sender === 'bot' && msg.content?.message === welcomeMessage
      );
      if (!alreadyWelcomed) {
        await pushMessage({
          userId: user.id,
          resumeId: resumeId as Id<'resumes'>,
          message: { sender: 'bot', content: { type: 'text', message: welcomeMessage } },
          mode : "ask",
        });
      }

      // Initialize chat after sending welcome message
      await initializeChat({
        userId: user.id,
        resumeId: resumeId as Id<"resumes">,
      });

      // Fetch latest messages from DB and sync Zustand
      const updatedChatBotData = await convex.query(api.chatBot.getChatbotData, {
        userId: user.id,
        resumeId: resumeId as Id<'resumes'>,
      });
      if (updatedChatBotData && Array.isArray(updatedChatBotData.content)) {
        fillMessages(updatedChatBotData.content);
      }
    }
  };

  // Check if user info is needed
  const needsUserInfo = chatBotData && (
    !chatBotData.desiredRole ||
    chatBotData.desiredRole === '' ||
    !chatBotData.experienceLevel ||
    chatBotData.experienceLevel === ''
  );

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
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
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
                  <option value="Marketing Specialist">Marketing Specialist</option>
                  <option value="Other">Other</option>
                </select>
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
                  <option value="Entry Level">Entry Level</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior Level">Senior Level</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              <Button
                onClick={submitUserInfo}
                disabled={!onboardingData.desiredRole || !onboardingData.experienceLevel}
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
                Please complete this form to continue with your resume building experience
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatBotAssistModal;