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

export interface HeaderSection extends BaseSection {
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

export interface SkillSection extends BaseSection {
  type: "skills";
  content: {
    description : string,
  };
  style: {
  };
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
      workingHere : false
    }[];
  };
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
      studyingHere : boolean;
      grade? : string;
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
