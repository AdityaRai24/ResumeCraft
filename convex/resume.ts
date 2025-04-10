import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { templateEmptyComponents } from "@/templates/templateStructures";
import { ResumeTemplate, SocialLink } from "@/types/templateTypes";

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
      socialLinks: v.optional(
        v.array(
          v.object({
            name: v.string(),
            url: v.string(),
            type: v.string(),
          })
        )
      ),
      role: v.optional(v.string()),
      photo: v.optional(v.string()),
      location: v.optional(v.string()),
      summary: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Something went wrong");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (identity.subject !== resume.userId) {
      throw new Error("Unauthorized");
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
    const newResume = await ctx.db.insert("resumes", {
      isTemplate: false,
      userId: args.userId,
      globalStyles: resume?.globalStyles!,
      templateName: args?.templateName,
      sections: templateEmptyComponents[args.templateName].sections,
    });

    await ctx.db.insert("chatMessages", {
      userId: args.userId,
      resumeId: newResume,
      content: [],
      experienceLevel: "",
      desiredRole: "",
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
          startYear: v.string(),
          endMonth: v.optional(v.string()),
          endYear: v.string(),
          workingHere: v.boolean(),
        })
      ),
    }),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Something went wrong");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (identity.subject !== resume.userId) {
      throw new Error("Unauthorized");
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
          startMonth: v.optional(v.string()),
          startYear: v.optional(v.string()),
          endMonth: v.optional(v.string()),
          endYear: v.optional(v.string()),
          location: v.string(),
          grade: v.optional(v.string()),
          studyingHere: v.boolean(),
        })
      ),
    }),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Something went wrong");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (identity.subject !== resume.userId) {
      throw new Error("Unauthorized");
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
    await ctx.db.patch(args.id, {
      sections: resumeSections,
    });
  },
});

export const updateCustomSection = mutation({
  args: {
    id: v.id("resumes"),
    content: v.object({
      sectionTitle: v.string(),
      sectionDescription: v.string(),
      sectionNumber: v.number(),
      sectionDirection: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Something went wrong");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (identity.subject !== resume.userId) {
      throw new Error("Unauthorized");
    }
    const resumeSections = resume?.sections;
    const customSection = resumeSections.filter(
      (item) => item.type === "custom"
    );

    const currentCustomSectionIndex = customSection.findIndex(
      (item) => item.content.sectionNumber === args.content.sectionNumber
    );

    const allOrderNumbers: any =
      resumeSections?.map((item) => item.orderNumber) || [];
    const maxNumber = Math.max(...allOrderNumbers);

    if (
      args.content.sectionTitle.trim() === "" &&
      (args.content.sectionDescription.trim() === "<p><br></p>" ||
        args.content.sectionDescription.trim() === "")
    ) {
      const updatedSections = resumeSections.filter(
        (item) =>
          !(
            item.type === "custom" &&
            item.content.sectionNumber === args.content.sectionNumber
          )
      );
      return await ctx.db.patch(args.id, {
        sections: updatedSections,
      });
    }

    if (currentCustomSectionIndex === -1) {
      resumeSections.push({
        type: "custom",
        content: {
          sectionTitle: args.content.sectionTitle,
          sectionDescription: args.content.sectionDescription,
          sectionNumber: args.content.sectionNumber,
          sectionDirection: args.content.sectionDirection,
        },
        orderNumber: maxNumber + 1,
        isVisible: true,
      });
      await ctx.db.patch(args.id, {
        sections: resumeSections,
      });
    } else {
      customSection[currentCustomSectionIndex].content = args.content;
      await ctx.db.patch(args.id, {
        sections: resumeSections,
      });
    }
  },
});

export const removeCustomSection = mutation({
  args: {
    id: v.id("resumes"),
    sectionNumber: v.number(),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Something went wrong");
    }

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (identity.subject !== resume.userId) {
      throw new Error("Unauthorized");
    }

    const resumeSections = resume?.sections;
    const customSection = resumeSections.filter(
      (item) => item.type === "custom"
    );
    const currentCustomSection = customSection.find(
      (item) => item.content.sectionNumber === args.sectionNumber
    );

    const orderNumberRemoved = currentCustomSection?.orderNumber;

    if (!orderNumberRemoved) {
      throw new Error("Something went wrong");
    }

    const updatedCustomSections = resumeSections.filter(
      (item) => item.orderNumber !== orderNumberRemoved
    );

    await ctx.db.patch(args.id, {
      sections: updatedCustomSections,
    });
  },
});

