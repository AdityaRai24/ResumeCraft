import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      console.error("Missing GOOGLE_API_KEY environment variable");
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 }
      );
    }

    const { resume, desiredRole, experienceLevel, jobDescription } = await req.json();

    if (!resume) {
      return NextResponse.json(
        { error: "Cannot find resume." },
        { status: 400 }
      );
    }

    if (!desiredRole) {
      return NextResponse.json(
        { error: "Desired role is required for tailoring." },
        { status: 400 }
      );
    }

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description is required for tailoring." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Prepare prompt for Gemini
    const prompt = `You are an expert resume writer and ATS optimization specialist. Your task is to tailor the provided resume sections to best match the following job description for the target role.

TARGET ROLE: ${desiredRole}
EXPERIENCE LEVEL: ${experienceLevel}
JOB DESCRIPTION: ${jobDescription}

---
RESUME SECTIONS (JSON):
${JSON.stringify(resume)}
---

INSTRUCTIONS:
- Carefully read the job description and identify key skills, requirements, and keywords.
- For each section (summary, experience, projects, skills), rewrite or enhance the content to maximize alignment with the job description.
- Add missing relevant keywords and skills where appropriate, but do not fabricate experience.
- Use clear, concise, and professional language.
- Preserve the original JSON structure. Only update the 'content' fields and their nested structures.
- Do NOT change metadata like 'type', 'isVisible', 'style', 'orderNumber'.
- Maintain all HTML tags (e.g., <ul><li></li></ul>) in descriptions.
- Return ONLY the updated JSON array of resume sections.
`;

    let updatedResume;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      // Try to extract JSON from the response
      const jsonStart = text.indexOf("[");
      const jsonEnd = text.lastIndexOf("]");
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("Could not find JSON array in model response");
      }
      const jsonString = text.substring(jsonStart, jsonEnd + 1);
      updatedResume = JSON.parse(jsonString);
    } catch (err) {
      console.error("Gemini error or JSON parse error:", err);
      return NextResponse.json(
        { error: "Failed to generate tailored resume. Please try again." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        updatedResume,
        success: true,
        message: "Resume tailored to job description successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in action-jd route:", error);
    return NextResponse.json(
      {
        error: "An unexpected server error occurred. Please try again.",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
} 