import { ResumeTemplate } from "@/types/templateTypes";

export interface TemplateType {
  isPreview?: boolean;
  obj: ResumeTemplate;
  isLive?: boolean;
  modalPreview?: boolean;
}

export type HeaderContent = {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  github?: string;
};

export type EducationContent = {
  education: {
    courseName: string;
    instituteName: string;
    startMonth?: string;
    startYear: string;
    endMonth?: string;
    endYear: string;
    location?: string;
    grade?: string;
    studyingHere: boolean;
  }[];
};

export type ExperienceContent = {
  experience: {
    companyName: string;
    role: string;
    jobDescription: string;
    location?: string;
    startMonth?: string;
    startYear: string;
    endMonth?: string;
    endYear: string;
    workingHere: boolean;
  }[];
};

export type SkillsContent = {
  content: {
    skills: string[] | string;
  };
};

export type ProjectContent = {
  projects: {
    name: string;
    description: string;
    githuburl?: string;
    liveurl?: string;
  }[];
};
