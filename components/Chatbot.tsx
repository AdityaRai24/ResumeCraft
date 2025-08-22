import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  Send,
  Sparkles,
  User,
  Bot,
  MessageSquare,
  HelpCircle,
  CheckCircle,
  Loader2,
  XIcon,
  History,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OptionMessage, TextMessage, useChatBotStore } from "@/store";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import axios from "axios";
import ActionConfirmationModal from "./ActionConfirmationModal";
import { v4 as uuidv4 } from "uuid";

interface ChatbotProps {
  isOnboardingModalOpen?: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOnboardingModalOpen = false }) => {
  const [message, setMessage] = useState("");
  const params = useParams();

  const {
    messages: storeMessages,
    fillMessages,
    getResume,
    setResume,
    desiredRole: desiredRoleFromStore,
    experienceLevel: experienceLevelFromStore,
    pushTyping,
    removeTyping,
    pushText,
    taggedText,
    clearTaggedText,
    taggedTag,
    clearTaggedTag,
    resumeCheckpoints,
    saveCheckpoint,
    restoreCheckpoint,
  } = useChatBotStore((state) => state);
  const resumeFromStore = getResume(params.id as string);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isBotLoading, setIsBotLoading] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    heading: "",
    description: "",
    buttonText: "",
    onConfirm: async () => {},
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useUser();
  const resumeId = params.id;
  const prevOnboardingRef = useRef(isOnboardingModalOpen);
  const [isJDModalOpen, setIsJDModalOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [isJDLoading, setIsJDLoading] = useState(false);
  const [jdError, setJDError] = useState("");
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [pendingRestoreId, setPendingRestoreId] = useState<string | null>(null);

  const chatBotData = useQuery(api.chatBot.getChatbotData, {
    userId: user?.id || "",
    resumeId: resumeId as Id<"resumes">,
  });
  const updateResumeMutation = useMutation(api.resume.updateResumeSections);

  useEffect(() => {
    if (
      chatBotData &&
      chatBotData.chatInitialized &&
      Array.isArray(chatBotData.content)
    ) {
      const messagesWithId = chatBotData.content.map((msg: any) => ({
        ...msg,
        id: msg.id || `msg-${Date.now()}-${Math.random()}`,
      }));
      fillMessages(messagesWithId);
      setIsInitialized(true);
    }
  }, [chatBotData, fillMessages]);

  useEffect(() => {
    if (prevOnboardingRef.current && !isOnboardingModalOpen) {
      setTimeout(() => {
        pushTyping("Setting up your personalized AI assistant...");
        setTimeout(() => {
          removeTyping();
          const welcomeMessage = `👋 Hi ${user?.firstName || "there"}! I'm CraftBot, your personal AI assistant.\nI'm here to guide you through building a job-winning resume – step by step.`;
          pushText(welcomeMessage, "bot", { messageType: "info" });
        }, 1500);
      }, 1500);
    }
    prevOnboardingRef.current = isOnboardingModalOpen;
  }, [isOnboardingModalOpen, pushTyping, removeTyping, pushText, user]);

  const handleSend = async () => {
    if (!chatBotData?.chatInitialized) return;
    if (!user || !user.id) return;
    if (message.trim() === "") return;

    const messageId = uuidv4();

    if (taggedTag) {
      setMessage("");
      inputRef.current?.focus();
      pushText(message, "user", { messageType: "info", id: messageId });
      saveCheckpoint(messageId, resumeFromStore);
      pushTyping("Updating the tagged text in your resume...");
      setIsBotLoading(true);

      try {
        const response = await axios.post(`/api/replace-tagged-text`, {
          resume: resumeFromStore,
          section: taggedTag.section,
          taggedText: taggedTag.text,
          description: message,
          index : taggedTag.index
        });
        if (response.data && response.data.updatedResume) {
          setIsBotLoading(false);
          setResume(params.id as string, response.data.updatedResume);
          removeTyping();
          pushText(
            response.data.confirmationMsg ||
              "✨ The tagged text has been updated as requested!",
            "bot",
            { messageType: "info" }
          );
        } else {
          setIsBotLoading(false);
          removeTyping();
          pushText(
            response.data?.error ||
              "Sorry, I couldn't update the tagged text. Please try again.",
            "bot",
            { messageType: "error" }
          );
        }
      } catch (error) {
        setIsBotLoading(false);
        removeTyping();
        pushText(
          "I apologize, but I encountered an error while updating the tagged text. Please try again.",
          "bot",
          { messageType: "error" }
        );
      }
      clearTaggedTag();
      return;
    }

    // If no tag, proceed as before
    let userMessage = message;
    setMessage("");
    inputRef.current?.focus();

    pushText(userMessage, "user", { messageType: "info", id: messageId });
    saveCheckpoint(messageId, resumeFromStore);

    pushTyping("I'm working on your request...");
    setIsBotLoading(true);

    const last5 = storeMessages
      .filter(m => !m.isTyping)
      .slice(-5)
      .map(m => ({
        sender: m.sender,
        content: m.content.message,
        type: m.content.type,
      }));
      console.log(resumeFromStore)
    try {
      const response = await axios.post(`http://localhost:3000/api/chatbot`, {
        userId: user.id,
        resumeId: resumeId as Id<"resumes">,
        message: {
          sender: "user",
          content: { type: "text", message: userMessage },
        },
        resume: resumeFromStore,
        desiredRole: desiredRoleFromStore,
        experienceLevel: experienceLevelFromStore,
        history: last5,
      });

      // Handle out-of-scope response
      if (response.data && response.data.outOfScope) {
        setIsBotLoading(false);
        removeTyping();
        pushText(
          response.data.message ||
            "Sorry, I can only help with resume changes or questions about your resume.",
          "bot",
          { messageType: "error" }
        );
        return;
      }

      // Handle advice response
      if (response.data && response.data.advice) {
        setIsBotLoading(false);
        removeTyping();
        pushText(response.data.advice, "bot", { messageType: "info" });
        return;
      }

      if (response.data && response.data.updatedResume) {
        setIsBotLoading(false);
        setResume(params.id as string, response.data.updatedResume);
        removeTyping();
        const botMsg = response.data.confirmationMsg ||
          "✨ Perfect! I've updated your resume based on your request. The changes have been applied successfully!";
        pushText(botMsg, "bot", { messageType: "info" });
        return;
      }
    } catch (error) {
      setIsBotLoading(false);
      removeTyping();
      const errorMsg =
        "I apologize, but I encountered an error while processing your request. Please try again.";
      pushText(errorMsg, "bot", { messageType: "error" });
    }
  };

  const confirmAction = async (actionType: string) => {
    setIsBotLoading(true);
    // Note: The modal will be closed by the calling function.
    // We start the bot loading process here.

    pushTyping(
      `I'm on it! Running the ${actionType.toUpperCase()} analysis...`
    );

    console.log(resumeFromStore);

    try {
      const response = await axios.post(
        `http://localhost:3000/api/action-${actionType}`,
        {
          resume: resumeFromStore.sections,
          desiredRole: desiredRoleFromStore,
          experienceLevel: experienceLevelFromStore,
        }
      );
      console.log(response.data);
      const updatedResumeSections = response.data.updatedResume;

      if (resumeFromStore && updatedResumeSections) {
        const updatedResume = {
          ...resumeFromStore,
          sections: updatedResumeSections,
        };

        setResume(params.id as string, updatedResume);

        await updateResumeMutation({
          id: resumeId as Id<"resumes">,
          sections: updatedResumeSections,
        });
      }

      removeTyping();
      const botMsg = `✨ Done! The ${actionType.toUpperCase()} scan is complete. I've analyzed your resume and the results are ready for your review.`;
      pushText(botMsg, "bot", { messageType: "success" });
      setIsBotLoading(false);
      setIsActionModalOpen(false); // Ensure modal is closed
    } catch (error) {
      removeTyping();
      const errorMsg = `I'm sorry, I encountered an error during the ${actionType.toUpperCase()} scan. Please try again.`;
      pushText(errorMsg, "bot", { messageType: "error" });
      setIsBotLoading(false);
      setIsActionModalOpen(false); // Ensure modal is closed
    }
  };

  const handleOneClickATS = () => {
    setModalContent({
      heading: "One-Click ATS Check",
      description: `This action will perform a comprehensive analysis of your resume against common Applicant Tracking System (ATS) standards.
      \nHere's what it does:
      - Scans for keywords relevant to your desired role.
      - Checks for proper formatting and structure.
      - Ensures dates, contact information, and section headings are parsable.
      - Provides a summary of potential issues and suggestions for improvement.
      \nThis will help increase your resume's chances of passing the initial automated screening.`,
      buttonText: "Run ATS Check",
      onConfirm: () => confirmAction("ats"),
    });
    setIsActionModalOpen(true);
  };

  const handleMatchJD = () => {
    setJobDescription("");
    setJDError("");
    setIsJDModalOpen(true);
  };

  const handleJDSubmit = async () => {
    if (!jobDescription.trim()) {
      setJDError("Please enter a job description.");
      return;
    }
    setIsJDLoading(true);
    setJDError("");
    pushTyping("Analyzing your resume against the job description...");
    try {
      const response = await axios.post(`http://localhost:3000/api/action-jd`, {
        resume: resumeFromStore.sections,
        desiredRole: desiredRoleFromStore,
        experienceLevel: experienceLevelFromStore,
        jobDescription,
      });
      const updatedResumeSections = response.data.updatedResume;
      if (resumeFromStore && updatedResumeSections) {
        const updatedResume = {
          ...resumeFromStore,
          sections: updatedResumeSections,
        };
        setResume(params.id as string, updatedResume);
        await updateResumeMutation({
          id: resumeId as Id<"resumes">,
          sections: updatedResumeSections,
        });
      }
      removeTyping();
      const botMsg =
        "✨ Done! Your resume has been analyzed and tailored to the job description. Review the changes for best results.";
      pushText(botMsg, "bot", { messageType: "success" });
      setIsJDModalOpen(false);
      setIsJDLoading(false);
    } catch (error) {
      removeTyping();
      setJDError(
        "Sorry, there was an error matching your resume to the job description. Please try again."
      );
      pushText(
        "Sorry, there was an error matching your resume to the job description. Please try again.",
        "bot",
        { messageType: "error" }
      );
      setIsJDLoading(false);
    }
  };

  const handleFixInconsistencies = () => {
    setModalContent({
      heading: "Fix Resume Inconsistencies",
      description: `This action will automatically scan your entire resume for common errors and inconsistencies.
      \nThe assistant will look for:
      - Inconsistent date formats (e.g., "May 2023" vs. "05/2023").
      - Mismatched company names or job titles across sections.
      - Grammatical errors and typos.
      - Verb tense consistency in your bullet points.
      \nApplying these fixes will make your resume look more professional and polished.`,
      buttonText: "Find and Fix",
      onConfirm: () => confirmAction("inconsistencies"),
    });
    setIsActionModalOpen(true);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [storeMessages]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const sidebarVariants = {
    open: { width: "350px", opacity: 1, x: 0 },
    closed: { width: 0, opacity: 0, x: "-0%" },
  };

  const toggleButtonVariants = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -20 },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const FunTypingIndicator = ({
    message = "I'm working on your request...",
  }: {
    message?: string;
  }) => (
    <div className="flex items-center space-x-3 p-2">
      {/* Bot avatar/icon */}
      <div className="flex-shrink-0">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-primary/90 p-2 rounded-full shadow-md border-2 border-white"
        >
          <Bot size={18} className="text-white" />
        </motion.div>
      </div>
      {/* Chat bubble with animated dots and message stacked vertically */}
      <div className="relative">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl px-5 py-3 shadow-sm flex flex-col items-center min-w-[120px] max-w-xs">
          {/* Animated dots */}
          <div className="flex space-x-1 mb-2">
            <motion.span
              className="block w-2.5 h-2.5 rounded-full bg-primary/70"
              animate={{ y: [0, -6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: "easeInOut",
                delay: 0,
              }}
            />
            <motion.span
              className="block w-2.5 h-2.5 rounded-full bg-primary/60"
              animate={{ y: [0, -6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />
            <motion.span
              className="block w-2.5 h-2.5 rounded-full bg-primary/50"
              animate={{ y: [0, -6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: "easeInOut",
                delay: 0.4,
              }}
            />
          </div>
          {/* Typing message */}
          <div className="text-xs text-primary font-medium text-center whitespace-pre-line">
            {message}
          </div>
          {/* Optional shimmer effect */}
          <motion.div
            className="absolute left-0 top-0 w-full h-full rounded-2xl pointer-events-none"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            style={{
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );

  // Only render UI if chat is initialized and modal is closed
  if (!chatBotData?.chatInitialized || isOnboardingModalOpen) {
    return null;
  }

  return (
    <div className="flex h-screen relative">
      <AnimatePresence>
        {isActionModalOpen && !isJDModalOpen && (
          <ActionConfirmationModal
            closeModal={() => setIsActionModalOpen(false)}
            heading={modalContent.heading}
            description={modalContent.description}
            buttonText={modalContent.buttonText}
            onConfirm={modalContent.onConfirm}
            isProcessing={isBotLoading}
          />
        )}
        {isJDModalOpen && (
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
                <h2 className="text-xl font-bold text-white">
                  Match with Job Description
                </h2>
                <button
                  onClick={() => setIsJDModalOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                  disabled={isJDLoading}
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-gray-600 whitespace-pre-line mb-2">
                    Paste the job description below. The AI will analyze your
                    resume and suggest tailored improvements to maximize your
                    match.
                  </p>
                  <textarea
                    className="w-full min-h-[120px] border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    disabled={isJDLoading}
                  />
                  {jdError && (
                    <div className="text-red-500 text-xs mt-2">{jdError}</div>
                  )}
                </div>
                <div className="flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsJDModalOpen(false)}
                    disabled={isJDLoading}
                    className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleJDSubmit}
                    disabled={isJDLoading}
                    className={`px-4 py-2 rounded-md text-white font-medium flex items-center gap-2 ${
                      isJDLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary hover:bg-primary/90 cursor-pointer"
                    }`}
                  >
                    {isJDLoading && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    Analyze and Match
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        {/* Restore Checkpoint Confirmation Dialog */}
        <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Restore Checkpoint</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <div className="space-y-3">
                <p>
                  <b>Are you sure you want to restore to this checkpoint?</b>
                </p>
                <ul className="list-disc pl-6 text-sm text-gray-700">
                  <li>This will revert your resume to the state it was in when you sent this message.</li>
                  <li>All chat messages after this point will be <b>permanently deleted</b>.</li>
                  <li>This action cannot be undone.</li>
                </ul>
                <p className="text-red-600 font-medium">Warning: Any unsaved changes after this checkpoint will be lost.</p>
              </div>
            </DialogDescription>
            <DialogFooter>
              <button
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium"
                onClick={() => setRestoreDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 font-medium"
                onClick={() => {
                  if (pendingRestoreId) {
                    restoreCheckpoint(pendingRestoreId, params.id as string);
                  }
                  setRestoreDialogOpen(false);
                  setPendingRestoreId(null);
                }}
              >
                Yes, Restore
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {!isExpanded && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={toggleButtonVariants}
            className="absolute top-4 left-4 z-10 bg-white p-3 rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
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
        className="border-r border-gray-200 overflow-hidden shadow-lg"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <motion.div
            className="bg-primary w-full text-white p-4 flex items-center justify-between gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ rotate: -30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="bg-white/20 p-2 rounded-full"
              >
                <Bot size={18} />
              </motion.div>
              <h2 className="text-base font-semibold">AI Resume Assistant</h2>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
                <DialogTrigger asChild>
                  <button
                    className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                    onClick={() => setIsHelpOpen(true)}
                  >
                    <HelpCircle size={18} className="text-white" />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      How to use the AI Resume Assistant
                    </DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    <div className="space-y-4 text-gray-700">
                      <p>
                        <b>Welcome to your magical AI Resume Assistant!</b>
                      </p>
                      <p>
                        This chatbot can help you craft, improve, and tailor
                        your resume for your dream job. It works in two powerful
                        modes:
                      </p>
                      <ul className="list-disc pl-6">
                        <li>
                          <b>Ask Mode:</b> Ask questions about your resume, get
                          feedback, suggestions, and personalized advice.
                          Example queries:
                          <ul className="list-disc pl-6">
                            <li>
                              "How can I improve my summary for a Product
                              Manager role?"
                            </li>
                            <li>
                              "What skills am I missing for a Data Scientist
                              position?"
                            </li>
                            <li>
                              "Rewrite my experience section to better match a
                              Software Engineer job."
                            </li>
                          </ul>
                        </li>
                        <li className="mt-2">
                          <b>Agent Mode:</b> Let the assistant take actions for
                          you! It can edit, add, or remove sections, rewrite
                          content, and more. Example commands:
                          <ul className="list-disc pl-6">
                            <li>"Add a new project about machine learning."</li>
                            <li>
                              "Update my skills to include React and
                              TypeScript."
                            </li>
                            <li>
                              "Tailor my resume for the attached job
                              description."
                            </li>
                          </ul>
                        </li>
                      </ul>
                      <p>
                        <b>Tips for best results:</b>
                      </p>
                      <ul className="list-disc pl-6">
                        <li>
                          Be specific about your target role and experience
                          level.
                        </li>
                        <li>
                          Switch to Agent Mode for direct changes, or User Mode
                          for advice and feedback.
                        </li>
                        <li>
                          Review suggestions and approve changes before applying
                          them.
                        </li>
                      </ul>
                      <p>
                        Ready to make your resume stand out? Start chatting!
                      </p>
                    </div>
                  </DialogDescription>
                </DialogContent>
              </Dialog>
              <motion.div
                className="cursor-pointer bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleSidebar}
              >
                <ArrowLeftToLine size={16} />
              </motion.div>
            </div>
          </motion.div>

          {/* Message Container */}
          <div className="flex-1 w-full bg-white p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
            <AnimatePresence>
              {storeMessages.map((msg, idx) => {
                const { messageType } = msg;
                return (
                  <motion.div
                    key={idx}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className={`mb-4 max-w-[95%] text-wrap relative ${
                      msg.sender === "user" ? "ml-auto" : "mr-auto"
                    }`}
                  >
                    <div
                      className={`px-4 pt-4 pb-2 rounded-xl text-sm relative group transition-shadow duration-200 ${
                        msg.sender === "user"
                          ? "bg-primary text-white shadow-md"
                          : msg.messageType === "success"
                            ? "bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200 shadow-sm"
                            : msg.messageType === "info" ||
                                msg.messageType === "option"
                              ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200 shadow-sm"
                              : msg.isProcessing
                                ? "bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200 shadow-sm"
                                : "bg-gray-50 text-gray-800 border border-gray-100 shadow-sm"
                      }`}
                    >
                      {msg.isTyping ? (
                        <div className="flex items-center space-x-3">
                          <FunTypingIndicator message={msg.content.message} />
                        </div>
                      ) : (
                        <>
                          <motion.div
                            initial={{ opacity: msg.sender === "bot" ? 0 : 1 }}
                            animate={{ opacity: 1 }}
                            transition={{
                              duration: msg.sender === "bot" ? 0.3 : 0,
                            }}
                            className="flex items-start gap-2"
                          >
                            {msg.isProcessing && (
                              <CheckCircle
                                size={16}
                                className="text-green-600 mt-0.5 flex-shrink-0"
                              />
                            )}
                            {msg.sender === "bot" &&
                            messageType === "info" &&
                            /<\w+.*?>/.test(msg.content.message) ? (
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: msg.content.message,
                                }}
                              />
                            ) : (
                              <span>{msg.content.message}</span>
                            )}
                          </motion.div>
                          {msg.content.type === "options" && (
                            <motion.div className="mt-4 text-wrap  max-w-[95%] flex flex-wrap gap-2">
                              {msg.content.options.map((option) => (
                                <Button
                                  size={"sm"}
                                  variant={"outline"}
                                  onClick={option.onClick}
                                  className="mb-1 hover:bg-primary w-full hover:text-white text-xs font-medium text-primary border border-primary p-2 rounded-lg transition-colors duration-200"
                                  key={option.value}
                                >
                                  {option.label}
                                </Button>
                              ))}
                            </motion.div>
                          )}
                          {/* Restore checkpoint icon for user messages */}
                          {msg.sender === "user" && (
                            <div className="w-full block ml-auto">
                              <button
                                className="bg-amber-900/80 mt-2 cursor-pointer text-white px-2 py-1 rounded-full shadow block ml-auto gap-1 text-xs font-medium"
                                title="Restore to this checkpoint"
                                onClick={() => {
                                  setPendingRestoreId(msg.id);
                                  setRestoreDialogOpen(true);
                                }}
                                type="button"
                                style={{ zIndex: 2 }}
                              >
                                <div className="flex items-center gap-1">
                                <History size={14} className="text-white" />
                                Restore checkpoint
                                </div>
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 ml-1 flex items-center gap-1">
                      {msg.sender === "bot" ? (
                        <>
                          <Bot size={12} className="text-primary" />
                          <span>AI Assistant</span>
                        </>
                      ) : (
                        <>
                          <User size={12} className="text-primary" />
                          <span>You</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <motion.div
            className="p-4 border-t border-gray-200 bg-white shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex gap-2">
              <motion.div className="flex-1 relative">
                {/* Tag pill above input, fixed in input area */}
                <div style={{ width: "100%" }}>
                  {taggedTag && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        marginBottom: 6,
                        background: "#fffbe6",
                        color: "#222",
                        border: "1.5px solid #ffe066",
                        borderRadius: "16px",
                        fontWeight: 500,
                        fontSize: "10px",
                        padding: "3px 5px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                        gap: "10px",
                        maxWidth: 340,
                        minWidth: 60,
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#ffe066",
                          color: "#b48a00",
                          borderRadius: "8px",
                          fontWeight: 700,
                          width: 28,
                          height: 28,
                          marginRight: 8,
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                          <rect x="2" y="2" width="16" height="12" rx="4" fill="#ffe066" />
                          <text x="6" y="12" fontSize="10" fill="#b48a00" fontWeight="bold">@</text>
                        </svg>
                      </span>
                      <span
                        style={{
                          maxWidth: 160,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {taggedTag.text.length > 28
                          ? taggedTag.text.substring(0, 28) + "…"
                          : taggedTag.text}
                      </span>
                      <span
                        style={{
                          marginLeft: "12px",
                          fontSize: "18px",
                          color: "#b48a00",
                          cursor: "pointer",
                          fontWeight: 700,
                          lineHeight: 1,
                        }}
                        onClick={clearTaggedTag}
                        title="Remove tag"
                      >
                        ×
                      </span>
                    </div>
                  )}
                  <motion.textarea
                    ref={inputRef}
                    value={message}
                    rows={3}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="w-full px-4 py-3 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm transition-all duration-200"
                    whileFocus={{
                      boxShadow: "0 0 0 2px rgba(var(--color-primary), 0.2)",
                    }}
                    disabled={isBotLoading}
                  />
                </div>
                <MessageSquare
                  size={16}
                  className="absolute left-3 top-3.5 text-gray-400"
                />
              </motion.div>
              <motion.button
                onClick={handleSend}
                disabled={message.trim() === "" || isBotLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200"
                whileHover={{
                  scale: message.trim() && !isBotLoading ? 1.03 : 1,
                }}
                whileTap={{ scale: message.trim() && !isBotLoading ? 0.97 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Send size={16} />
              </motion.button>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOneClickATS}
                disabled={isBotLoading}
                className="text-xs"
              >
                One Click ATS
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMatchJD}
                disabled={isBotLoading}
                className="text-xs"
              >
                Match Job Description
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chatbot;
