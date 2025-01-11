import { ResumeTemplate } from "@/types/templateTypes";

const temp1EmptyObj: ResumeTemplate = {
  isTemplate: true,
  userId: "admin",
  templateName: "Template1",
  sections: [
    {
      content: {
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
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
        experience: [
          {
            companyName: "",
            endMonth: "",
            endYear: "",
            jobDescription: "",
            location: "",
            role: "",
            startMonth: "",
            startYear: "",
            workingHere: false,
          },
        ],
      },
      isVisible: true,
      orderNumber: 3,
      style: {},
      type: "experience",
    },
    {
      content: { description: "" },
      isVisible: true,
      orderNumber: 1,
      style: {},
      type: "skills",
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
      orderNumber: 2,
      style: {},
      type: "projects",
    },
    {
      content: {
        education: [
          {
            courseName: "",
            endMonth: "",
            endYear: "",
            grade: "",
            instituteName: "",
            location: "",
            startMonth: "",
            startYear: "",
            studyingHere: false,
          },
        ],
      },
      isVisible: true,
      orderNumber: 4,
      style: {},
      type: "education",
    },
  ],
  globalStyles: {
    fontFamily: "Geologica",
    primaryTextColor: "#C026D3",
    primaryColor: "#C026D3",
    photo: false,
    columns: 1,
  },
};

export default temp1EmptyObj;
