import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const skillsContentSchema = v.object({
  type: v.union(v.literal("list"), v.literal("description")),
  content: v.object({
    skills: v.union(v.array(v.string()), v.string()),
  }),
});
const sectionContentSchema = v.union(
  v.object({
    type: v.literal("header"),
    content: v.object({
      firstName: v.string(),
      lastName: v.optional(v.string()),
      email: v.string(),
      phone: v.optional(v.string()),
      location: v.optional(v.string()),
      github: v.optional(v.string()),
      linkedin: v.optional(v.string()),
      summary: v.optional(v.string()),
      photo: v.optional(v.string()),
    }),
    style: v.optional(v.any()),
  }),
  v.object({
    type: v.literal("skills"),
    content: skillsContentSchema,
    style: v.optional(
      v.object({
        columns: v.optional(v.number()),
      })
    ),
  }),
  v.object({
    type: v.literal("projects"),
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
    style: v.optional(v.any()),
  }),
  v.object({
    type: v.literal("experience"),
    content: v.object({
      experience: v.array(
        v.object({
          companyName: v.string(),
          role: v.string(),
          jobDescription: v.string(),
          location: v.optional(v.string()),
          startMonth: v.optional(v.string()),
          startYear: v.string(),
          endMonth: v.optional(v.string()),
          endYear: v.string(),
        })
      ),
    }),
    style: v.optional(v.any()),
  }),
  v.object({
    type: v.literal("education"),
    content: v.object({
      education: v.array(
        v.object({
          courseName: v.string(),
          instituteName: v.string(),
          startDate: v.string(),
          location: v.optional(v.string()),
          endDate: v.string(),
        })
      ),
    }),
    style: v.optional(v.any()),
  })
);

export default defineSchema({
  resumes: defineTable({
    isTemplate: v.boolean(),
    userId: v.string(),
    templateName: v.string(),
    sections: v.array(sectionContentSchema),
    globalStyles: v.object({
      fontFamily: v.string(),
      primaryTextColor: v.string(),
      primaryColor: v.string(),
      photo: v.boolean(),
      columns: v.number(),
    }),
  }),
});
