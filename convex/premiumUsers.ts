import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const makeUserPremium = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("premiumUsers")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    if (users.length > 0) {
      throw new ConvexError("You are already a premium member");
    }
    await ctx.db.insert("premiumUsers", { userId: args.userId });
    return { success: true };
  },
});

export const isPremiumMember = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("premiumUsers")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    return users.length > 0;
  },
});
