import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseStringToArray } from "@/lib/utils";

function isArrayOfStrings(value: any): boolean {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const { role, companyName, jobDescription } = await req.json();

    let basePrompt = `You are an expert ATS resume writer. Your task is to write or improve job experience descriptions that will score highly in ATS systems while remaining clear and impactful for human readers.

Key requirements:
- Each point must start with a strong action verb
- Include specific metrics and quantifiable achievements (%, numbers, scales)
- Highlight technical skills, tools, and methodologies used
- Focus on impact and results, not just responsibilities
- Keep each point between 1-2 lines
- Use industry-standard terminology
- Return ONLY a JSON array of strings with no other text
- No text before or after the array

Example response format:
["Led cross-functional team of 8 engineers to deliver cloud migration project 2 months ahead of schedule, reducing infrastructure costs by 35%",
"Implemented automated CI/CD pipeline using Jenkins and Docker, decreasing deployment time by 75% and eliminating manual errors",
"Mentored 5 junior developers and established best practices documentation, improving team productivity by 40% over 6 months"]`;

    let specificPrompt = "";

    if (!jobDescription) {
      // Handle case with no job description
      specificPrompt = `Generate 3 ATS-optimized bullet points ${role ? `for the role "${role}"` : ""}${
        role && companyName ? " at " : ""
      }${companyName ? `"${companyName}"` : ""} that showcase impactful achievements and responsibilities. Return only the JSON array with no other text.

Consider:
- Technical skills and industry-standard tools
- Measurable impacts and KPIs
- Project delivery and team collaboration
- Leadership and process improvements`;
    } else if (isArrayOfStrings(jobDescription)) {
      // Handle array of bullet points
      specificPrompt = `Rewrite the following ${jobDescription.length} experience points${role ? ` for "${role}"` : ""}${
        role && companyName ? " at " : ""
      }${companyName ? `"${companyName}"` : ""} to be more ATS-optimized while preserving the core achievements. Return only the JSON array with no other text.

Original points:
${jobDescription.map((point: any, index: number) => `${index + 1}. ${point}`).join("\n")}

Enhance each point with:
- More specific metrics and numbers
- Technical details and tools used
- Clear business impact
- Strong action verbs`;
    } else {
      // Handle plain text job description
      specificPrompt = `Transform this job description${role ? ` for "${role}"` : ""}${
        role && companyName ? " at " : ""
      }${companyName ? `"${companyName}"` : ""} into 3 ATS-optimized bullet points. Return only the JSON array with no other text.

Original description:
${jobDescription}

Extract and enhance the key achievements with:
- Specific metrics and numbers
- Technical skills and tools used
- Clear business impact
- Strong action verbs
- Leadership and collaboration highlights`;
    }

    const result = await model.generateContent(basePrompt + specificPrompt);
    const response = await result.response;
    let text = response
      .text()
      .trim()
      .replace(/^```json\s*/, "")
      .replace(/```$/, "").trim();

    // Ensure the response starts with [ and ends with ]
    if (!text.startsWith("[") || !text.endsWith("]")) {
      throw new Error("Invalid response format from API");
    }

    const textArray = parseStringToArray(text);

    // Validate the parsed array
    if (!textArray || textArray.length === 0) {
      throw new Error("Failed to parse response into array");
    }

    return NextResponse.json({ textArray }, { status: 200 });
  } catch (error) {
    console.error("Error in route handler:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
