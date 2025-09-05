import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

export async function POST(req: Request) {
  try {
    const { desiredRole, experienceLevel } = await req.json();

    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY!,
      modelName: "gemini-2.5-flash-lite",
    });

    const promptTemplate = PromptTemplate.fromTemplate(`
You are a professional resume writer with expertise in crafting concise, impactful summaries optimized for Applicant Tracking Systems (ATS).

Write exactly ONE professional resume summary (2–3 lines) for an entry-level candidate.

Context:
• Desired Role: {role}
• Experience Level: {experience}

🎯 Guidelines:
- Focus on technical and role-relevant skills, clarity, and readiness
- Mention relevant tools, languages, or methods (only if implied by the role)
- Keep the tone professional and confident, without exaggeration
- Do NOT use vague buzzwords like: "highly motivated", "dynamic", "go-getter", "team player", "passionate"
- Avoid fluff and generalities — make every word count
- No placeholders like [technology] or [company]
- Do NOT return multiple options — write only ONE best summary

Keep it concise, impactful, and recruiter-friendly.
`);

    const prompt = await promptTemplate.format({
      role: desiredRole,
      experience: experienceLevel,
    });

    const response = await model.invoke(prompt);
    const generatedSummary = response.content;

    return NextResponse.json({ summary: generatedSummary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
