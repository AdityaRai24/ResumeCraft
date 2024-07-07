type SectionType =
  | "header"
  | "education"
  | "skills"
  | "projects"
  | "experience";

interface BaseSection {
  type: SectionType;
  content: Record<string, any>;
  style?: Record<string, any>;
}

interface HeaderSection extends BaseSection {
  type: "header";
  content: {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    location?: string;
    github?: string;
    linkedin?: string;
    summary?: string;
    photo?: string;
  };
  style?: {};
}

interface ListSkillSection {
  type: "list";
  content: {
    skills: string[];
  };
}

interface DescriptionSkillSection {
  type: "description";
  content: {
    skills: string;
  };
}

interface SkillSection extends BaseSection {
  type: "skills";
  content: DescriptionSkillSection | ListSkillSection;
  style?: {
    columns?: number;
  };
}

interface ProjectSection extends BaseSection {
  type: "projects";
  content: {
    projects: {
      name: string;
      description: string;
      githuburl?: string;
      liveurl?: string;
    }[];
  };
  style?: {};
}

interface ExperienceSection extends BaseSection {
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
    }[];
  };
  style?: {};
}

interface EducationSection extends BaseSection {
  type: "education";
  content: {
    education: {
      courseName: string;
      instituteName: string;
      startMonth?: string;
      startYear: string;
      endMonth?: string;
      endYear: string;
      location?: string;
    }[];
  };
  style?: {};
}

export type SectionTypes =
  | HeaderSection
  | SkillSection
  | ProjectSection
  | ExperienceSection
  | EducationSection;

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
