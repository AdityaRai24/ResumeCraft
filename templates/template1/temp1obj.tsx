import { ResumeTemplate } from "@/types/templateTypes";

export const temp1Obj  : ResumeTemplate = {
    isTemplate: true,
    userId: "admin",
    sections : [

        {   
            type : "header",
            content: {
                firstName: "Aditya",
                lastName: "Srivastava",
                email: "QJY2l@example.com",
                phone: "1234567890",
                github: "adityasrivastava",
                linkedin: "aditya-srivastava",
                summary: "I am a summary",
                location: "mumbai",
            }
        },

        {
            type : "skills",
            content: {
                skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
            },
            style: {
                columns: 3,
            }
        },

        {
            type : "projects",
            content: {
                projects: [
                    {
                        name: "Project 1",
                        description: "Project 1 description",
                        githuburl: "https://project1.com",
                        liveurl: "https://project1.com",
                    },
                    {
                        name: "Project 2",
                        description: "Project 2 description",
                        githuburl: "https://project1.com",
                        liveurl: "https://project2.com",
                    },
                ],
            },
        },

        {
            type : "experience",
            content: {
                experience: [
                    {
                        companyName: "Company 1",
                        role: "Role 1",
                        jobDescription: "Job description 1",
                        location: "Mumbai",
                        startDate: "2020-01-01",
                        endDate: "2021-01-01",
                    },
                    {
                        companyName: "Company 2",
                        role: "Role 2",
                        jobDescription: "Job description 2",
                        location: "Pune",
                        startDate: "2021-01-01",
                        endDate: "2022-01-01",
                    },
                ],
            },
        },
        {
            type : "education",
            content: {
                education: [
                    {
                        courseName: "Course 1",
                        instituteName: "Institute 1",
                        startDate: "2020-01-01",
                        endDate: "2021-01-01",
                    },
                    {
                        courseName: "Course 2",
                        instituteName: "Institute 2",
                        startDate: "2021-01-01",
                        endDate: "2022-01-01",
                    },
                ],
            },
        }
    ],
    globalStyles: {
        fontFamily: "Inter",
        primaryTextColor: "text-cyan-700",
        primaryColor: "fuchsia-600",
        columns : 1,
        photo: false,
    }
}