import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  Send,
  Sparkles,
  User,
  BriefcaseBusiness,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OptionMessage, TextMessage, useChatBotStore } from "@/store";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "react-hot-toast";

interface ChatMessage {
  id: string;
  content: TextMessage | OptionMessage;
  sender: "user" | "bot";
  isTyping?: boolean;
}

interface OnboardingFormData {
  desiredRole: string;
  experienceLevel: string;
}

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const {
    messages: storeMessages,
    pushText,
    pushOptions,
    resetMessages,
    fillMessages,
  } = useChatBotStore((state) => state);
  const [displayMessages, setDisplayMessages] = useState<ChatMessage[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [lastProcessedMessageCount, setLastProcessedMessageCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [needsUserInfo, setNeedsUserInfo] = useState(false);

  const {onboardingData, setOnBoardingData} = useChatBotStore((state) => state);


  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();
  const params = useParams();
  const resumeId = params.id;

  const chatBotData = useQuery(api.chatBot.getChatbotData, {
    userId: user?.id || "",
    resumeId: resumeId as Id<"resumes">,
  });

  const pushMessage = useMutation(api.chatBot.pushMessage);
  const updateUserProfile = useMutation(api.chatBot.updateUserProfile);

  // This effect handles pushing new messages to the backend when they're added to the store
  useEffect(() => {
    if (user && resumeId && storeMessages.length > lastProcessedMessageCount) {
      const newMessages = storeMessages.slice(lastProcessedMessageCount);

      newMessages.forEach((msg) => {
        let cleanMessage = msg;

        if (msg.content.type === "options") {
          cleanMessage = {
            ...msg,
            content: {
              ...msg.content,
              options: msg.content.options.map((option) => ({
                label: option.label,
                value: option.value,
              })),
            },
          };
        } else {
          cleanMessage = {
            ...msg,
            content: {
              ...msg.content,
              message: msg.content.message,
            },
          };
        }

        pushMessage({
          userId: user.id,
          resumeId: resumeId as Id<"resumes">,
          message: cleanMessage,
        });
      });
    }
  }, [storeMessages, user, resumeId, pushMessage]);

  const handleRoleSelect = (role: string) => {
    setOnBoardingData({ ...onboardingData, desiredRole: role });
  };

  const handleExperienceSelect = (level: string) => {
    setOnBoardingData({ ...onboardingData, experienceLevel: level });
  };

  console.log(onboardingData)

  const submitUserInfo = async () => {
    if (chatBotData && resumeId && user) {
      await updateUserProfile({
        userId: user.id,
        resumeId: resumeId as Id<"resumes">,
        desiredRole: onboardingData.desiredRole,
        experienceLevel: onboardingData.experienceLevel,
      });

      toast.success("Your profile has been updated successfully!");
      setNeedsUserInfo(false);

      // Add a welcome message after info is submitted
      const welcomeMessage = `👋 Hi ${user?.firstName || "there"}! I'm CraftBot, your personal AI assistant.
I'm here to guide you through building a job-winning resume – step by step.`;

      pushText(welcomeMessage, "bot");

      // No need to push message here since the useEffect will handle it
    }
  };

  useEffect(() => {
    if (chatBotData && !isInitialized) {
      // Reset any existing messages first
      resetMessages();

      // Check if we need to ask for user information
      if (
        !chatBotData.desiredRole ||
        chatBotData.desiredRole === "" ||
        !chatBotData.experienceLevel ||
        chatBotData.experienceLevel === ""
      ) {
        setNeedsUserInfo(true);
      } else {
        // If we have previous messages, fill the store with them
        if (
          chatBotData.content &&
          Array.isArray(chatBotData.content) &&
          chatBotData.content.length > 0
        ) {
          fillMessages(chatBotData.content);
        } else {
          // If no previous messages but we have user info, send a welcome message
          const welcomeMessage = `👋 Hi ${user?.firstName || "there"}! I'm CraftBot, your personal AI assistant.
          I'm here to guide you through building a job-winning resume – step by step.`;

          pushText(welcomeMessage, "bot");
        }
      }

      setIsInitialized(true);
    }
  }, [chatBotData, pushText, resetMessages, fillMessages, isInitialized]);

  useEffect(() => {
    if (storeMessages.length > lastProcessedMessageCount) {
      const newMessages = storeMessages.slice(lastProcessedMessageCount);

      // Process each new message
      newMessages.forEach((msg) => {
        // Only show typing indicator for bot messages
        if (msg.sender === "bot") {
          // Create typing indicator
          const typingMessageId = `typing-${Date.now()}-${Math.random()}`;
          const typingMessage: ChatMessage = {
            id: typingMessageId,
            content: { type: "text", message: "" },
            sender: "bot",
            isTyping: true,
          };

          // Add typing indicator
          setDisplayMessages((prev) => [...prev, typingMessage]);

          // After 1.5s, replace with actual message and remove typing indicator
          setTimeout(() => {
            setDisplayMessages((prev) => {
              // Convert the message from store to display format with ID
              const actualMessage: ChatMessage = {
                ...msg,
                id: `msg-${Math.random().toString(36).substr(2, 9)}`,
              };

              // Replace typing indicator with actual message
              return [
                ...prev.filter((m) => m.id !== typingMessageId),
                actualMessage,
              ];
            });
          }, 1500);
        } else {
          // For user messages, add them immediately with no typing effect
          setDisplayMessages((prev) => [
            ...prev,
            {
              ...msg,
              id: `msg-${Math.random().toString(36).substr(2, 9)}`,
            },
          ]);
        }
      });

      // Update the counter of processed messages
      setLastProcessedMessageCount(storeMessages.length);
    }
  }, [storeMessages, lastProcessedMessageCount]);

  const handleSend = () => {
    if (message.trim() === "") return;
    pushText(message, "user");
    setMessage("");
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const sidebarVariants = {
    open: { width: "320px", opacity: 1, x: 0 },
    closed: { width: 0, opacity: 0, x: "-100%" },
  };

  const toggleButtonVariants = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -20 },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const TypingIndicator = () => (
    <div className="flex space-x-1 items-center p-1">
      <motion.div
        className="w-2 h-2 rounded-full bg-gray-600"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          delay: 0,
        }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-gray-600"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          delay: 0.2,
        }}
      />
      <motion.div
        className="w-2 h-2 rounded-full bg-gray-600"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          delay: 0.4,
        }}
      />
    </div>
  );

  return (
    <div className="flex h-screen relative">
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={toggleButtonVariants}
            className="absolute top-4 left-4 z-10 bg-white p-2 rounded-full shadow-md cursor-pointer"
            onClick={toggleSidebar}
          >
            <ArrowRightToLine className="text-primary" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={isExpanded ? "open" : "closed"}
        variants={sidebarVariants}
        initial="open"
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className="border-r border-gray-200 overflow-hidden"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <motion.div
            className="bg-primary w-full text-white p-4 flex items-center justify-between gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ rotate: -30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <Sparkles size={18} />
              </motion.div>
              <h2 className="text-base font-medium">AI Resume Assistant</h2>
            </div>
            <motion.div
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSidebar}
            >
              <ArrowLeftToLine />
            </motion.div>
          </motion.div>

          <motion.p
            className="text-center w-full bg-white text-sm text-gray-500 py-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Your personal resume coach
          </motion.p>

          {/* Message Container */}
          <div className="flex-1 w-full bg-white p-4 overflow-y-auto">
            {/* User Onboarding Form */}
            {needsUserInfo && (
              <motion.div
                variants={formVariants}
                initial="hidden"
                animate="visible"
                className="bg-gray-50 p-4 rounded-lg shadow-md mb-4 border border-gray-200"
              >
                <h3 className="text-primary text-sm font-medium mb-3 flex items-center gap-2">
                  <User size={16} />
                  Please tell me about yourself
                </h3>
                <p className="text-xs">
                  This will help me assist you better with your resume.
                </p>

                <div className="space-y-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      What is your desired job role?
                    </label>
                    <select
                      value={onboardingData.desiredRole}
                      onChange={(e) => handleRoleSelect(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="" disabled>
                        Select a role
                      </option>
                      <option value="Software Engineer">
                        Software Engineer
                      </option>
                      <option value="Product Manager">Product Manager</option>
                      <option value="Data Scientist">Data Scientist</option>
                      <option value="UX/UI Designer">UX/UI Designer</option>
                      <option value="Marketing Specialist">
                        Marketing Specialist
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      What is your experience level?
                    </label>
                    <select
                      value={onboardingData.experienceLevel}
                      onChange={(e) => handleExperienceSelect(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                    disabled={
                      !onboardingData.desiredRole ||
                      !onboardingData.experienceLevel
                    }
                    className="w-full mt-2 flex items-center justify-center gap-2"
                  >
                    <BriefcaseBusiness size={16} />
                    <span>Submit Profile</span>
                  </Button>
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {displayMessages.map((msg) => {
                return (
                  <motion.div
                    key={msg.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className={`mb-4 max-w-[95%] text-wrap ${
                      msg.sender === "user" ? "ml-auto" : "mr-auto"
                    }`}
                  >
                    <div
                      className={`p-4 rounded-lg text-sm shadow-sm ${
                        msg.sender === "user"
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {msg.isTyping ? (
                        <TypingIndicator />
                      ) : (
                        <>
                          <motion.div
                            initial={{ opacity: msg.sender === "bot" ? 0 : 1 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              duration: msg.sender === "bot" ? 0.3 : 0,
                            }}
                          >
                            {msg.content.message}
                          </motion.div>
                          {msg.content.type === "options" && (
                            <motion.div className="mt-3 text-wrap max-w-[95%]  flex flex-wrap gap-2">
                              {msg.content.options.map((option) => (
                                <Button
                                  size={"sm"}
                                  variant={"outline"}
                                  onClick={option.onClick}
                                  className="mb-1 hover:bg-primary hover:text-white text-xs text-black border border-primary p-2 rounded-lg"
                                  key={option.value}
                                >
                                  {option.label}
                                </Button>
                              ))}
                            </motion.div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 ml-1">
                      {msg.sender === "bot" ? "AI Assistant" : "You"}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <motion.div
            className="p-4 border-t border-gray-200 flex gap-2 bg-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              whileFocus={{
                boxShadow: "0 0 0 2px rgba(var(--color-primary), 0.3)",
              }}
            />
            <motion.button
              onClick={handleSend}
              disabled={message.trim() === "" || needsUserInfo}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Send size={16} />
              <span>Send</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chatbot;
