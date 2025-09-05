import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    // Validate API key
    if (!process.env.GOOGLE_API_KEY) {
      console.error("Missing GOOGLE_API_KEY environment variable");
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 }
      );
    }

    const { projectTitle, projectDescription } = await req.json();

    // Validate required fields
    if (!projectTitle) {
      return NextResponse.json(
        { error: "Project title is required." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Prompt
    const prompt = `You are an expert ATS resume writer. Generate exactly 3 professional project description bullet points for a project titled "${projectTitle}".

Requirements:
- Start each point with a strong action verb
- Include specific metrics and quantifiable achievements
- Mention technical tools, frameworks, or methods used
- Focus on impact and results, not just responsibilities
- Each point must be at least 1.5 sentences and at most 2 sentences
- Use industry-standard terminology
- Format the response strictly as HTML: <ul><li>point1</li><li>point2</li><li>point3</li></ul>

${
  projectDescription
    ? `Base the points on this description: ${projectDescription}`
    : `Create high-quality points assuming a typical software/technical project in this domain.`
}

Return ONLY the HTML <ul> block, nothing else.`;

    // Generate AI response
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

    // Extract HTML
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

    // Validate number of bullet points
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

    return NextResponse.json(
      {
        html: htmlContent,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Unexpected error in generateProjectDescription route:",
      error
    );
    return NextResponse.json(
      { error: "An unexpected server error occurred. Please try again." },
      { status: 500 }
    );
  }
}
