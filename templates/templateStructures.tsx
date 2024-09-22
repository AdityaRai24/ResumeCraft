import { ResumeTemplate } from "@/types/templateTypes";
import Template1 from "./template1/template1";
import Template2 from "./template2/template2";

export const allSectionFields : any = {
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
        startYear:"",
        endYear:"",
        workingHere: false,
      },
    ],
  },
  education: {
    education: [
      {
        courseName: "",
        instituteName: "",
        startMonth : "",
        startYear: "",
        endMonth :"",
        endYear : "",
        location: "",
        grade: "",
        studyingHere: false,
      },
    ],
  },
  skills: {
    type: "list",
    content: {
      skills: [],
    },
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
};

export function createSection(type : any, fields: string[]) {
  let content: any = {};
  fields.forEach((field) => {
    content[field] = allSectionFields[type][field];
  });

  if (type === "skills") {
    content = {
      type: "list",
      content: {
        skills: [],
      },
    };
  }

  return {
    type,
    content,
    style: {},
  };
}

export const templateStructures : any = {
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
    { type: "skills", fields: ["type", "content"] },
    { type: "projects", fields: ["projects"] },
    { type: "education", fields: ["education"] },
  ],
  Template2: [
    {
      type: "header",
      fields: ["firstName", "lastName", "email", "phone", "github", "linkedin"],
    },
    { type: "education", fields: ["education"] },
    { type: "experience", fields: ["experience"] },
    { type: "projects", fields: ["projects"] },
    { type: "skills", fields: ["type", "content"] },
  ],
};

export type TemplateComponentType = React.ComponentType<{
  obj: ResumeTemplate;
  isPreview: boolean;
}>;


export const templateComponents : Record<string, TemplateComponentType> = {
  Template1: Template1,
  Template2: Template2,
};