import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function parseStringToArray(str: string) {
  str = str.trim().slice(1, -1);
  let items = str.split(/,\s*\n/);
  items = items.map((item) => item.trim().replace(/^"|"$/g, ""));

  return items;
}

export const textSizes = {
  sm: {
    name: "text-[33px]", // 30px
    sectionHeader: "text-base", // 16px
    content: "text-sm", // 14px
    description: "text-xs", // 12px
  },
  md: {
    name: "text-4xl", // 36px
    sectionHeader: "text-lg", // 18px
    content: "text-base", // 16px
    description: "text-sm", // 14px
  },
  lg: {
    name: "text-5xl", // 48px
    sectionHeader: "text-xl", // 20px
    content: "text-lg", // 18px
    description: "text-base", // 16px
  }
} as const;

export const marginSizes = {
  sm: {
    section: "mt-1", // 4px between sections
    content: "mt-2", // 8px for content blocks
    headerContent: "mt-1", // 4px for header content
  },
  md: {
    section: "mt-2", // 8px between sections
    content: "mt-3", // 12px for content blocks
    headerContent: "mt-2", // 8px for header content
  },
  lg: {
    section: "mt-4", // 16px between sections
    content: "mt-5", // 20px for content blocks
    headerContent: "mt-3", // 12px for header content
  }
} as const;


export const jobDescription = `Basic understanding of JavaScript, React.js, and Next.js is required,
 with familiarity in CSS frameworks like Tailwind CSS or Bootstrap and state management 
 tools such as Redux or Zustand being a plus. Candidates should have an analytical mindset, problem-solving skills,
  and a strong interest in frontend development. Knowledge of debugging, testing, optimizing frontend code, and integrating APIs
   is essential. Exposure to server-side rendering (SSR), static site generation (SSG), and client-side rendering (CSR) is beneficial.
    Collaboration with designers, backend developers,
 and participation in code reviews, technical discussions, and brainstorming sessions is expected.`;


 
