import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const resumeData = `"{"personal_details": {"name": "ADITYA RAI", "phone": "8369703972", "email": "adityarai407@gmail.com", "linkedin": "AdityaRai24", "profilePic": false}, "numberOfColumns": 1, "education": [{"institution": "Dwarkadas J. Sanghvi College Of Engineering", "degree": "Btech In Information Technology", "location": "Mumbai, India", "date": "Nov 2022 - Present"}, {"institution": "TP Bhatia College Of Science", "degree": "HSC", "location": "Mumbai, India", "date": "Jun 2020 - Apr 2022"}], "projects": [{"title": "Al-Powered Resume Builder with ATS Optimization", "description": ["Developed an Al-powered resume builder using Next.js, TypeScript, Tailwind CSS and Convex DB optimizing resumes for Applicant Tracking Systems (ATS) and helping users to create professional resumes with a 30-35% increase in ATS scores.", "Utilized Convex DB as a database, providing real time updation and preview of resumes for a seamless user experience, enhancing engagement and reducing load times by 25%.", "Integrated features like Magic Write which uses google gemini's api to create professional job and project descriptions improving resume quality by 20% and reducing writing time by 30%.", "Implemented highly dynamic and completely customizable templates. Supports color and font customization, custom section creation, so that user can craft resume's according to their personal needs.", "Additional features and technologies: Shadcn UI,Clerk for authentication, zustand for state management, framer motion for animations and lodash for debouncing to enhance website performance.", "Used by more than 200 people with 350+ resumes created."]}, {"title": "Real Time Collaborative Editor built in Next JS", "description": ["Developed a real-time collaborative text editor similar to Notion, using Next.js, Blocknote, Liveblocks, and Convex DB, enabling users to create documents and increasing user engagement by 25%.", "Implemented a publish feature allowing users to share their documents with others via a unique URL, leading to a 30% boost in document accessibility.", "Supports Collaborative (Workspace) environments. Users can create a workspace and invite people via email to collaborate on documents together enhancing user collaboration.", "Leveraged a comprehensive tech stack including Shaden UI, block note functionality, Framer Motion for animations, Zustand for state management, and Tailwind CSS for styling, resulting in a highly performant and user-friendly interface with a 15% improvement in user satisfaction."]}], "positions_of_responsibility": [{"title": "Member of the Technical Co - Committee of DJCSI", "description": ["Contributed to the Codeshastra hackathon website, a key component of the event, utilizing Next.js and Tailwind CSS to deliver a responsive and user-friendly experience across all devices.", "Leveraged Git and GitHub for efficient version control and collaboration within a team of 4 developers, ensuring smooth code management and project delivery."]}], "skills": {"Frontend": ["Javascript", "TypeScript", "React.js", "Next.js", "Redux", "Redux Toolkit", "Tailwind CSS", "Shadcn UI", "Three JS", "Framer Motion", "Zustand"], "Backend": ["Node.js", "Express.js", "REST APIs", "Authentication (JWT, OAuth, Next Auth, Clerk)", "MongoDB", "Mongoose", "Convex DB", "Supabase", "WebSockets (Socket.io)"], "ORMS": ["Prisma", "Drizzle"]}}"`;
export const skillContent = `"frontend":[
"Javascript",
"TypeScript",
"React.js",
"Next.js",
"Redux",
"Redux Toolkit",
"Tailwind CSS",
"Shadcn UI",
"Three JS",
"Framer Motion",
"Zustand"
],
"backend":[
"Node.js",
"Express.js",
"REST APIs",
"Authentication (JWT, OAuth, Next Auth, Clerk)",
"MongoDB",
"Mongoose",
"Convex DB",
"Supabase",
"WebSockets (Socket.io)"
],
"ORMS":[
"Prisma",
"Drizzle"
]
`;
export const educationContent = `
education": [{"institution": "Dwarkadas J. Sanghvi College Of Engineering", "degree": "Btech In Information Technology", "location": "Mumbai, India", "date": "Nov 2022 - Present"}, {"institution": "TP Bhatia College Of Science", "degree": "HSC", "location": "Mumbai, India", "date": "Jun 2020 - Apr 2022"}]
`;

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
 and participation in code reviews, technical discussions, and brainstorming sessions is expected.
 
 `;
