import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { SectionTypes } from "@/types/templateTypes";

// export const insertResumeData = mutation({
//     args: {},
//     handler: async(ctx,args)=>{
//         const resume  = await ctx.db.insert("resumes",temp1Obj)
//         return resume
//     }
// })

export const getTemplates = query({
  args: {},
  handler: async (ctx, args) => {
    const resumes = await ctx.db
      .query("resumes")
      .filter((q) => q.eq(q.field("isTemplate"), true))
      .collect();

    return resumes;
  },
});

export const getTemplateDetails = query({
  args: {
    id: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);
    return resume;
  },
});

export const updateHeader = mutation({
  args: {
    id: v.id("resumes"),
    content: v.object({
      firstName: v.string(),
      lastName: v.string(),
      email: v.string(),
      phone: v.string(),
      github: v.string(),
      linkedin: v.string(),
      location: v.string(),
      summary: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Something went wrong");
    }
    const resumeSections = resume?.sections;
    let index = resumeSections.findIndex((obj) => obj.type === "header");

    if (index === -1) {
      throw new Error("Somethign went wrong index");
    } else {
      resumeSections[index].content = {
        ...resumeSections[index].content,
        ...args.content,
      };
    }

    const newResume = await ctx.db.patch(args.id, {
      sections: resumeSections,
    });

    return resumeSections;
  },
});

export const createUserResume = mutation({
  args: {
    id: v.id("resumes"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);

    if (!args.userId) {
      throw new Error("Something went wrong...no userId");
    }

    if (!resume) {
      throw new Error("Something went wrong");
    }

    const initialSections: SectionTypes[] = [
        {
          type: "header",
          content: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            github: "",
            linkedin: "",
            summary: "",
            location: "",
            photo: undefined,
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
                jobDescription: "",
                location: "",
                startDate: "",
                endDate: "",
              },
            ],
          },
        },
        {
          type: "education",
          content: {
            education: [
              {
                courseName: "",
                instituteName: "",
                startDate: "",
                endDate: "",
              },
            ],
          },
        },
        {
          type: "skills",
          content: {
            skills: [],
          },
          style: {
            columns: undefined,
          },
        },
        {
          type: "projects",
          content: {
            projects: [
              {
                name: "",
                description: "",
                githuburl: "",
                liveurl: "",
              },
            ],
          },
        },
      ];
    const newResume = await ctx.db.insert("resumes", {
      isTemplate: false,
      userId: args.userId,
      globalStyles: resume?.globalStyles!,
      sections: initialSections,
    });

    return newResume;
  },
});

export const updateExperience = mutation({
  args: {
    id: v.id("resumes"),
    content: v.object({
      experience: v.array(
        v.object({
          companyName: v.string(),
          role: v.string(),
          jobDescription: v.string(),
          location: v.optional(v.string()),
          startDate: v.string(),
          endDate: v.string(),
        })
      ),
    }),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Something went wrong");
    }
    const resumeSections = resume?.sections;
    let index = resumeSections.findIndex((item) => item.type === "experience");
    if (index === -1) {
      throw new Error("Something went wrong index");
    } else {
      resumeSections[index].content = {
        ...resumeSections[index]?.content,
        ...args.content,
      };
    }

    const newResume = await ctx.db.patch(args.id, {
      sections: resumeSections,
    });
    return newResume;
  },
});
