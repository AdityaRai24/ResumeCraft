import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { projectName, roughProject, experienceLevel } = await req.json();

    if (!projectName) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite-preview-06-17" });

    // Create prompt
    const prompt = `You are an expert ATS resume writer. Generate exactly 3 professional project bullet points for the project \"${projectName}\"${experienceLevel ? ` (${experienceLevel})` : ""}.

Requirements:
- Start each point with a strong action verb
- Include specific metrics and quantifiable achievements
- Focus on impact and results
- Keep each point concise (1-2 lines)
- Use industry-standard terminology
- Return ONLY HTML format: <ul><li>point1</li><li>point2</li><li>point3</li></ul>

${roughProject ? `Base the points on this description: ${roughProject}` : "Create impressive accomplishments typical for this project."}

Return only the HTML <ul> block, nothing else.`;

    // Generate content
    let generatedText;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      generatedText = response.text().trim();
    } catch (aiError) {
      console.error("Google AI API error:", aiError);
      return NextResponse.json(
        { error: "Failed to generate content. Please try again." },
        { status: 503 }
      );
    }

    // Validate and extract HTML
    const ulStart = generatedText.indexOf("<ul>");
    const ulEnd = generatedText.lastIndexOf("</ul>");

    if (ulStart === -1 || ulEnd === -1) {
      console.error("Invalid AI response format:", generatedText);
      return NextResponse.json(
        { error: "Generated content format is invalid. Please try again." },
        { status: 502 }
      );
    }

    const htmlContent = generatedText.substring(ulStart, ulEnd + 5);

    // Validate HTML structure
    const liCount = (htmlContent.match(/<li>/g) || []).length;
    if (liCount !== 3) {
      console.error("Incorrect number of bullet points generated:", liCount);
      return NextResponse.json(
        {
          error:
            "Generated content doesn't meet requirements. Please try again.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ html: htmlContent, success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    console.error("Error generating project descriptions:", error);
    let errorMessage = "Failed to generate project descriptions";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}