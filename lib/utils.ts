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

export const jobDescription = `Basic understanding of JavaScript, React.js, and Next.js is required,
 with familiarity in CSS frameworks like Tailwind CSS or Bootstrap and state management 
 tools such as Redux or Zustand being a plus. Candidates should have an analytical mindset, problem-solving skills,
  and a strong interest in frontend development. Knowledge of debugging, testing, optimizing frontend code, and integrating APIs
   is essential. Exposure to server-side rendering (SSR), static site generation (SSG), and client-side rendering (CSR) is beneficial.
    Collaboration with designers, backend developers,
 and participation in code reviews, technical discussions, and brainstorming sessions is expected.`;


 
