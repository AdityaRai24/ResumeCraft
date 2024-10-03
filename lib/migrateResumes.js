import { query } from "@/convex/_generated/server";

const migrateResumes = query({
  args: {},
  handler: async (ctx, args) => {
    const resumes = await ctx.db
      .query("resumes")
      .filter((q) => q.eq(q.field("isTemplate"), true))
      .collect();

    console.log(resumes);
  },
});

export { migrateResumes };
