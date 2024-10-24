import { ResumeTemplate } from "@/types/templateTypes";
import Template1 from "@/templates/template1/Template1";
import Template2 from "@/templates/template2/Template2";

export const allSectionFields: any = {
  header: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    socialLinks: [],
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
};

export function createSection(
  type: any,
  fields: string[],
  orderNumber: number,
  isVisible: boolean
) {
  let content: any = {};
  fields.forEach((field) => {
    content[field] = allSectionFields[type][field];
  });

  return {
    type,
    content,
    orderNumber: orderNumber,
    isVisible: isVisible,
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
        "socialLinks",
        "summary",
      ],
      orderNumber: 0,
      isVisible: true,
    },
    {
      type: "experience",
      fields: ["experience"],
      orderNumber: 3,
      isVisible: true,
    },
    {
      type: "skills",
      fields: ["description"],
      orderNumber: 1,
      isVisible: true,
    },
    { type: "projects", fields: ["projects"], orderNumber: 2, isVisible: true },
    {
      type: "education",
      fields: ["education"],
      orderNumber: 4,
      isVisible: true,
    },
  ],
  Template2: [
    {
      type: "header",
      fields: ["firstName", "lastName", "email", "phone", "socialLinks"],
      orderNumber: 0,
      isVisible: true,
    },
    {
      type: "education",
      fields: ["education"],
      orderNumber: 1,
      isVisible: true,
    },
    {
      type: "experience",
      fields: ["experience"],
      orderNumber: 2,
      isVisible: true,
    },
    { type: "projects", fields: ["projects"], orderNumber: 3, isVisible: true },
    {
      type: "skills",
      fields: ["description"],
      orderNumber: 4,
      isVisible: true,
    },
  ],
};

export type TemplateComponentType = React.ComponentType<{
  obj: ResumeTemplate;
  isPreview: boolean;
  size? : "sm" | "md" | "lg";
}>;

export const templateComponents: Record<string, TemplateComponentType> = {
  Template1: Template1,
  Template2: Template2,
};
