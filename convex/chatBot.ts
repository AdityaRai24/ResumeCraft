import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getChatbotData = query({
  args: {
    userId: v.string(),
    resumeId: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    const chatBotData = await ctx.db
      .query("chatMessages")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("resumeId"), args.resumeId))
      .collect();
    return chatBotData[0];
  },
});

export const updateUserProfile = mutation({
  args: {
    userId: v.string(),
    resumeId: v.id("resumes"),
    desiredRole: v.string(),
    experienceLevel: v.string(),
  },
  handler: async (ctx, args) => {
    const updateProfile = await ctx.db
      .query("chatMessages")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("resumeId"), args.resumeId))
      .collect();
    const updateProfileData = updateProfile[0];

    updateProfileData.desiredRole = args.desiredRole;
    updateProfileData.experienceLevel = args.experienceLevel;

    await ctx.db.patch(updateProfileData._id, updateProfileData);
    return true;
  },
});

const optionSchema = v.object({
  label: v.string(),
  value: v.string(),
});

export const pushMessage = mutation({
  args: {
    userId: v.string(),
    resumeId: v.id("resumes"),
    message: v.union(
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
    ),
  },
  handler: async (ctx, args) => {
    console.log(args);
    const pushMessage = await ctx.db.query("chatMessages").filter(q => q.eq(q.field("userId"),args.userId)).filter(q => q.eq(q.field("resumeId"),args.resumeId)).collect();
    const pushMessageData = pushMessage[0];
    pushMessageData.content.push(args.message);
    await ctx.db.patch(pushMessageData._id, pushMessageData);
    return true;
  },
});
