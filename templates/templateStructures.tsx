import { ResumeTemplate } from "@/types/templateTypes";
import Template1 from "./template1/Template1";
import Template2 from "./template2/Template2";

export const allSectionFields: any = {
  header: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    summary: "",
    location: "",
    photo: undefined,
  },
  experience: {
    experience: [
      {
        companyName: "",
        role: "",
        jobDescription: "",
        location: "",
        startMonth: "",
        endMonth: "",
        startYear: "",
        endYear: "",
        workingHere: false,
      },
    ],
  },
  education: {
    education: [
      {
        courseName: "",
        instituteName: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        location: "",
        grade: "",
        studyingHere: false,
      },
    ],
  },
  skills: {
    description: "",
  },
  projects: {
    projects: [
      {
        name: "",
        description: "",
        githuburl: "",
        liveurl: "",
      },
    ],
  },
  custom : {
    allSections : [{
      sectionTitle : "",
      sectionDescription : "",
      isVisible: false,
    }]
  }
};

export function createSection(type: any, fields: string[]) {
  let content: any = {};
  fields.forEach((field) => {
    content[field] = allSectionFields[type][field];
  });

  return {
    type,
    content,
    style: {},
  };
}

export const templateStructures: any = {
  Template1: [
    {
      type: "header",
      fields: [
        "firstName",
        "lastName",
        "email",
        "phone",
        "github",
        "linkedin",
        "summary",
      ],
    },
    { type: "experience", fields: ["experience"] },
    { type: "skills", fields: ["description"] },
    { type: "projects", fields: ["projects"] },
    { type: "education", fields: ["education"] },
    { type: "custom", fields: ["allSections"] },
  ],
  Template2: [
    {
      type: "header",
      fields: ["firstName", "lastName", "email", "phone", "github", "linkedin"],
    },
    { type: "education", fields: ["education"] },
    { type: "experience", fields: ["experience"] },
    { type: "projects", fields: ["projects"] },
    { type: "skills", fields: ["description"] },
    { type: "custom", fields: ["allSections"] },
  ],
};

export type TemplateComponentType = React.ComponentType<{
  obj: ResumeTemplate;
  isPreview: boolean;
}>;

export const templateComponents: Record<string, TemplateComponentType> = {
  Template1: Template1,
  Template2: Template2,
};
