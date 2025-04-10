import { create } from "zustand";

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
  sender: "user" | "bot";
  content: TextMessage | OptionMessage;
};

type ChatBotState = {
  messages: ChatMessage[];
  pushText: (message: string, sender: "user" | "bot") => void;
  pushOptions: (
    message: string,
    options: OptionMessage["options"],
    sender?: "bot"
  ) => void;
  resetMessages: () => void;
};


export const useChatBotStore = create<ChatBotState>((set) => ({
  messages: [],
  pushText: (message, sender) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { sender, content: { type: "text", message } },
      ],
    })),
  pushOptions: (message, options, sender = "bot") =>
    set((state) => ({
      messages: [
        ...state.messages,
        { sender, content: { type: "options", message, options } },
      ],
    })),
  resetMessages: () => set({ messages: [] }),
}));