import { ResumeTemplate, SectionTypes } from "@/types/templateTypes";

export const temp1Obj: ResumeTemplate = {
  isTemplate: true,
  userId: "admin",
  sections: [
    {
      type: "header",
      content: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1-555-123-4567",
        github: "johndoe",
        linkedin: "john-doe",
        summary:
          "Experienced software developer with a strong background in full-stack development and a passion for creating innovative solutions.",
        location: "New York, NY",
      },
      style: {},
    },

    {
      type: "skills",
      content: {
        type: "list",
        content:{
          skills: [
            "HTML , CSS",
            "Tailwind CSS, Shadcn UI",
            "Javascript, Typescript",
            "React JS, Next JS",
            "Redux Toolkit, Context API",
            "Node JS, MongoDB",
            "Prisma, Drizzle ORM",
            "AWS",
            "Framer Motions, GSAP",
            "Docker",
            "Git , Github",
          ],
        }
      },
      style: {
        columns: 3,
      },
    },

    {
      type: "projects",
      content: {
        projects: [
          {
            name: "Personal Portfolio",
            description:
              "Developed a personal portfolio website to showcase projects and skills.",
            githuburl: "https://github.com/johndoe/portfolio",
            liveurl: "https://johndoe.com",
          },
          {
            name: "E-commerce Platform",
            description:
              "Created a full-stack e-commerce platform with user authentication, product management, and payment processing.",
            githuburl: "https://github.com/johndoe/ecommerce",
            liveurl: "https://ecommerce.johndoe.com",
          },
        ],
      },
      style: {},
    },

    {
      type: "experience",
      content: {
        experience: [
          {
            companyName: "Tech Solutions Inc.",
            role: "Senior Software Engineer",
            jobDescription:
              "Led a team of developers in designing and implementing scalable web applications.",
            location: "San Francisco, CA",
            startDate: "2019-05-01",
            endDate: "Present",
          },
          {
            companyName: "Web Innovations LLC",
            role: "Full Stack Developer",
            jobDescription:
              "Developed and maintained web applications using modern JavaScript frameworks and RESTful APIs.",
            location: "Austin, TX",
            startDate: "2016-08-01",
            endDate: "2019-04-30",
          },
        ],
      },
      style: {},
    },
    {
      type: "education",
      content: {
        education: [
          {
            courseName: "Bachelor of Science in Computer Science",
            instituteName: "University of California, Berkeley",
            startDate: "2012-09-01",
            endDate: "2016-05-31",
            location: "Berkeley, CA",
          },
          {
            courseName: "Master of Science in Software Engineering",
            instituteName: "Stanford University",
            startDate: "2017-09-01",
            endDate: "2019-06-15",
            location: "Stanford, CA",
          },
        ],
      },
      style: {},
    },
  ],
  templateName: "Template1",
  globalStyles: {
    columns: 2,
    fontFamily: "Inter",
    photo: false,
    primaryColor: "#C026D3",
    primaryTextColor: "#C026D3",
  }
};

