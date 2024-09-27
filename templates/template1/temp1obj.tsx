import { v } from "convex/values";

const convertedResumeObject = {
  isTemplate: true,
  userId: "admin",
  templateName: "Template1",
  sections: [
    {
      type: "header",
      content: {
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        github: "johndoe",
        linkedin: "john-doe",
        location: "New York, NY",
        phone: "+1-555-123-4567",
        photo: "",
        summary:
          "Experienced software developer with a strong background in full-stack development and a passion for creating innovative solutions.",
      },
      isVisible: true,
      orderNumber : 0,
      style: {},
    },
    {
      type: "skills",
      content: {
        description:
          "JavaScript, React, Node.js, MongoDB, Express.js, RESTful APIs, Git",
      },
      isVisible: true,
      orderNumber : 1,
      style: {},
    },
    {
      type: "projects",
      content: {
        projects: [
          {
            name: "E-commerce Website Using MERN Stack",
            description:
              "<p>Developed a full-featured eCommerce platform with user authentication, product management, and secure payment processing using MongoDB, Express.js, React, and Node.js, resulting in a 40% increase in user engagement.</p><p>Integrated advanced search and filtering capabilities, enhancing the user experience by reducing product search time by 50%, and implemented a real-time order tracking system.</p>",
            githuburl: "https://github.com/johndoe/ecommerce",
            liveurl: "https://johndoe.com",
          },
          {
            name: "Currency Converter in React",
            description:
              "<p>Built a dynamic currency converter application in React, leveraging third-party APIs to provide real-time exchange rates for over 150 currencies, resulting in a 25% increase in user satisfaction.</p><p>Implemented a responsive and intuitive user interface, ensuring seamless performance across various devices and improving usability scores by 30%.</p>",
            githuburl: "https://github.com/johndoe/ecommerce",
            liveurl: "https://ecommerce.johndoe.com",
          },
        ],
      },
      isVisible: true,
      orderNumber : 2,
      style: {},
    },
    {
      type: "experience",
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
            workingHere: false,
            startMonth: "Feb",
            endMonth: "Dec",
          },
          {
            companyName: "Web Innovations LLC",
            jobDescription:
              "<p>Spearheaded the development of 6 end-to-end web applications from concept to deployment, leveraging React and Node.js, resulting in a 30% reduction in time-to-market.</p><p>Implemented robust authentication systems and RESTful APIs for 10+ web projects, ensuring data security and seamless integration with external services.</p><p>Collaborated with cross-functional teams on 15+ sprints, delivering scalable solutions that improved performance metrics by 25% across multiple client projects.</p>",
            location: "Austin, TX",
            role: "Full Stack Developer",
            startYear: "2024",
            endYear: "2024",
            workingHere: false,
            startMonth: "Feb",
            endMonth: "Dec",
          },
        ],
      },
      isVisible: true,
      orderNumber : 3,
      style: {},
    },
    {
      type: "education",
      content: {
        education: [
          {
            courseName: "Bachelor of Science in Computer Science",
            instituteName: "University of California, Berkeley",
            location: "Berkeley, CA",
            startMonth: "Feb",
            startYear: "2022",
            endMonth: "March",
            endYear: "2023",
            studyingHere: false,
            grade: "8.2 CGPA",
          },
          {
            courseName: "Master of Science in Software Engineering",
            instituteName: "Stanford University",
            location: "Stanford, CA",
            startMonth: "Feb",
            startYear: "2022",
            endMonth: "March",
            endYear: "2023",
            studyingHere: false,
            grade: "8.2 CGPA",
          },
        ],
      },
      isVisible: true,
      orderNumber : 4,
      style: {},
    },
    {
      type: "custom",
      content: {
        sectionTitle: "About Me",
        sectionDescription: "Summary",
        sectionNumber : 0
      },
      isVisible: false,
      orderNumber : 5,
      style: {},
    },
  ],
  globalStyles: {
    fontFamily: "Geologica",
    primaryTextColor: "#C026D3",
    primaryColor: "#C026D3",
    photo: false,
    columns: 2,
  },
};

export default convertedResumeObject;