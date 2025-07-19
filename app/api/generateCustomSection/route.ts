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

    const { sectionTitle, sectionDescription, sectionType } = await req.json();

    // Validate required fields
    if (!sectionTitle) {
      return NextResponse.json(
        { error: "Section title is required." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Determine content type and create appropriate prompt
    let prompt = "";
    let expectedFormat = "";

    switch (sectionType?.toLowerCase()) {
      case "courses":
        prompt = `You are an expert ATS resume writer. Generate professional course descriptions for "${sectionTitle}".

Requirements:
- Start each point with a strong action verb
- Include specific skills learned and technologies covered
- Mention any certifications or credentials earned
- Focus on practical applications and outcomes
- Each point must be 1-2 sentences
- Use industry-standard terminology
- Format as HTML: <ul><li>point1</li><li>point2</li><li>point3</li></ul>

${
  sectionDescription
    ? `Base the points on this description: ${sectionDescription}`
    : `Create high-quality points for a typical course in this domain.`
}

Return ONLY the HTML <ul> block, nothing else.`;
        expectedFormat = "bullet points";
        break;

      case "achievements":
        prompt = `You are an expert ATS resume writer. Generate professional achievement descriptions for "${sectionTitle}".

Requirements:
- Start each point with a strong action verb
- Include specific metrics and quantifiable results
- Mention the impact and significance
- Focus on accomplishments, not just activities
- Each point must be 1-2 sentences
- Use industry-standard terminology
- Format as HTML: <ul><li>point1</li><li>point2</li><li>point3</li></ul>

${
  sectionDescription
    ? `Base the points on this description: ${sectionDescription}`
    : `Create high-quality points for typical achievements in this domain.`
}

Return ONLY the HTML <ul> block, nothing else.`;
        expectedFormat = "bullet points";
        break;

      case "certifications":
        prompt = `You are an expert ATS resume writer. Generate professional certification descriptions for "${sectionTitle}".

Requirements:
- Start each point with a strong action verb
- Include specific skills and knowledge areas covered
- Mention the issuing organization and validity
- Focus on practical applications and career benefits
- Each point must be 1-2 sentences
- Use industry-standard terminology
- Format as HTML: <ul><li>point1</li><li>point2</li><li>point3</li></ul>

${
  sectionDescription
    ? `Base the points on this description: ${sectionDescription}`
    : `Create high-quality points for a typical certification in this domain.`
}

Return ONLY the HTML <ul> block, nothing else.`;
        expectedFormat = "bullet points";
        break;

      case "awards":
        prompt = `You are an expert ATS resume writer. Generate professional award descriptions for "${sectionTitle}".

Requirements:
- Start each point with a strong action verb
- Include specific criteria and selection process
- Mention the significance and recognition level
- Focus on the impact and prestige
- Each point must be 1-2 sentences
- Use industry-standard terminology
- Format as HTML: <ul><li>point1</li><li>point2</li><li>point3</li></ul>

${
  sectionDescription
    ? `Base the points on this description: ${sectionDescription}`
    : `Create high-quality points for a typical award in this domain.`
}

Return ONLY the HTML <ul> block, nothing else.`;
        expectedFormat = "bullet points";
        break;

      case "volunteer":
        prompt = `You are an expert ATS resume writer. Generate professional volunteer work descriptions for "${sectionTitle}".

Requirements:
- Start each point with a strong action verb
- Include specific responsibilities and impact
- Mention skills developed and community contribution
- Focus on leadership and initiative
- Each point must be 1-2 sentences
- Use industry-standard terminology
- Format as HTML: <ul><li>point1</li><li>point2</li><li>point3</li></ul>

${
  sectionDescription
    ? `Base the points on this description: ${sectionDescription}`
    : `Create high-quality points for typical volunteer work in this domain.`
}

Return ONLY the HTML <ul> block, nothing else.`;
        expectedFormat = "bullet points";
        break;

      default:
        // Generic custom section
        prompt = `You are an expert ATS resume writer. Generate professional content for the custom section "${sectionTitle}".

Requirements:
- Start each point with a strong action verb
- Include specific details and achievements
- Focus on impact and results
- Use industry-standard terminology
- Each point must be 1-2 sentences
- Format as HTML: <ul><li>point1</li><li>point2</li><li>point3</li></ul>

${
  sectionDescription
    ? `Base the points on this description: ${sectionDescription}`
    : `Create high-quality, professional content for this section.`
}

Return ONLY the HTML <ul> block, nothing else.`;
        expectedFormat = "bullet points";
    }

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
    if (liCount < 2 || liCount > 5) {
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
        sectionType: sectionType || "custom",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Unexpected error in generateCustomSection route:",
      error
    );
    return NextResponse.json(
      { error: "An unexpected server error occurred. Please try again." },
      { status: 500 }
    );
  }
} 