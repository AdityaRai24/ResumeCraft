import { ResumeTemplate } from "@/types/templateTypes";

const temp4obj: ResumeTemplate = {
  isTemplate: true,
  userId: "admin",
  templateName: "Template4",
  sections: [
    {
      content: {
        email: "richard.sanchez.uiux@gmail.com",
        firstName: "RICHARD",
        lastName: "SANCHEZ",
        location: "Los Angeles, CA",
        phone: "+1-555-987-6543",
        photo: "",
        role: "UI/UX Developer",
        socialLinks: [
          {
            name: "RichardSanchez",
            type: "linkedin",
            url: "https://linkedin.com/in/richardsanchez",
          },
        ],
        summary:
          "Creative and detail-oriented UI/UX Developer with 5+ years of experience designing intuitive user interfaces and seamless user experiences. Skilled in wireframing, prototyping, user research, and front-end development to deliver visually appealing and user-friendly applications.",
      },
      isVisible: true,
      orderNumber: 0,
      style: {},
      type: "header",
    },
    {
      content: {
        description:
          "<ul><li>Wireframing & Prototyping</li><li>User Research</li><li>Usability Testing</li><li>Responsive Design</li><li>Figma & Adobe XD</li><li>HTML, CSS, JavaScript</li><li>Accessibility Standards</li></ul>",
      },
      isVisible: true,
      orderNumber: 1,
      style: { sectionDirection: "left" },
      type: "skills",
    },
    {
      content: {
        experience: [
          {
            companyName: "Creative Edge Design Studio",
            endMonth: "Dec",
            endYear: "2024",
            jobDescription:
              "<ul><li>Redesigned the company's e-commerce platform, improving user satisfaction by 35%.</li><li>Conducted user research and usability testing to enhance interface design, reducing bounce rates by 20%.</li><li>Collaborated with developers to implement responsive designs using modern frameworks.</li></ul>",
            location: "New York, NY",
            role: "Senior UI/UX Developer",
            startMonth: "Jan",
            startYear: "2023",
            workingHere: false,
          },
          {
            companyName: "Bright Future Technologies",
            endMonth: "Dec",
            endYear: "2022",
            jobDescription:
              "<ul><li>Designed and launched a mobile app, increasing app engagement by 50% within the first three months.</li><li>Developed prototypes for client presentations using Figma and Adobe XD.</li><li>Created accessible designs, ensuring WCAG compliance.</li></ul>",
            location: "Chicago, IL",
            role: "UI/UX Developer",
            startMonth: "Feb",
            startYear: "2020",
            workingHere: false,
          },
        ],
      },
      isVisible: true,
      orderNumber: 2,
      style: { sectionDirection: "right" },
      type: "experience",
    },
    {
      content: {
        education: [
          {
            courseName: "Bachelor of Science in Computer Science",
            endMonth: "May",
            endYear: "2019",
            grade: "3.8 GPA",
            instituteName: "University of California, Berkeley",
            location: "Berkeley, CA",
            startMonth: "Aug",
            startYear: "2015",
            studyingHere: false,
          },
          {
            courseName: "Master of Science in Human-Computer Interaction",
            endMonth: "May",
            endYear: "2021",
            grade: "3.9 GPA",
            instituteName: "Stanford University",
            location: "Stanford, CA",
            startMonth: "Sep",
            startYear: "2019",
            studyingHere: false,
          },
        ],
      },
      isVisible: true,
      orderNumber: 3,
      style: { sectionDirection: "left" },
      type: "education",
    },
    {
      content: {
        projects: [
          {
            description:
              "<ul><li>Designed and prototyped a user-friendly mobile banking app, focusing on accessibility and responsive layouts.</li><li>Integrated user feedback to improve app features and usability.</li></ul>",
            githuburl: "https://github.com/",
            liveurl: "https://google.com/",
            name: "Mobile Banking App",
          },
        ],
      },
      isVisible: true,
      orderNumber: 4,
      style: { sectionDirection: "right" },
      type: "projects",
    },
    {
      content: {
        sectionDescription:
          "<ul><li>English (Fluent)</li><li>Spanish (Intermediate)</li><li>French (Basic)</li></ul>",
        sectionDirection: "left",
        sectionNumber: 0,
        sectionTitle: "Languages",
      },
      isVisible: true,
      orderNumber: 5,
      style: {},
      type: "custom",
    },
  ],
  globalStyles: {
    columns: 2,
    fontFamily: "Geologica",
    photo: true,
    primaryColor: "#606060",
    primaryTextColor: "#606060",
  },
};

export default temp4obj;
