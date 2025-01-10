import { ResumeTemplate } from "@/types/templateTypes";

const temp4EmptyObj: ResumeTemplate = {
  isTemplate: true,
  userId: "admin",
  templateName: "Template4",
  sections: [
    {
      content: {
        email: "",
        firstName: "",
        lastName: "",
        location: "",
        phone: "",
        photo: "",
        role: "",
        socialLinks: [],
        summary: "",
      },
      isVisible: true,
      orderNumber: 0,
      style: {},
      type: "header",
    },
    {
      content: {
        description: "",
      },
      isVisible: true,
      orderNumber: 1,
      style: {
        sectionDirection: "left",
      },
      type: "skills",
    },
    {
      content: {
        experience: [],
      },
      isVisible: true,
      orderNumber: 2,
      style: {
        sectionDirection: "right",
      },
      type: "experience",
    },
    {
      content: {
        education: [],
      },
      isVisible: true,
      orderNumber: 3,
      style: {
        sectionDirection: "left",
      },
      type: "education",
    },
    {
      content: {
        projects: [
          {
            description: "",
            githuburl: "",
            liveurl: "",
            name: "",
          },
        ],
      },
      isVisible: true,
      orderNumber: 4,
      style: {
        sectionDirection: "right",
      },
      type: "projects",
    },
    {
      type: "custom",
      content: {
        sectionTitle: "Languages",
        sectionDescription:
          "<ul><li>English (Fluent)</li><li>French (Fluent)</li><li>German (Basic)</li><li>Spanish (Intermediate)</li></ul>",
        sectionDirection: "left",
        sectionNumber: 0,
      },
      isVisible: true,
      orderNumber: 5,
      style: {},
    },
  ],
  globalStyles: {
    fontFamily: "Geologica",
    primaryTextColor: "#606060",
    primaryColor: "#606060",
    photo: true,
    columns: 2,
  },
};

export default temp4EmptyObj;
