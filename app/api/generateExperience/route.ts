import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const parser = z.object({
      experiences: z
        .array(
          z.object({
            title: z
              .string()
              .describe(
                "Title for the experience (e.g., 'Professional', 'Technical', 'Leadership')"
              ),
            bullets: z
              .array(z.string())
              .length(3)
              .describe(
                "Array of 3 bullet points for this experience category"
              ),
          })
        )
        .length(3)
        .describe(
          "Array of 3 professional resume experiences with titles and bullet points"
        ),
    });

    const { role, company, roughExperience, experienceLevel } =
      await req.json();

    if (!role || !company) {
      return NextResponse.json(
        { error: "Role and company are required" },
        { status: 400 }
      );
    }

    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY!,
      modelName: "gemini-1.5-flash",
    });

    const modelWithStructure = model.withStructuredOutput(parser);

    const promptTemplate = PromptTemplate.fromTemplate(`
      You are an expert ATS resume writer. Your task is to generate 3 professional job descriptions that will score highly in ATS systems while remaining clear and impactful for human readers.
      
      Key requirements:
      - Each bullet must start with a strong action verb
      - Include specific metrics and quantifiable achievements (%, numbers, scales)
      - Highlight technical skills, tools, and methodologies used
      - Focus on impact and results, not just responsibilities
      - Keep each point between 1-2 lines
      - Use industry-standard terminology relevant to the role
      
      Each job description should:
      - Have a descriptive title (like "Achievement-Focused", "Technical Expertise", "Leadership & Management", etc.)
      - Contain exactly 3 bullet points
      - Be written in the first person using action verbs
      - Focus on achievements and quantifiable results
      - Use different focuses/angles for variety (technical skills, leadership, achievements, etc.)
      
      Role: {role}
      Company: {company}
      Experience Level: {experienceLevel}
      Rough Experience: {roughExperience}
      
      Enhance each point with:
      - Specific metrics and numbers (e.g., increased efficiency by 45%, managed a team of 12)
      - Technical details and tools used (mention specific software, methodologies, frameworks)
      - Clear business impact (cost savings, revenue growth, time savings)
      - Leadership and collaboration highlights
      
      Return 3 different experience categories, each with a title and exactly 3 ATS-optimized bullet points.
    `);

    // Format the prompt with user inputs
    const prompt = await promptTemplate.format({
      role: role,
      company: company,
      experienceLevel: experienceLevel || "Mid-level", 
      roughExperience: roughExperience || "", 
    });

    // When using withStructuredOutput, the response is already parsed
    const response = await modelWithStructure.invoke(prompt);
    console.log("Structured response:", response);

    const generatedExperiences = response.experiences.map((experience) => {
      const content = `<ul>${experience.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>`;

      return {
        title: experience.title,
        content: content,
        bullets: experience.bullets,
      };
    });

    return NextResponse.json({ generatedExperiences });
  } catch (error) {
    console.log(error);
    console.error("Error generating job descriptions:", error);

    let errorMessage = "Failed to generate job descriptions";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
