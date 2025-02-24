import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import toast from "react-hot-toast";

const atsTemplate = `
You are an ATS (Applicant Tracking System) expert with a sense of humor. Analyze this resume for ATS compatibility and keyword matching.

{overallAnalysis}

This has been the review of rest of the sections. Use this overallAnalysis to create an overallReview and guide the ATS.

ANALYSIS REQUIREMENTS:

1. ATS Score Calculation (0-100):
   - Keyword matching (40%): Match rate with job description
   - Format compatibility (30%): Clean, parseable structure
   - Section organization (30%): Standard section headers and layout

2. Keyword Analysis:
   - Extract key terms from job description
   - Match against resume content
   - Calculate match rate percentage
   - List both matched and missing keywords

3. Format Analysis:
   - Verify proper section headings
   - Check formatting cleanliness
   - Identify potential parsing issues
   - List specific formatting concerns

4. Recommendations:
   - Provide 3-5 actionable improvements
   - Focus on both content and format
   - Include keyword optimization tips

5. Add a humorous verdict on ATS-friendliness that's:
   - Relevant to ATS/recruitment
   - Professional yet entertaining
   - Includes tech-related wordplay when appropriate

6. Overall review should be a 3-5 sentence summary of what is right and what is wrong with the resume in a humorous tone.

Resume Content: {resumeText}
Job Description: {jobDescription}


Return a structured JSON response as specified in the schema.
All scores and percentages should be out of 100.
`;

const atsAnalysisStructure = {
  type: "object",
  properties: {
    atsScore: { type: "number" },
    overallReview: { type: "string" },
    subscores: {
      type: "object",
      properties: {
        keywordScore: { type: "number" },
        formatScore: { type: "number" },
        organizationScore: { type: "number" },
      },
      required: ["keywordScore", "formatScore", "organizationScore"],
    },
    keywordMatch: {
      type: "object",
      properties: {
        matched: { type: "array", items: { type: "string" } },
        missing: { type: "array", items: { type: "string" } },
        overallMatchRate: { type: "number" },
      },
      required: ["matched", "missing", "overallMatchRate"],
    },
    formatAnalysis: {
      type: "object",
      properties: {
        hasProperStructure: { type: "boolean" },
        hasCleanFormatting: { type: "boolean" },
        issues: { type: "array", items: { type: "string" } },
      },
      required: ["hasProperStructure", "hasCleanFormatting", "issues"],
    },
    recommendations: { type: "array", items: { type: "string" } },
    humorousVerdict: { type: "string" },
  },
  required: [
    "atsScore",
    "subscores",
    "keywordMatch",
    "overallReview",
    "formatAnalysis",
    "recommendations",
    "humorousVerdict",
  ],
};

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  maxRetries: 2,
});

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobDescription, overallAnalysis } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Missing required fields: resumeText or jobDescription" },
        { status: 400 }
      );
    }

    const atsPrompt = PromptTemplate.fromTemplate(atsTemplate);
    const atsLlm = llm.withStructuredOutput(atsAnalysisStructure);
    const atsChain = atsPrompt.pipe(atsLlm);

    const atsAnalysis = await atsChain.invoke({
      resumeText,
      jobDescription,
      overallAnalysis
    });

    return NextResponse.json({ success: true, atsAnalysis }, { status: 200 });
  } catch (error) {
    toast.error("ATS Analysis Error");
    return NextResponse.json(
      { error: "Failed to process ATS analysis" },
      { status: 500 }
    );
  }
}
