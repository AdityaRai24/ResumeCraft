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

    // Create a prompt template with format instructions embedded
    const promptTemplate = PromptTemplate.fromTemplate(`
      You are an expert resume writer. Your task is to generate 3 professional job descriptions for a user based on their role, company, and rough experience.
      
      Each job description should:
      - Have a descriptive title (like "Achievement-Focused", "Technical Expertise", "Leadership & Management", etc.)
      - Contain exactly 3 bullet points
      - Each bullet point should be professional and tailored for the given role at the specific company
      - Be written in the first person using action verbs
      - Focus on achievements and quantifiable results where possible
      - Use different focuses/angles for variety (technical skills, leadership, achievements, etc.)
      
      Role: {role}
      Company: {company}
      Experience Level: {experienceLevel}
      Rough Experience: {roughExperience}
      
      Return 3 different experience categories, each with a title and exactly 3 bullet points.
    `);

    // Format the prompt with user inputs
    const prompt = await promptTemplate.format({
      role: role,
      company: company,
      experienceLevel: experienceLevel || "Mid-level", // Default to mid-level if not provided
      roughExperience: roughExperience || "", // Use empty string if not provided
    });

    // When using withStructuredOutput, the response is already parsed
    const response = await modelWithStructure.invoke(prompt);
    console.log("Structured response:", response);

    // Transform the response for the frontend
    const generatedExperiences = response.experiences.map((experience) => {
      // Join the bullets into a single HTML content string
      const content = `<ul>${experience.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>`;

      return {
        title: experience.title,
        content: content,
        // Include the raw bullets as well for potential future use
        bullets: experience.bullets,
      };
    });

    // Return the parsed experiences with content formatted as HTML
    return NextResponse.json({ generatedExperiences });
  } catch (error) {
    console.log(error);
    console.error("Error generating job descriptions:", error);

    // More detailed error handling
    let errorMessage = "Failed to generate job descriptions";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}