import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TextMessage = {
  type: "text";
  message: string;
};

export type OptionMessage = {
  type: "options";
  message: string;
  options: {
    label: string;
    value: string;
    onClick?: () => void; // Optional: for dynamic behavior
  }[];
};

type ChatMessage = {
  id: string; // Make id required
  sender: "user" | "bot";
  content: TextMessage | OptionMessage;
  messageType?: "success" | "info" | "option" | "error";
  isTyping?: boolean;
  isProcessing?: boolean;
};

type PushTextOptions = {
  messageType?: "success" | "info" | "option" | "error";
  isProcessing?: boolean;
  id?: string;
};

type ChatBotState = {
  messages: ChatMessage[];
  resumes: { [id: string]: any };
  desiredRole?: string;
  experienceLevel?: string;
  pushText: (
    message: string,
    sender: "user" | "bot",
    options?: PushTextOptions
  ) => void;
  pushOptions: (
    message: string,
    options: OptionMessage["options"],
    sender?: "bot",
    messageType?: "success" | "info" | "option" | "error",
    id?: string
  ) => void;
  resetMessages: () => void;
  fillMessages: (messages: ChatMessage[]) => void;
  setResume: (id: string, resume: any) => void;
  getResume: (id: string) => any;
  setDesiredRole: (role: string) => void;
  setExperienceLevel: (level: string) => void;
  pushTyping: (message?: string, sender?: "bot") => void;
  removeTyping: () => void;
  removeMessageById: (id: string) => void;
  taggedText: string | null;
  setTaggedText: (text: string) => void;
  clearTaggedText: () => void;
  taggedTag: { text: string; section: string; description: string; index?: number } | null;
  setTaggedTag: (tagObj: { text: string; section: string; description: string; index?: number }) => void;
  clearTaggedTag: () => void;
  resumeCheckpoints: { [messageId: string]: any };
  saveCheckpoint: (messageId: string, resume: any) => void;
  restoreCheckpoint: (messageId: string, resumeId: string) => void;
};

export const useChatBotStore = create<ChatBotState>()(
  persist(
    (set, get) => ({
      messages: [],
      resumes: {},
      desiredRole: undefined,
      experienceLevel: undefined,
      pushText: (message, sender, options = {}) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              sender,
              content: { type: "text", message },
              id: options.id || `msg-${Date.now()}-${Math.random()}`,
              ...options,
            },
          ],
        })),
      pushOptions: (message, options, sender = "bot", messageType, id) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { sender, content: { type: "options", message, options }, messageType: messageType, id: id || `msg-${Date.now()}-${Math.random()}` },
          ],
        })),
      resetMessages: () => set({ messages: [] }),
      fillMessages: (messages) => set({
        messages: messages.map((msg) => ({
          ...msg,
          id: msg.id || `msg-${Date.now()}-${Math.random()}`,
        })),
      }),
      setResume: (id, resume) =>
        set((state) => ({
          resumes: { ...state.resumes, [id]: resume },
        })),
      getResume: (id) => get().resumes[id],
      setDesiredRole: (role) => set({ desiredRole: role }),
      setExperienceLevel: (level) => set({ experienceLevel: level }),
      pushTyping: (message = "I'm working on your request...", sender = "bot") =>
        set((state) => ({
          messages: [
            ...state.messages.filter((msg: any) => !msg.isTyping),
            {
              sender,
              content: { type: "text", message },
              isTyping: true,
              id: `typing-${Date.now()}-${Math.random()}`,
            },
          ],
        })),
      removeTyping: () =>
        set((state) => ({
          messages: state.messages.filter((msg: any) => !msg.isTyping),
        })),
      removeMessageById: (id: string) =>
        set((state) => ({
          messages: state.messages.filter((msg: any) => msg.id !== id),
        })),
      taggedText: null,
      setTaggedText: (text) => set({ taggedText: text }),
      clearTaggedText: () => set({ taggedText: null }),
      taggedTag: null, // { text, section, description }
      setTaggedTag: (tagObj) => set({ taggedTag: tagObj }),
      clearTaggedTag: () => set({ taggedTag: null }),
      resumeCheckpoints: {},
      saveCheckpoint: (messageId, resume) => {
        set((state) => ({
          resumeCheckpoints: {
            ...state.resumeCheckpoints,
            [messageId]: JSON.parse(JSON.stringify(resume)), // deep copy
          },
        }));
      },
      restoreCheckpoint: (messageId, resumeId) => {
        const { resumeCheckpoints, setResume, messages, fillMessages } = get();
        const checkpointResume = resumeCheckpoints[messageId];
        if (checkpointResume) {
          setResume(resumeId, checkpointResume);
          // Truncate chat history after the checkpoint
          const idx = messages.findIndex((msg) => msg.id === messageId);
          if (idx !== -1) {
            fillMessages(messages.slice(0, idx + 1));
          }
        }
      },
    }),
    {
      name: "chatbot-storage",
      partialize: (state) => ({
        messages: state.messages,
        resumes: state.resumes,
        desiredRole: state.desiredRole,
        experienceLevel: state.experienceLevel,
        resumeCheckpoints: state.resumeCheckpoints,
      }),
    }
  )
);
