import { ResumeTemplate } from "@/types/templateTypes";

const temp3EmptyObj: ResumeTemplate = {
  isTemplate: true,
  userId: "admin",
  templateName: "Template3",
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
        sectionDirection: "right",
      },
      type: "education",
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
      orderNumber: 4,
      style: {},
    },
    {
      type: "custom",
      content: {
        sectionTitle: "Reference",
        sectionDescription:
          "<p><strong>Estelle Darcy</strong></p><p>Wardiere Inc. / CTO</p><p><strong>Phone: </strong>123-456-7890</p><p><strong>Email : </strong>hello@reallygreatsite.com</p>",
        sectionDirection: "left",
        sectionNumber: 1,
      },
      isVisible: true,
      orderNumber: 5,
      style: {},
    },
  ],
  globalStyles: {
    fontFamily: "Geologica",
    primaryTextColor: "#C026D3",
    primaryColor: "#C026D3",
    photo: true,
    columns: 2,
  },
};

export default temp3EmptyObj;
