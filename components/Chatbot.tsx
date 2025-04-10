import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  Send,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OptionMessage, TextMessage, useChatBotStore } from "@/store";
import { Button } from "./ui/button";

interface ChatMessage {
  id: string;
  content: TextMessage | OptionMessage;
  sender: "user" | "bot";
  isTyping?: boolean;
}

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const { messages: storeMessages, pushText } = useChatBotStore(
    (state) => state
  );
  const [displayMessages, setDisplayMessages] = useState<ChatMessage[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [lastProcessedMessageCount, setLastProcessedMessageCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

          // After 2s, replace with actual message and remove typing indicator
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
          }, 2000);
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

  console.log(displayMessages);

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
              <h2 className="text-base font-medium">AI Assistant</h2>
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
            Ask me anything about your resume
          </motion.p>

          {/* Message Container */}
          <div className="flex-1 w-full bg-white p-4 overflow-y-auto">
            <AnimatePresence>
              {displayMessages.map((msg) => {
                return (
                  <motion.div
                    key={msg.id}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className={`mb-4 max-w-[95%] ${
                      msg.sender === "user" ? "ml-auto" : "mr-auto"
                    }`}
                  >
                    <div
                      className={`p-4 rounded-lg text-sm shadow-md shadow-black/20 ${
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
                            <motion.div className="mt-3">
                              {msg.content.options.map((option) => (
                                <Button size={"sm"} variant={"outline"} onClick={option.onClick} className="mb-2  hover:bg-primary hover:text-white  text-xs text-black border border-primary p-2 rounded-lg" key={option.value}>{option.label}</Button>
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
              disabled={message.trim() === ""}
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
