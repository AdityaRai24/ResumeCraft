import { ResumeTemplate } from "@/types/templateTypes";

const temp3obj: ResumeTemplate = {
  isTemplate: true,
  userId: "admin",
  templateName: "Template3",
  sections: [
    {
      content: {
        email: "richard.sanch@gmail.com",
        firstName: "RICHARD",
        lastName: "SANCHEZ",
        location: "New York, NY",
        phone: "+1-555-123-4567",
        photo: "",
        role: "Software Engineer",
        socialLinks: [
          {
            name: "JohnDoe",
            type: "github",
            url: "https://github.com/JohnDoe",
          },
        ],
        summary:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation. Ut enim ad minim veniam quis nostrud exercitation.",
      },
      isVisible: true,
      orderNumber: 0,
      style: {},
      type: "header",
    },
    {
      content: {
        description:
          "<li><strong>Frontend :</strong> HTML5, CSS3, JavaScript (ES6+), TypeScript, React.js, Next.js, Redux, Tailwind CSS, Bootstrap, Responsive Design, Flexbox, CSS Grid, Webpack, Babel.</li><li><strong>Backend :</strong> Node.js, Express.js, REST APIs, GraphQL, Authentication (JWT, OAuth), MongoDB, Mongoose, PostgreSQL, WebSockets (Socket.io), Real-Time Data.</li><li><strong>DevOps:</strong> Docker, Kubernetes, AWS (S3, EC2, Lambda), DigitalOcean, CI/CD Pipelines (GitHub Actions, Jenkins), Nginx, Apache, PM2.</li><li><strong>Version Control &amp; Tools: </strong>Git, GitHub, GitLab, Postman, Insomnia, Swagger, VS Code, WebStorm. Testing: Jest, Mocha, Chai, Cypress, Selenium.</li>",
      },
      isVisible: true,
      orderNumber: 1,
      style: {},
      type: "skills",
    },
    {
      content: {
        experience: [
          {
            companyName: "Tech Solutions Inc.",
            endMonth: "Dec",
            endYear: "2024",
            jobDescription:
              "<ul><li>Led a team of 5 developers in designing and implementing scalable web applications using microservices architecture.</li><li>Developed and maintained 8 web applications using modern JavaScript frameworks and RESTful APIs, ensuring high performance and user-centric design.</li><li>Contributed to 12 successful software releases, including 3 major feature enhancements, achieving a 20% improvement in application efficiency.</li></ul>",
            location: "San Francisco, CA",
            role: "Senior Software Engineer",
            startMonth: "Feb",
            startYear: "2024",
            workingHere: false,
          },
          {
            companyName: "Web Innovations LLC",
            endMonth: "Dec",
            endYear: "2024",
            jobDescription:
              "<ul><li>Implemented robust authentication systems and RESTful APIs for 10+ web projects, ensuring data security and seamless integration with external services.</li><li>Collaborated with cross-functional teams on 15+ sprints, delivering scalable solutions that improved performance metrics by 25% across multiple client projects.</li></ul>",
            location: "Austin, TX",
            role: "Full Stack Developer",
            startMonth: "Feb",
            startYear: "2024",
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
      content: {
        education: [
          {
            courseName: "Bachelor Of Science in Computer Science",
            endMonth: "March",
            endYear: "2023",
            grade: "8.2 CGPA",
            instituteName: "University of California",
            location: "Berkeley, CA",
            startMonth: "Feb",
            startYear: "2022",
            studyingHere: false,
          },
          {
            courseName: "Master of Science in Software Engineering",
            endMonth: "March",
            endYear: "2023",
            grade: "8.2 CGPA",
            instituteName: "Stanford University",
            location: "CA",
            startMonth: "Feb",
            startYear: "2022",
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
    columns: 2,
  },
};

export default temp3obj;
