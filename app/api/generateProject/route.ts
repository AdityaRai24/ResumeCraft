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
                "Title for the project description (e.g., 'Technical Implementation', 'Key Features', 'Project Impact')"
              ),
            bullets: z
              .array(z.string())
              .length(3)
              .describe(
                "Array of 3 bullet points for this project category"
              ),
          })
        )
        .length(3)
        .describe(
          "Array of 3 professional project descriptions with titles and bullet points"
        ),
    });

    const { projectName, roughProject, experienceLevel } =
      await req.json();

    if (!projectName) {
      return NextResponse.json(
        { error: "Project name is required" },
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
      You are an expert resume writer. Your task is to generate 3 professional project descriptions for a user based on their project name and rough description.
      
      Each project description should:
      - Have a descriptive title (like "Technical Implementation", "Key Features", "Project Impact", etc.)
      - Contain exactly 3 bullet points
      - Each bullet point should be professional and highlight the technical aspects and achievements
      - Be written in the first person using action verbs
      - Focus on technical skills, challenges overcome, and quantifiable results where possible
      - Use different focuses/angles for variety (technical implementation, features, impact, etc.)
      
      Project Name: {projectName}
      Experience Level: {experienceLevel}
      Rough Description: {roughProject}
      
      Return 3 different project description categories, each with a title and exactly 3 bullet points.
    `);

    // Format the prompt with user inputs
    const prompt = await promptTemplate.format({
      projectName: projectName,
      experienceLevel: experienceLevel || "Mid-level", // Default to mid-level if not provided
      roughProject: roughProject || "", // Use empty string if not provided
    });

    // When using withStructuredOutput, the response is already parsed
    const response = await modelWithStructure.invoke(prompt);
    console.log("Structured response:", response);

    // Transform the response for the frontend
    const generatedProjects = response.experiences.map((experience) => {
      // Join the bullets into a single HTML content string
      const content = `<ul>${experience.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}</ul>`;

      return {
        title: experience.title,
        content: content,
        // Include the raw bullets as well for potential future use
        bullets: experience.bullets,
      };
    });

    // Return the parsed project descriptions with content formatted as HTML
    return NextResponse.json({ generatedProjects });
  } catch (error) {
    console.log(error);
    console.error("Error generating project descriptions:", error);

    // More detailed error handling
    let errorMessage = "Failed to generate project descriptions";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}