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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OptionMessage, TextMessage, useChatBotStore } from "@/store";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import axios from "axios";

type LocalChatMessage = {
  id: string;
  sender: "user" | "bot";
  content: TextMessage | OptionMessage;
  isTyping?: boolean;
  isProcessing?: boolean;
};

interface ChatbotProps {
  isOnboardingModalOpen?: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOnboardingModalOpen = false }) => {
  const [message, setMessage] = useState("");
  const {
    messages: storeMessages,
    pushText,
    pushOptions,
    resetMessages,
    fillMessages,
    resume: resumeFromStore,
    desiredRole: desiredRoleFromStore,
    experienceLevel: experienceLevelFromStore,
    setResume,
  } = useChatBotStore((state) => state);
  const [displayMessages, setDisplayMessages] = useState<LocalChatMessage[]>(
    []
  );
  const [isExpanded, setIsExpanded] = useState(true);
  const [lastProcessedMessageCount, setLastProcessedMessageCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [mode, setMode] = useState<"ask" | "agent">("ask");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isBotLoading, setIsBotLoading] = useState(false);

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
  const convex = useConvex();

  useEffect(() => {
    if (
      chatBotData &&
      chatBotData.chatInitialized &&
      Array.isArray(chatBotData.content)
    ) {
      fillMessages(chatBotData.content);
      setIsInitialized(true);
    }
  }, [chatBotData, fillMessages]);

  const handleSend = async () => {
    if (!chatBotData?.chatInitialized) return;
    if (!user || !user.id) return;
    if (message.trim() === "") return;

    const userMessage = message;
    setMessage("");
    inputRef.current?.focus();

    // 1. Push user's message immediately
    await pushMessage({
      userId: user.id,
      resumeId: resumeId as Id<"resumes">,
      message: {
        sender: "user",
        content: { type: "text", message: userMessage },
      },
      mode,
    });

    // 2. Show bot typing indicator locally with fun animation
    const typingId = `typing-${Date.now()}-${Math.random()}`;
    setDisplayMessages((prev) => [
      ...prev.filter((msg) => !msg.isTyping && !msg.isProcessing), // Remove any existing typing indicators
      {
        id: `user-${Date.now()}`,
        sender: "user",
        content: { type: "text", message: userMessage },
      },
      {
        id: typingId,
        sender: "bot",
        content: { type: "text", message: "I'm working on your request..." },
        isTyping: true,
      },
    ]);
    setIsBotLoading(true);

    // 3. Call the API route for bot response
    try {
      const response = await axios.post(`http://localhost:3000/api/chatbot`, {
        userId: user.id,
        resumeId: resumeId as Id<"resumes">,
        message: {
          sender: "user",
          content: { type: "text", message: userMessage },
        },
        mode,
        resume: resumeFromStore,
        desiredRole: desiredRoleFromStore,
        experienceLevel: experienceLevelFromStore,
      });

      if (response.data && response.data.updatedResume) {
        setResume(response.data.updatedResume);
      }

      // 4. Show processing completion message
      setDisplayMessages((prev) =>
        prev.map((msg) =>
          msg.id === typingId
            ? {
                ...msg,
                content: {
                  type: "text",
                  message:
                    "✨ Perfect! I've updated your resume based on your request. The changes have been applied successfully!",
                },
                isTyping: false,
                isProcessing: true,
              }
            : msg
        )
      );

      // 5. After a brief delay, fetch and show the actual updated messages
      setTimeout(async () => {
        const updatedChatBotData = await convex.query(
          api.chatBot.getChatbotData,
          {
            userId: user.id,
            resumeId: resumeId as Id<"resumes">,
          }
        );

        if (updatedChatBotData && Array.isArray(updatedChatBotData.content)) {
          // Update display messages with the latest from the server
          setDisplayMessages(
            updatedChatBotData.content.map((msg: any) => ({
              ...msg,
              id: `msg-${Math.random().toString(36).substr(2, 9)}`,
            }))
          );
          fillMessages(updatedChatBotData.content);
        }
        setIsBotLoading(false);
      }, 1500); // Show success message for 1.5 seconds
    } catch (error) {
      console.log(error);
      // Handle error case
      setDisplayMessages((prev) =>
        prev.map((msg) =>
          msg.id === typingId
            ? {
                ...msg,
                content: {
                  type: "text",
                  message:
                    "I apologize, but I encountered an error while processing your request. Please try again.",
                },
                isTyping: false,
              }
            : msg
        )
      );
      setIsBotLoading(false);
    }
  };

  useEffect(() => {
    // Only update displayMessages if we're not currently processing a bot response
    if (!isBotLoading) {
      setDisplayMessages(
        storeMessages.map((msg) => ({
          ...msg,
          id: `msg-${Math.random().toString(36).substr(2, 9)}`,
        }))
      );
    }
    setLastProcessedMessageCount(storeMessages.length);
  }, [storeMessages, isBotLoading]);

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

  const FunTypingIndicator = () => (
    <div className="flex items-center space-x-3 p-2">
      <div className="flex space-x-1">
        <motion.div
          className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-primary/60"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "easeInOut",
            delay: 0,
          }}
        />
        <motion.div
          className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-primary/60"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "easeInOut",
            delay: 0.2,
          }}
        />
        <motion.div
          className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-primary/60"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "easeInOut",
            delay: 0.4,
          }}
        />
      </div>
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear",
        }}
      >
        <Sparkles size={16} className="text-primary" />
      </motion.div>
    </div>
  );

  // Only render UI if chat is initialized and modal is closed
  if (!chatBotData?.chatInitialized || isOnboardingModalOpen) {
    return null;
  }

  return (
    <div className="flex h-screen relative">
      <AnimatePresence>
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

          {/* Mode Selector Tabs */}
          <div className="w-full flex justify-center bg-white py-2 border-b border-gray-200">
            <Tabs
              value={mode}
              onValueChange={(val) => setMode(val as "ask" | "agent")}
            >
              <TabsList>
                <TabsTrigger value="ask">Ask Mode</TabsTrigger>
                <TabsTrigger value="agent">Agent Mode</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <motion.div
            className="flex items-center justify-center w-full bg-gradient-to-r from-primary/5 to-primary/10 text-sm text-gray-600 py-2 font-medium"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Sparkles size={14} className="mr-2 text-primary" />
            Your personal resume coach
          </motion.div>

          {/* Message Container */}
          <div className="flex-1 w-full bg-white p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
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
                      className={`p-4 rounded-xl text-sm ${
                        msg.sender === "user"
                          ? "bg-primary text-white shadow-md"
                          : msg.isProcessing
                            ? "bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200 shadow-sm"
                            : "bg-gray-50 text-gray-800 border border-gray-100 shadow-sm"
                      }`}
                    >
                      {msg.isTyping ? (
                        <div className="flex items-center space-x-3">
                          <FunTypingIndicator />
                          <span className="text-gray-600 text-sm">
                            {msg.content.message}
                          </span>
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
                            <span>{msg.content.message}</span>
                          </motion.div>
                          {msg.content.type === "options" && (
                            <motion.div className="mt-4 text-wrap max-w-[95%] flex flex-wrap gap-2">
                              {msg.content.options.map((option) => (
                                <Button
                                  size={"sm"}
                                  variant={"outline"}
                                  onClick={option.onClick}
                                  className="mb-1 hover:bg-primary hover:text-white text-xs font-medium text-primary border border-primary p-2 rounded-lg transition-colors duration-200"
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
            className="p-4 border-t border-gray-200 flex gap-2 bg-white shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div className="flex-1 relative">
              <motion.input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="w-full px-4 py-3 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm transition-all duration-200"
                whileFocus={{
                  boxShadow: "0 0 0 2px rgba(var(--color-primary), 0.2)",
                }}
                disabled={isBotLoading}
              />
              <MessageSquare
                size={16}
                className="absolute left-3 top-3.5 text-gray-400"
              />
            </motion.div>
            <motion.button
              onClick={handleSend}
              disabled={message.trim() === "" || isBotLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 flex items-center gap-2 shadow-sm hover:shadow-md transition-all duration-200"
              whileHover={{ scale: message.trim() && !isBotLoading ? 1.03 : 1 }}
              whileTap={{ scale: message.trim() && !isBotLoading ? 0.97 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Send size={16} />
              <span>{isBotLoading ? "Processing..." : "Send"}</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chatbot;
