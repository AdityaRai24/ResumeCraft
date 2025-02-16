import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { jobDescription, parseStringToArray } from "@/lib/utils";

// Structure for Skills and Education Analysis
const skillsEducationStructure = {
  type: "object",
  properties: {
    skillsAnalysis: {
      type: "object",
      properties: {
        matchingSkills: { type: "array", items: { type: "string" } },
        missingSkills: { type: "array", items: { type: "string" } },
        suggestedEnhancements: { type: "array", items: { type: "string" } },
        sassyComments: { type: "array", items: { type: "string" } },
        overallScore: { type: "number" },
        review: { type: "string" }
      },
      required: [
        "matchingSkills",
        "missingSkills",
        "suggestedEnhancements",
        "sassyComments",
        "overallScore",
        "review"
      ],
    },
    educationAnalysis: {
      type: "object",
      properties: {
        entries: {
          type: "array",
          items: {
            type: "object",
            properties: {
              hasDegreeName: { type: "boolean" },
              hasInstitution: { type: "boolean" },
              hasDates: { type: "boolean" },
              hasCGPA: { type: "boolean" },
              hasLocation: { type: "boolean" },
              missingRequired: { type: "array", items: { type: "string" } },
              humorousNote: { type: "string" }
            },
            required: [
              "hasDegreeName",
              "hasInstitution",
              "hasDates",
              "hasCGPA",
              "hasLocation",
              "missingRequired",
              "humorousNote"
            ],
          },
        },
        overallRoast: { type: "string" },
        overallScore: { type: "number" },
        review: { type: "string" }
      },
      required: ["entries", "overallRoast", "overallScore", "review"],
    }
  },
  required: ["skillsAnalysis", "educationAnalysis"]
};

// Structure for Projects and Experience Analysis
const projectsExperienceStructure = {
  type: "object",
  properties: {
    projectsAnalysis: {
      type: "object",
      properties: {
        entries: {
          type: "array",
          items: {
            type: "object",
            properties: {
              hasProjectName: { type: "boolean" },
              hasTechnologies: { type: "boolean" },
              hasDescription: { type: "boolean" },
              hasOutcomes: { type: "boolean" },
              relevanceScore: { type: "number" },
              missingElements: { type: "array", items: { type: "string" } },
              improvementSuggestions: { type: "array", items: { type: "string" } },
              wittyComment: { type: "string" }
            },
            required: [
              "hasProjectName",
              "hasTechnologies",
              "hasDescription",
              "hasOutcomes",
              "relevanceScore",
              "missingElements",
              "improvementSuggestions",
              "wittyComment"
            ],
          },
        },
        overallSuggestions: { type: "array", items: { type: "string" } },
        comedicSummary: { type: "string" },
        overallScore: { type: "number" },
        review: { type: "string" }
      },
      required: ["entries", "overallSuggestions", "comedicSummary", "overallScore", "review"],
    },
    experienceAnalysis: {
      type: "object",
      properties: {
        entries: {
          type: "array",
          items: {
            type: "object",
            properties: {
              hasCompanyName: { type: "boolean" },
              hasRole: { type: "boolean" },
              hasDuration: { type: "boolean" },
              hasResponsibilities: { type: "boolean" },
              hasAchievements: { type: "boolean" },
              relevanceScore: { type: "number" },
              missingElements: { type: "array", items: { type: "string" } },
              buzzwordCount: { type: "number" },
              funnyTakeaway: { type: "string" },
              improvementTips: { type: "array", items: { type: "string" } }
            },
            required: [
              "hasCompanyName",
              "hasRole",
              "hasDuration",
              "hasResponsibilities",
              "hasAchievements",
              "relevanceScore",
              "missingElements",
              "buzzwordCount",
              "funnyTakeaway",
              "improvementTips"
            ],
          },
        },
        overallScore: { type: "number" },
        funnyHighlights: { type: "array", items: { type: "string" } },
        careerStoryRoast: { type: "string" },
        review: { type: "string" }
      },
      required: ["entries", "overallScore", "funnyHighlights", "careerStoryRoast", "review"],
    }
  },
  required: ["projectsAnalysis", "experienceAnalysis"]
};

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  maxRetries: 2,
});

// Template for Skills and Education Analysis
const skillsEducationTemplate = `
You're a witty resume reviewer analyzing skills and education sections. Provide detailed analysis with both humor and actionable feedback.

ANALYSIS REQUIREMENTS:

Skills Section Analysis:
1. Deep Skill Assessment:
   - Match skills against job requirements
   - Identify skill gaps and opportunities
   - Evaluate skill presentation and organization
2. Scoring Criteria (0-100):
   - Relevance to job description (40%)
   - Skill organization and presentation (30%)
   - Technical depth and breadth (30%)
3. Detailed Review Should Include:
   - Skill categorization effectiveness
   - Balance of technical and soft skills
   - Suggestions for skill development
   - Formatting and presentation advice

Education Section Analysis:
1. Comprehensive Evaluation:
   - Degree relevance to career path
   - Academic achievements presentation
   - Educational timeline clarity
2. Scoring Criteria (0-100):
   - Relevance of qualifications (40%)
   - Presentation and detail (30%)
   - Academic achievements (30%)
3. Detailed Review Should Include:
   - Format and organization feedback
   - Suggestions for highlighting achievements
   - Tips for education section optimization

HUMOR GUIDELINES:
- Use industry-relevant jokes
- Keep humor professional yet engaging
- Include witty observations about common resume patterns
- Make relatable comments about education and skill development

Job Description: {jobDescription}
Skills Section: {skills}
Education Section: {education}

Return analysis in strict JSON format as specified.
`;

