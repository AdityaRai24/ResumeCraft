import { ResumeTemplate } from "@/types/templateTypes";

export const temp2Obj: ResumeTemplate = {
  isTemplate: true,
  userId: "admin",
  sections: [
    {
      content: {
        email: "john.doe@example.com",
        firstName: "John",
        github: "johndoe",
        lastName: "Doe",
        linkedin: "john-doe",
        location: "New York, NY",
        phone: "+1-555-123-4567",
      },
      style: {},
      type: "header",
    },
    {
      content: {
        education: [
          {
            courseName: "Bachelor of Science in Computer Science",
            instituteName: "University of California, Berkeley",
            location: "Berkeley, CA",
            startMonth: "Feb",
            startYear: "2022",
            endMonth: "March",
            endYear: "2023"
          },
          {
            courseName: "Master of Science in Software Engineering",
            instituteName: "Stanford University",
            location: "Stanford, CA",
            startMonth: "Jan",
            startYear: "2020",
            endMonth: "Dec",
            endYear: "2022"
          },
        ],
      },
      style: {},
      type: "education",
    },
    {
      content: {
        projects: [
          {
            description:
              "<p>Developed a full-featured eCommerce platform with user authentication, product management, and secure payment processing using MongoDB, Express.js, React, and Node.js, resulting in a 40% increase in user engagement.</p><p>Integrated advanced search and filtering capabilities, enhancing the user experience by reducing product search time by 50%, and implemented a real-time order tracking system.</p>",
            githuburl: "https://github.com/johndoe/ecommerce",
            liveurl: "https://johndoe.com",
            name: "E-commerce Website Using MERN Stack",
          },
          {
            description:
              "<p>Built a dynamic currency converter application in React, leveraging third-party APIs to provide real-time exchange rates for over 150 currencies, resulting in a 25% increase in user satisfaction.</p><p>Implemented a responsive and intuitive user interface, ensuring seamless performance across various devices and improving usability scores by 30%.</p>",
            githuburl: "https://github.com/johndoe/ecommerce",
            liveurl: "https://ecommerce.johndoe.com",
            name: "Currency Converter in React",
          },
        ],
      },
      style: {},
      type: "projects",
    },
    {
      content: {
        experience: [
          {
            companyName: "Tech Solutions Inc.",
            jobDescription:
              "<p>Led a team of 5 developers in designing and implementing scalable web applications using microservices architecture.</p><p>Developed and maintained 8 web applications using modern JavaScript frameworks and RESTful APIs, ensuring high performance and user-centric design.</p><p>Contributed to 12 successful software releases, including 3 major feature enhancements, achieving a 20% improvement in application efficiency.</p>",
            location: "San Francisco, CA",
            role: "Senior Software Engineer",
            startYear: "2024",
            endYear: "2024",
          },
          {
            companyName: "Web Innovations LLC",
            jobDescription:
              "<p>Spearheaded the development of 6 end-to-end web applications from concept to deployment, leveraging React and Node.js, resulting in a 30% reduction in time-to-market.</p><p>Implemented robust authentication systems and RESTful APIs for 10+ web projects, ensuring data security and seamless integration with external services.</p><p>Collaborated with cross-functional teams on 15+ sprints, delivering scalable solutions that improved performance metrics by 25% across multiple client projects.</p>",
            location: "Austin, TX",
            role: "Full Stack Developer",
            startYear: "2024",
            endYear: "2024",
          },
        ],
      },
      style: {},
      type: "experience",
    },
    {
      content: {
        content: {
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
        },
        type: "list",
      },
      style: { columns: 3 },
      type: "skills",
    },
  ],
  templateName: "Template2",
  globalStyles: {
    columns: 2,
    fontFamily: "Geologica",
    photo: false,
    primaryColor: "#000",
    primaryTextColor: "#000",
  },
};

export const Template2Sec = {
  sections: [
    {
      type: "header",
      content: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        github: "",
        linkedin: "",
      },
      style: {},
    },

    {
      type: "skills",
      content: {
        type: "list",
        content: {
          skills: [],
        },
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
            name: "",
            description: ``,
            githuburl: "",
            liveurl: "",
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
            companyName: "",
            role: "",
            jobDescription: ``,
            location: "",
            startDate: "",
            endDate: "",
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
            courseName: "",
            instituteName: "",
            startMonth : "",
            endMonth : "",
            startYear: "",
            endYear: "",
            location: "",
          },
        ],
      },
      style: {},
    },
  ],
};