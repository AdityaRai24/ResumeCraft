import { ResumeTemplate } from "@/types/templateTypes";

const temp3obj: ResumeTemplate = {
  isTemplate: true,
  userId: "admin",
  templateName: "Template3",
  sections: [
    {
      content: {
        email: "richard.sanchez.marketing@gmail.com",
        firstName: "RICHARD",
        lastName: "SANCHEZ",
        location: "Los Angeles, CA",
        phone: "+1-555-987-6543",
        photo: "",
        role: "Marketing Specialist",
        socialLinks: [
          {
            name: "RichardSanchez",
            type: "linkedin",
            url: "https://linkedin.com/in/janedoe",
          },
        ],
        summary:
          "Experienced marketing specialist with 5+ years of expertise in creating and implementing successful marketing strategies that drive customer engagement and revenue growth. Proficient in digital marketing, brand management, and market analysis, with a proven track record of optimizing campaign performance to achieve business goals.",
      },
      isVisible: true,
      orderNumber: 0,
      style: {},
      type: "header",
    },
    {
      content: {
        description:
          "<ul><li>Brand Strategy</li><li>Content Marketing</li><li>SEO & SEM</li><li>Market Research</li><li>Social Media Marketing</li><li>Campaign Analytics</li><li>Public Relations</li></ul>",
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
            companyName: "Creative Edge Marketing",
            endMonth: "Dec",
            endYear: "2024",
            jobDescription:
              "<ul><li>Developed and executed multi-channel marketing campaigns, increasing brand awareness by 30% within six months.</li><li>Optimized digital ad campaigns, achieving a 25% increase in click-through rates and a 15% decrease in cost-per-click.</li><li>Led a team of 4 to create content strategies that boosted social media engagement by 40%.</li></ul>",
            location: "New York, NY",
            role: "Marketing Manager",
            startMonth: "Jan",
            startYear: "2023",
            workingHere: false,
          },
          {
            companyName: "Bright Future Inc.",
            endMonth: "Dec",
            endYear: "2022",
            jobDescription:
              "<ul><li>Conducted market research to identify trends, enhancing campaign relevance and driving a 20% sales increase.</li><li>Managed influencer collaborations, resulting in a 50% rise in social media reach and follower growth.</li><li>Designed and launched email marketing campaigns that achieved a 35% open rate and 20% conversion rate.</li></ul>",
            location: "Chicago, IL",
            role: "Marketing Specialist",
            startMonth: "Feb",
            startYear: "2020",
            workingHere: false,
          },
        ],
      },
      isVisible: true,
      orderNumber: 3,
      style: { sectionDirection: "right" },
      type: "experience",
    },
    {
      content: {
        education: [
          {
            courseName: "Bachelor of Business Administration in Marketing",
            endMonth: "May",
            endYear: "2019",
            grade: "3.8 GPA",
            instituteName: "University of Southern California",
            location: "Los Angeles, CA",
            startMonth: "Aug",
            startYear: "2015",
            studyingHere: false,
          },
          {
            courseName: "Master of Business Administration (MBA)",
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
      orderNumber: 4,
      style: { sectionDirection: "right" },
      type: "education",
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
    {
      content: {
        sectionDescription:
          "<p><strong>Alex Carter</strong></p><p>Bright Future Inc. / Marketing Director</p><p><strong>Phone: </strong>+1-123-555-7890</p><p><strong>Email : </strong>alex.carter@brightfuture.com</p>",
        sectionDirection: "left",
        sectionNumber: 0,
        sectionTitle: "Reference",
      },
      isVisible: true,
      orderNumber: 6,
      style: {},
      type: "custom",
    },
  ],
  globalStyles: {
    columns: 2,
    fontFamily: "Geologica",
    photo: true,
    primaryColor: "#153b66",
    primaryTextColor: "#153b66",
  },
};

export default temp3obj;