// Template for Projects and Experience Analysis
const projectsExperienceTemplate = `
You're a perceptive resume reviewer analyzing projects and work experience sections. Provide comprehensive analysis with both humor and constructive feedback.

ANALYSIS REQUIREMENTS:

Projects Section Analysis:
1. Detailed Project Evaluation:
   - Technical complexity assessment
   - Project relevance to target role
   - Impact measurement and presentation
2. Scoring Criteria (0-100):
   - Project relevance and impact (40%)
   - Technical complexity (30%)
   - Presentation and detail (30%)
3. Detailed Review Should Include:
   - Project selection strategy
   - Technical depth demonstration
   - Improvement recommendations
   - Impact presentation tips

Experience Section Analysis:
1. Career Progression Evaluation:
   - Role relevance to target position
   - Achievement quantification
   - Professional growth demonstration
2. Scoring Criteria (0-100):
   - Role relevance and progression (40%)
   - Achievement demonstration (30%)
   - Experience presentation (30%)
3. Detailed Review Should Include:
   - Career narrative strength
   - Achievement presentation
   - Professional development path
   - Experience section optimization

HUMOR GUIDELINES:
- Use industry-specific jokes
- Keep humor professional but engaging
- Include witty observations about project patterns
- Make relatable comments about work experiences

Job Description: {jobDescription}
Projects Section: {projects}
Experience Section: {experience}

Return analysis in strict JSON format as specified.
`;

const extractDataTemplate = `
You are a funny resume parser who loves making simple jokes while organizing data. Think of yourself as that friend who can't help but crack jokes, but keeps them light and easy to get.

STRICT REQUIREMENTS FOR JSON OUTPUT:
1. Structure and Content:
   - Extract all text content exactly as shown (even if it makes you laugh)
   - Only include fields that contain data (can't joke about what's not there!)
   - Return pure JSON with no markdown formatting or comments (save the jokes for later)

2. Section Naming Rules:
   - Rename these sections as specified (even if the names are boring):
     * "Work Experience" → "experience" (aka "what I did to pay my bills")
     * "Technical Skills" → "skills" (or "stuff I put on LinkedIn")
     * "Projects" → "projects" (weekend coding adventures)
     * "Education" → "education" (where I learned to drink coffee)
   - For other sections:
     * Replace spaces with underscores (because spaces are too fancy)
     * Keep original names in lowercase (we're keeping it casual)

3. Personal Details:
   - Group all personal information under "personal_details" object
   - Include: name, email, phone, location, social links
   - Set "profilePic": false (unless image detected)

4. Document Structure:
   - Add "numberOfColumns": X (yes, we can count!)
   - Keep the structure clean (like your room should be)

*** RESUME DATA STARTS 
{resume}
*** RESUME DATA ENDS
.`;

export async function POST(req: NextRequest) {
  try {
    const { extractedText } = await req.json();

    if (!extractedText) {
      return NextResponse.json(
        { error: "No resume data provided" },
        { status: 400 }
      );
    }

    // Extract data first
    const extractDataPrompt = PromptTemplate.fromTemplate(extractDataTemplate);
    const extractChain = extractDataPrompt.pipe(llm);
    const result = await extractChain.invoke({ resume: extractedText });
    const cleanResponse = result.lc_kwargs.content
      .trim()
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .replace(/^\s*"|"\s*$/g, "");

    const parsedData = JSON.parse(cleanResponse);

    // Analyze Skills and Education
    const skillsEducationPrompt = PromptTemplate.fromTemplate(skillsEducationTemplate);
    const skillsEducationLlm = llm.withStructuredOutput(skillsEducationStructure);
    const skillsEducationChain = skillsEducationPrompt.pipe(skillsEducationLlm);

    const skillsEducationAnalysis = await skillsEducationChain.invoke({
      jobDescription: jobDescription,
      skills: JSON.stringify(parsedData.skills),
      education: JSON.stringify(parsedData.education)
    });

    // Analyze Projects and Experience
    const projectsExperiencePrompt = PromptTemplate.fromTemplate(projectsExperienceTemplate);
    const projectsExperienceLlm = llm.withStructuredOutput(projectsExperienceStructure);
    const projectsExperienceChain = projectsExperiencePrompt.pipe(projectsExperienceLlm);

    const projectsExperienceAnalysis = await projectsExperienceChain.invoke({
      jobDescription: jobDescription,
      projects: JSON.stringify(parsedData.projects),
      experience: JSON.stringify(parsedData.experience)
    });

    return NextResponse.json(
      {
        parsedResume: parsedData,
        analysis: {
          ...skillsEducationAnalysis,
          ...projectsExperienceAnalysis
        }
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error processing resume:", error);
    return NextResponse.json(
      {
        error: "Failed to process resume",
        details: error.message,
      },
      { status: 500 }
    );
  }
}