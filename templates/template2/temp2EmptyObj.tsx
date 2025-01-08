import { ResumeTemplate } from "@/types/templateTypes";

 const temp2EmptyObj: ResumeTemplate = {
  isTemplate: true,
  userId: "admin",
  templateName: "Template2",
  sections: [
    {
      content: {
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        socialLinks: [],
      },
      isVisible: true,
      orderNumber: 0,
      style: {},
      type: "header",
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
      orderNumber: 1,
      style: {},
      type: "education",
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
      orderNumber: 2,
      style: {},
      type: "experience",
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
      orderNumber: 3,
      style: {},
      type: "projects",
    },
    {
      content: { description: "" },
      isVisible: true,
      orderNumber: 4,
      style: {},
      type: "skills",
    },
  ],
  globalStyles: {
    columns: 1,
    fontFamily: "Geologica",
    photo: false,
    primaryColor: "#000",
    primaryTextColor: "#000",
  },
};
export default temp2EmptyObj