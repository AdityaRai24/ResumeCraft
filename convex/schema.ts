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
      summary: v.optional(v.string()),
      photo: v.optional(v.string()),
      role: v.optional(v.string()),
      socialLinks: v.array(
        v.object({
          type: v.string(),
          name: v.string(),
          url: v.string(),
        })
      ),
    }),
    isVisible: v.boolean(),
    orderNumber: v.optional(v.number()),
    style: v.optional(v.any()),
  }),

  v.object({
    type: v.literal("skills"),
    content: v.object({
      description: v.string(),
    }),
    isVisible: v.boolean(),
    orderNumber: v.optional(v.number()),
    style: v.optional(v.any()),
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
    isVisible: v.boolean(),
    orderNumber: v.optional(v.number()),
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
          workingHere: v.boolean(),
        })
      ),
    }),
    isVisible: v.boolean(),
    orderNumber: v.optional(v.number()),
    style: v.optional(v.any()),
  }),

  v.object({
    type: v.literal("education"),
    content: v.object({
      education: v.array(
        v.object({
          courseName: v.string(),
          instituteName: v.string(),
          location: v.optional(v.string()),
          startMonth: v.optional(v.string()),
          startYear: v.optional(v.string()),
          endMonth: v.optional(v.string()),
          endYear: v.optional(v.string()),
          studyingHere: v.boolean(),
          grade: v.optional(v.string()),
        })
      ),
    }),
    isVisible: v.boolean(),
    orderNumber: v.optional(v.number()),
    style: v.optional(v.any()),
  }),

  v.object({
    type: v.literal("custom"),
    content: v.object({
      sectionTitle: v.optional(v.string()),
      sectionDescription: v.optional(v.string()),
      sectionNumber: v.optional(v.number()),
      sectionDirection: v.optional(v.string()),
    }),
    isVisible: v.boolean(),
    orderNumber: v.optional(v.number()),
    style: v.optional(v.any()),
  })
);

const optionSchema = v.object({
  label: v.string(),
  value: v.string(),
});

const chatMessageSchema = v.object({
  content: v.array(
    v.union(
      v.object({
        content: v.object({
        type: v.literal("text"),
        message: v.string(),
        }),
        sender: v.union(v.literal("user"), v.literal("bot")),
      }),
      v.object({
        content: v.object({
        type: v.literal("options"),
        message: v.string(),
        options: v.array(optionSchema),
        }),
        sender: v.literal("bot"),
      })
    )
  ),
  experienceLevel: v.optional(v.string()),
  desiredRole: v.optional(v.string()),
  userId: v.optional(v.string()),
  resumeId: v.optional(v.id("resumes")),
});

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
  premiumUsers: defineTable({
    userId: v.string(),
  }),
  chatMessages: defineTable(chatMessageSchema),
});
