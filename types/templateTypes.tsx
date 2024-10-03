type SectionType =
  | "header"
  | "education"
  | "skills"
  | "projects"
  | "experience"
  | "custom";

interface BaseSection {
  type: SectionType;
  content: Record<string, any>;
  style?: Record<string, any>;
}

export interface SocialLink {
  type: string;
  name: string;
  url: string;
}

export interface HeaderSection extends BaseSection {
  type: "header";
  content: {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    location?: string;
    summary?: string;
    photo?: string;
    socialLinks : SocialLink[]
  };
  isVisible: boolean;
  orderNumber: number;
  style?: {};
}

export interface SkillSection extends BaseSection {
  type: "skills";
  content: {
    description: string;
  };
  isVisible: boolean;
  orderNumber: number;
  style?: {};
}

export interface ProjectSection extends BaseSection {
  type: "projects";
  content: {
    projects: {
      name: string;
      description: string;
      githuburl?: string;
      liveurl?: string;
    }[];
  };
  isVisible: boolean;
  orderNumber: number;
  style?: {};
}

export interface ExperienceSection extends BaseSection {
  type: "experience";
  content: {
    experience: {
      companyName: string;
      role: string;
      jobDescription: string;
      location?: string;
      startMonth?: string;
      startYear: string;
      endMonth?: string;
      endYear: string;
      workingHere: false;
    }[];
  };
  isVisible: boolean;
  orderNumber: number;
  style?: {};
}

export interface EducationSection extends BaseSection {
  type: "education";
  content: {
    education: {
      courseName: string;
      instituteName: string;
      startMonth?: string;
      startYear?: string;
      endMonth?: string;
      endYear?: string;
      location?: string;
      studyingHere: boolean;
      grade?: string;
    }[];
  };
  isVisible: boolean;
  orderNumber: number;
  style?: {};
}

export interface CustomSection extends BaseSection {
  type: "custom";
  content: {
    sectionTitle : string;
    sectionDescription : string;
    sectionNumber : number;
  };
  isVisible: boolean;
  orderNumber: number;
  style?: {};
}

export type SectionTypes =
  | HeaderSection
  | SkillSection
  | ProjectSection
  | ExperienceSection
  | EducationSection
  | CustomSection;

export interface ResumeTemplate {
  isTemplate: boolean;
  userId: string;
  templateName: string;
  sections: SectionTypes[];
  globalStyles: {
    fontFamily: string;
    primaryTextColor: string;
    primaryColor: string;
    photo: boolean;
    columns: number;
  };
}
