type SectionType =
  | "header"
  | "education"
  | "skills"
  | "projects"
  | "experience";

interface BaseSection {
  id: string;
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
}

interface SkillSection extends BaseSection {
  type: "skills";
  content: {
    skills: string[];
  };
  style: {
    columns?: number;
  };
}

interface ProjectSection extends BaseSection {
  type: "projects";
  content: {
    projects: {
      name: string;
      description: string;
      githuburl: string;
      liveurl: string;
    }[];
  };
}

interface ExperienceSection extends BaseSection {
  type: "experience";
  content: {
    experience: {
      companyName: string;
      role: string;
      jobDescription: string;
      location? : string;
      startDate: string;
      endDate: string;
    }[];
  };
}

interface EducationSection extends BaseSection {
  type: "education";
  content: {
    education: {
      courseName: string;
      instituteName: string;
      startDate: string;
      endDate: string;
    }[];
  };
}

export type SectionTypes =
  | HeaderSection
  | SkillSection
  | ProjectSection
  | ExperienceSection
  | EducationSection;

export interface ResumeTemplate {
  id: string;
  isTemplate: boolean;
  userId: string;
  sections: SectionTypes[];
  globalStyles: {
    fontFamily: string;
    primaryTextColor: string;
    primaryColor: string;
    photo: boolean;
    columns : number;
  };
}
