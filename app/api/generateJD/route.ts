import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    // Validate environment variable
    if (!process.env.GOOGLE_API_KEY) {
      console.error("Missing GOOGLE_API_KEY environment variable");
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 }
      );
    }

    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      return NextResponse.json(
        { error: "Invalid request format. Please check your data." },
        { status: 400 }
      );
    }

    const { role, companyName, jobDescription } = requestData;

    // Validate required fields
    if (!role || !companyName) {
      return NextResponse.json(
        { error: "Role and company name are required fields." },
        { status: 400 }
      );
    }

    // Initialize Google AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite-preview-06-17" });

    // Create prompt
    const prompt = `You are an expert ATS resume writer. Generate exactly 3 professional job experience bullet points for a ${role} position at ${companyName}.

Requirements:
- Start each point with a strong action verb
- Include specific metrics and quantifiable achievements
- Focus on impact and results
- Keep each point concise.
- Use industry-standard terminology
- Each point must be atleast 1.5 sentences long and maximum 2 sentences.
- Return ONLY HTML format: <ul><li>point1</li><li>point2</li><li>point3</li></ul>

${jobDescription ? `Base the points on this experience: ${jobDescription}` : "Create impressive accomplishments typical for this role."}

Return only the HTML <ul> block, nothing else. Do not use any other html markdowns like bold italic or anything.`;

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

    return NextResponse.json(
      {
        html: htmlContent,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in generateJD route:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred. Please try again." },
      { status: 500 }
    );
  }
}
