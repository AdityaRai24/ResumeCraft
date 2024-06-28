import { ResumeTemplate } from "@/types/templateTypes";

export const temp2Obj: ResumeTemplate = {
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
            name: "E-commerce Website Using MERN Stack",
            description: `
              <li>Developed a full-featured eCommerce platform with user authentication, product management, and secure payment processing using MongoDB, Express.js, React, and Node.js, resulting in a 40% increase in user engagement.</li>
              <li>Integrated advanced search and filtering capabilities, enhancing the user experience by reducing product search time by 50%, and implemented a real-time order tracking system.</li>
              `,
            githuburl: "https://github.com/johndoe/ecommerce",
            liveurl: "https://johndoe.com",
          },
          {
            name: "Currency Converter in React",
            description: `
            <li>Built a dynamic currency converter application in React, leveraging third-party APIs to provide real-time exchange rates for over 150 currencies, resulting in a 25% increase in user satisfaction.</li>
            <li>Implemented a responsive and intuitive user interface, ensuring seamless performance across various devices and improving usability scores by 30%.</li>
            `,
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
            jobDescription: `<li>Led a team of 5 developers in designing and 
              implementing scalable web applications using microservices architecture.</li>
              <li>Developed and maintained 8 web applications using modern JavaScript frameworks and RESTful APIs, ensuring high performance and user-centric design.</li>
              <li>Contributed to 12 successful software releases, 
              including 3 major feature enhancements, achieving a 20% improvement in application efficiency.</li>`,
            location: "San Francisco, CA",
            startDate: "2019-05-01",
            endDate: "Present",
          },
          {
            companyName: "Web Innovations LLC",
            role: "Full Stack Developer",
            jobDescription: `<li>Spearheaded the development of 6 end-to-end web applications from concept to deployment, leveraging React and Node.js, resulting in a 30% reduction in time-to-market.</li>
              <li>Implemented robust authentication systems and RESTful APIs for 10+ web projects, ensuring data security and seamless integration with external services.</li>
              <li>Collaborated with cross-functional teams on 15+ sprints, delivering scalable solutions that improved performance metrics by 25% across multiple client projects.</li>`,
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
  globalStyles: {
    columns: 2,
    fontFamily: "Inter",
    photo: false,
    primaryColor: "#000",
    primaryTextColor: "#000",
  },
};