export const updateSkills = mutation({
  args: {
    id: v.id("resumes"),
    content: v.object({
      description: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Something went wrong");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (identity.subject !== resume.userId) {
      throw new Error("Unauthorized");
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

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (identity.subject !== resume.userId) {
      throw new Error("Unauthorized");
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

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (identity.subject !== resume.userId) {
      throw new Error("Unauthorized");
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

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (identity.subject !== resume.userId) {
      throw new Error("Unauthorized");
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

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (identity.subject !== resume.userId) {
      throw new Error("Unauthorized");
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

export const getCustomSections = query({
  args: {
    id: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Resume not found");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (identity.subject !== resume.userId) {
      throw new Error("Unauthorized");
    }

    const resumeSections = resume?.sections;

    const customSection = resumeSections.filter(
      (item) => item.type === "custom"
    );

    return customSection;
  },
});

const SectionType = v.union(
  v.literal("header"),
  v.literal("skills"),
  v.literal("projects"),
  v.literal("experience"),
  v.literal("education"),
  v.literal("custom")
);

export const reorderSections = mutation({
  args: {
    id: v.id("resumes"),
    updatedSections: v.any(),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Resume not found");
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (identity.subject !== resume.userId) {
      throw new Error("Unauthorized");
    }

    const updatedResume = await ctx.db.patch(args.id, {
      sections: args.updatedSections,
    });
    return updatedResume;
  },
});

export const migrateResumes = mutation({
  args: {},
  handler: async (ctx, args) => {
    const resumes = await ctx.db.query("resumes").collect();

    for (const resume of resumes) {
      const oldHeader: any = resume.sections.find(
        (section) => section.type === "header"
      );

      if (oldHeader) {
        const socialLinks: SocialLink[] = [];

        if (oldHeader.content.github) {
          socialLinks.push({
            name: "GitHub",
            type: "github",
            url: `https://github.com/${oldHeader.content.github}`,
          });
        }

        if (oldHeader.content.linkedin) {
          socialLinks.push({
            name: "LinkedIn",
            type: "linkedin",
            url: oldHeader.content.linkedin,
          });
        }

        const newHeader = {
          ...oldHeader,
          content: {
            email: oldHeader.content.email,
            firstName: oldHeader.content.firstName,
            lastName: oldHeader.content.lastName,
            phone: oldHeader.content.phone,
            socialLinks,
          },
        };

        if (oldHeader.content.summary) {
          newHeader.content.summary = oldHeader.content.summary;
        }

        resume.sections = resume.sections.map((section) =>
          section.type === "header" ? newHeader : section
        );

        await ctx.db.patch(resume._id, {
          sections: resume.sections,
        });
      }
    }

    return resumes;
  },
});

export const hideSection = mutation({
  args: {
    id: v.id("resumes"),
    sectionId: v.string(),
    secondType: v.string(),
  },
  handler: async (ctx, args) => {
    const resume = await ctx.db.get(args.id);
    if (!resume) {
      throw new Error("Resume not found");
    }
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (identity.subject !== resume.userId) {
      throw new Error("Unauthorized");
    }

    const resumeSections = resume?.sections;
    let index;

    if (args.sectionId !== args.secondType) {
      const currentCustomSectionIndex = resumeSections.findIndex(
        (item: any) => item?.content?.sectionTitle === args.secondType
      );
      if (currentCustomSectionIndex === -1) {
        throw new Error("Something went wrong index");
      } else {
        resumeSections[currentCustomSectionIndex].isVisible =
          !resumeSections[currentCustomSectionIndex].isVisible;
      }
    } else {
      index = resumeSections.findIndex((item) => item.type === args.sectionId);
      if (index === -1) {
        throw new Error("Something went wrong index");
      } else {
        resumeSections[index].isVisible = !resumeSections[index].isVisible;
      }
    }

    const updatedResume = await ctx.db.patch(args.id, {
      sections: resumeSections,
    });

    return updatedResume;
  },
});
