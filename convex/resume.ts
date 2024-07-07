import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  createSection,
  templateStructures,
} from "@/templates/templateStructures";

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
      lastName: v.optional(v.string()),
      email: v.string(),
      phone: v.optional(v.string()),
      github: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      location: v.optional(v.string()),
      summary: v.optional(v.string()),
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
    templateName: v.string(),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);

    if (!args.userId) {
      throw new Error("Something went wrong...no userId");
    }

    if (!resume) {
      throw new Error("Something went wrong");
    }

    const templateSections : any = templateStructures[args.templateName];
    if (!templateSections) {
      throw new Error("Invalid template name");
    }

    const initialSections = templateSections.map((section : any) =>
      createSection(section.type, section.fields)
    );


    const newResume = await ctx.db.insert("resumes", {
      isTemplate: false,
      userId: args.userId,
      globalStyles: resume?.globalStyles!,
      templateName: args?.templateName,
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
          startMonth: v.optional(v.string()),
          startYear : v.string(),
          endMonth: v.optional(v.string()),
          endYear : v.string()
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

export const updateEducation = mutation({
  args: {
    id: v.id("resumes"),
    content: v.object({
      education: v.array(
        v.object({
          courseName: v.string(),
          instituteName: v.string(),
          startMonth : v.optional(v.string()),
          startYear : v.optional(v.string()),
          endMonth: v.optional(v.string()),
          endYear : v.optional(v.string()),
          location: v.string(),
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
    let index = resumeSections.findIndex((item) => item.type === "education");
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
  },
});

export const updateSkills = mutation({
  args: {
    id: v.id("resumes"),
    content: v.object({
      type: v.literal("list"),
      content: v.object({
        skills: v.array(v.string()),
      }),
    }),
    columns: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Something went wrong");
    }
    const resumeSections = resume?.sections;
    let index = resumeSections.findIndex((item) => item.type === "skills");
    if (index === -1) {
      throw new Error("Something went wrong index");
    } else {
      resumeSections[index].content = {
        ...resumeSections[index].content,
        ...args.content,
      };
      resumeSections[index].style = {
        ...resumeSections[index].style,
        columns: args.columns,
      };
    }
    const newResume = await ctx.db.patch(args.id, {
      sections: resumeSections,
    });

    return newResume;
  },
});

export const updateProjects = mutation({
  args: {
    id: v.id("resumes"),
    content: v.object({
      projects: v.array(
        v.object({
          name: v.string(),
          description: v.string(),
          githuburl: v.optional(v.string()),
          liveurl: v.optional(v.string()),
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
    let projectsIndex = resumeSections.findIndex(
      (item) => item.type === "projects"
    );
    if (projectsIndex === -1) {
      throw new Error("Projects section not found in resume");
    } else {
      resumeSections[projectsIndex].content = {
        ...resumeSections[projectsIndex].content,
        ...args.content,
      };
    }

    const newResume = await ctx.db.patch(args.id, {
      sections: resumeSections,
    });
    return newResume;
  },
});

export const updateColor = mutation({
  args: {
    id: v.id("resumes"),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Something went wrong");
    }
    const newGlobalStyles = {
      ...resume.globalStyles,
      primaryTextColor: args.color,
    };
    const newResume = await ctx.db.patch(args.id, {
      globalStyles: newGlobalStyles,
    });
    return newResume;
  },
});

export const updateColorPC = mutation({
  args: {
    id: v.id("resumes"),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Something went wrong");
    }
    const newGlobalStyles = {
      ...resume.globalStyles,
      primaryColor: args.color,
    };
    const newResume = await ctx.db.patch(args.id, {
      globalStyles: newGlobalStyles,
    });
    return newResume;
  },
});

export const updateFont = mutation({
  args: {
    id: v.id("resumes"),
    font: v.string(),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Something went wrong");
    }

    const updatedResume = await ctx.db.patch(args.id, {
      globalStyles: {
        ...resume.globalStyles,
        fontFamily: args.font,
      },
    });

    return updatedResume;
  },
});

export const getUserResumes = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const resumes = await ctx.db
      .query("resumes")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    return resumes;
  },
});
