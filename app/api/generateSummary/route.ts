import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const parser = z.object({
      summaries: z
        .array(
          z.object({
            title: z
              .string()
              .describe(
                "Title for the summary (e.g., 'Professional', 'Technical', 'Leadership')"
              ),
            content: z
              .string()
              .describe("2-3 line professional resume summary"),
          })
        )
        .length(4)
        .describe("Array of 4 professional resume summaries with titles"),
    });

    const { desiredRole, experienceLevel } = await req.json();

    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY!,
      modelName: "gemini-1.5-flash",
    });

    const modelWithStructure = model.withStructuredOutput(parser);

    // Create a prompt template with format instructions embedded
    const promptTemplate = PromptTemplate.fromTemplate(`
      You are an expert resume writer. Your task is to generate 4 professional summary options for a user based on their role and experience level.
      
      Each summary should:
      - Have a descriptive title (like "Professional", "Technical", "Leadership", "Achievement-Focused", etc.)
      - Be 2-3 lines in length
      - Be professional and tailored for the given role
      - Be written in a way that highlights strengths and impact
      - Use different focuses/angles for variety (technical skills, leadership, achievements, etc.)
      
      Role: {role}
      Experience Level: {experience}
    `);

    // Format the prompt with user inputs and parser instructions
    const prompt = await promptTemplate.format({
      role: desiredRole,
      experience: experienceLevel,
    });

    // When using withStructuredOutput, the response is already parsed
    const response = await modelWithStructure.invoke(prompt);
    console.log("Structured response:", response);

    // Return the parsed summaries directly
    return NextResponse.json({ summaryOptions: response.summaries });
  } catch (error) {
    console.error("Error generating resume summaries:", error);

    // More detailed error handling
    let errorMessage = "Failed to generate summary";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
