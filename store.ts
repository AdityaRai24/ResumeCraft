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

type OnboardingData = {
  desiredRole: string;
  experienceLevel: string;
};

type ChatBotState = {
  messages: ChatMessage[];
  onboardingData: OnboardingData;
  resume?: any;
  desiredRole?: string;
  experienceLevel?: string;
  pushText: (message: string, sender: "user" | "bot") => void;
  pushOptions: (
    message: string,
    options: OptionMessage["options"],
    sender?: "bot"
  ) => void;
  resetMessages: () => void;
  fillMessages: (messages: ChatMessage[]) => void;
  setOnBoardingData: (data: OnboardingData) => void;
  setResume: (resume: any) => void;
  setDesiredRole: (role: string) => void;
  setExperienceLevel: (level: string) => void;
};


export const useChatBotStore = create<ChatBotState>((set) => ({
  messages: [],
  onboardingData: {
    desiredRole: "",
    experienceLevel: "",
  },
  resume: undefined,
  desiredRole: undefined,
  experienceLevel: undefined,
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
  fillMessages: (messages) => set({ messages }),
  setOnBoardingData: (data) => set({ onboardingData: data }),
  setResume: (resume) => set({ resume }),
  setDesiredRole: (role) => set({ desiredRole: role }),
  setExperienceLevel: (level) => set({ experienceLevel: level }),
}));