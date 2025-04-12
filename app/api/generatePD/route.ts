import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function parseStringToArray(str: string) {
  // Find the actual array portion using regex
  const arrayMatch = str.match(/\[([\s\S]*)\]/);

  if (!arrayMatch) {
    throw new Error("No valid array found in response");
  }

  // Extract just the array content
  const arrayContent = arrayMatch[1];

  // Split by commas followed by newline (if any) and handle quoted strings
  let items = arrayContent.split(/,\s*(?:\r\n|\n|$)/);

  // Clean up each item
  items = items.map((item) => {
    return item
      .trim()
      .replace(/^["']|["']$/g, "") // Remove quotes at start/end
      .replace(/\\"/g, '"') // Handle escaped quotes
      .trim();
  });

  // Filter out any empty items
  return items.filter((item) => item.length > 0);
}

function isArrayOfStrings(value: any): boolean {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const { projectTitle, projectDescription } = await req.json();

    let basePrompt = `You are an expert ATS resume writer. Your task is to write or improve project descriptions that will score highly in ATS systems while remaining clear and impactful for human readers.

Key requirements:
- Each point must start with a strong action verb
- Include specific metrics and quantifiable achievements (%, numbers, scales)
- Highlight technical skills and tools used
- Focus on impact and results, not just responsibilities
- Keep each point between 1-2 lines
- Use industry-standard terminology
- Generate exactly 3 bullet points
- Format response as a JSON-parseable array
- Don't include any text before or after the array

Example format:
["Engineered a high-performance e-commerce platform using React and Node.js, resulting in 40% faster page loads and 25% increase in conversion rate",
"Implemented automated testing suite covering 95% of codebase, reducing bug reports by 60% and deployment time by 45%",
"Led a team of 5 developers to deliver 3 major features ahead of schedule, improving user engagement by 35%"]

`;

    let specificPrompt = "";

    if (projectTitle && !projectDescription) {
      specificPrompt = `Based on the project title "${projectTitle}", generate exactly 3 ATS-optimized bullet points that showcase the likely technical achievements, challenges overcome, and business impact of this project.`;
    } else if (projectTitle && isArrayOfStrings(projectDescription)) {
      specificPrompt = `Rewrite the following ${projectDescription.length} project points for "${projectTitle}" to be more ATS-optimized while preserving the core achievements. Return exactly 3 bullet points.

Original points:
${projectDescription.map((point: any, index: number) => `${index + 1}. ${point}`).join("\n")}

Enhance each point with:
- More specific metrics and numbers
- Technical details and tools used
- Clear business impact
- Strong action verbs`;
    } else if (projectTitle && projectDescription) {
      specificPrompt = `Transform this project description for "${projectTitle}" into exactly 3 ATS-optimized bullet points:

Original description:
${projectDescription}

Extract and enhance the key achievements with:
- Specific metrics and numbers
- Technical details and tools used
- Clear business impact
- Strong action verbs`;
    }

    // Validate that we have a prompt to send
    if (!specificPrompt) {
      throw new Error("Invalid input parameters");
    }

    const result = await model.generateContent(basePrompt + specificPrompt);
    const response = await result.response;
    let text = response.text();

    // Validate that the response contains an array
    if (!text.includes("[") || !text.includes("]")) {
      throw new Error("Invalid response format from API");
    }

    const parsedArray = parseStringToArray(text);

    // Validate the parsed array
    if (!parsedArray || parsedArray.length === 0) {
      throw new Error("Failed to parse response into array");
    }

    // Take exactly 3 items if there are more
    const textArray = parsedArray.slice(0, 3);

    // Ensure we have exactly 3 items by adding generic ones if needed
    while (textArray.length < 3) {
      textArray.push(
        `Developed key features for "${projectTitle}" resulting in improved performance and user satisfaction`
      );
    }

    // Create HTML-formatted description with bullet points
    const formattedDescription = `<ul>
  ${textArray.map((item) => `<li>${item}</li>`).join("\n  ")}
</ul>`;

    return NextResponse.json(
      {
        textArray,
        formattedDescription,
      },
      { status: 200 }
    );
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
