import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
  }),
  v.object({
    type: v.literal("skills"),
    content: v.object({
      skills: v.array(v.string()),
    }),
    style: v.object({
      columns: v.optional(v.number()),
    }),
  }),
  v.object({
    type: v.literal("projects"),
    content: v.object({
      projects: v.array(v.object({
        name: v.string(),
        description: v.string(),
        githuburl: v.string(),
        liveurl: v.string(),
      })),
    }),
  }),
  v.object({
    type: v.literal("experience"),
    content: v.object({
      experience: v.array(v.object({
        companyName: v.string(),
        role: v.string(),
        jobDescription: v.string(),
        location: v.optional(v.string()),
        startDate: v.string(),
        endDate: v.string(),
      })),
    }),
  }),
  v.object({
    type: v.literal("education"),
    content: v.object({
      education: v.array(v.object({
        courseName: v.string(),
        instituteName: v.string(),
        startDate: v.string(),
        endDate: v.string(),
      })),
    }),
  })
);

export default defineSchema({
  resumes: defineTable({
    isTemplate: v.boolean(),
    userId: v.string(),
    sections: v.array(v.object({
        id: v.string(),
        type: v.union(v.literal("header"), v.literal("education"), v.literal("skills"), v.literal("projects"), v.literal("experience")),
        content: sectionContentSchema,
        style: v.optional(v.any()),
 })),
    globalStyles: v.object({
    fontFamily: v.string(),
    primaryTextColor: v.string(),
    primaryColor: v.string(),
    photo: v.boolean(),
    columns: v.number(),
}),
  }),
});

//     resumes: defineTable({
//       isTemplate: v.boolean(),
//       userId: v.string(),
//       content: v.object({
//         sections: v.array(sectionSchema),
//         globalStyles: v.object({
//           fontFamily: v.string(),
//           primaryTextColor: v.string(),
//           primaryColor: v.string(),
//           photo: v.boolean(),
//           columns: v.number(),
//         }),
//       }),
//     }),
//   });