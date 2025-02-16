import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { jobDescription, parseStringToArray } from "@/lib/utils";

const structure = {
  type: "object",
  properties: {
    skillsAnalysis: {
      type: "object",
      properties: {
        matchingSkills: { type: "array", items: { type: "string" } },
        missingSkills: { type: "array", items: { type: "string" } },
        suggestedEnhancements: { type: "array", items: { type: "string" } },
        sassyComments: { type: "array", items: { type: "string" } }
      },
      required: ["matchingSkills", "missingSkills", "suggestedEnhancements", "sassyComments"],
    },
    educationCompleteness: {
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
        overallRoast: { type: "string" }
      },
      required: ["entries", "overallRoast"],
    },
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
        comedicSummary: { type: "string" }
      },
      required: ["entries", "overallSuggestions", "comedicSummary"],
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
        careerStoryRoast: { type: "string" }
      },
      required: ["entries", "overallScore", "funnyHighlights", "careerStoryRoast"],
    }
  },
  required: ["skillsAnalysis", "educationCompleteness", "projectsAnalysis", "experienceAnalysis"],
};

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  maxRetries: 2,
});

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

const analyseTemplate = `
You're a friendly resume reviewer who loves making simple, fun jokes while giving helpful advice. Think of yourself as a mix between a career coach and a stand-up comedian (but keep the jokes super easy to understand!).

Return a JSON response with your analysis AND fun comments:

\`\`\`json
{{
  "skillsAnalysis": {{
    "matchingSkills": [], // Skills they actually have
    "missingSkills": [], // Skills they wish they had
    "suggestedEnhancements": [], // How to make their skills better
    "sassyComments": [] // Funny takes on their skills (keep it simple!)
  }},
  "educationCompleteness": {{
    "entries": [
      {{
        "hasDegreeName": true/false,
        "hasInstitution": true/false,
        "hasDates": true/false,
        "hasCGPA": true/false,
        "hasLocation": true/false,
        "missingRequired": [], // What they forgot to add
        "humorousNote": "" // A funny comment about their education
      }}
    ],
    "overallRoast": "" // A funny summary of their school life
  }},
  "projectsAnalysis": {{
    "entries": [
      {{
        "hasProjectName": true/false,
        "hasTechnologies": true/false,
        "hasDescription": true/false,
        "hasOutcomes": true/false,
        "relevanceScore": 0-100, // How useful this project is
        "missingElements": [], // What's missing
        "improvementSuggestions": [], // How to make it better
        "wittyComment": "" // A funny take on this project
      }}
    ],
    "overallSuggestions": [], // Helpful tips
    "comedicSummary": "" // Funny take on all their projects
  }},
  "experienceAnalysis": {{
    "entries": [
      {{
        "hasCompanyName": true/false,
        "hasRole": true/false,
        "hasDuration": true/false,
        "hasResponsibilities": true/false,
        "hasAchievements": true/false,
        "relevanceScore": 0-100, // How relevant this job is
        "missingElements": [], // What they forgot to mention
        "buzzwordCount": 0, // Number of fancy words they used
        "funnyTakeaway": "", // A joke about this job
        "improvementTips": [] // How to make it sound better
      }}
    ],
    "overallScore": 0-100,
    "funnyHighlights": [], // Funny comments about their work history
    "careerStoryRoast": "" // A funny summary of their career journey
  }}
}}
\`\`\`

ROASTING GUIDELINES:
1. Skills Analysis:
  - Make fun of obvious skill padding ("Oh, you're an expert in everything?")
  - Joke about trendy tech buzzwords ("Another AI expert born last week!")
  - Keep jokes simple and relatable

2. Education Entries:
  - Make light jokes about college life ("4 years of pretending to read textbooks")
  - Tease about common student behaviors
  - Keep it fun and relatable to anyone who's been to school

3. Projects Analysis:
  - Joke about common project names ("Todo app #5482")
  - Tease about copy-pasted projects
  - Make fun of overly fancy project descriptions

4. Experience Analysis:
  - Poke fun at job title inflation ("Chief Keyboard Explorer")
  - Joke about typical office situations ("Professional meeting survivor")
  - Tease about buzzword bingo in job descriptions
  - Make relatable jokes about work life

IMPORTANT RULES:
- Keep jokes super simple - no fancy words!
- Make fun of the content, not the person
- Keep it friendly, like teasing a buddy
- Mix jokes with actually helpful advice
- Use examples everyone can understand
- When in doubt, think "would a high school student get this joke?"

Job Description: {jobDescription}
Skills Section: {skills}
Education: {education}
Projects: {projects}
Experience: {experience}
`;

export async function POST(req: NextRequest) {
  try {
    const { extractedText } = await req.json();

    if (!extractedText) {
      return NextResponse.json(
        { error: "No resume data provided" },
        { status: 400 }
      );
    }

    const extractDataPrompt = PromptTemplate.fromTemplate(extractDataTemplate);
    const extractChain = extractDataPrompt.pipe(llm);
    const result = await extractChain.invoke({ resume: extractedText });
    const cleanResponse = result.lc_kwargs.content
      .trim()
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .replace(/^\s*"|"\s*$/g, "");

    const parsedData = JSON.parse(cleanResponse);

    const analyzePrompt = PromptTemplate.fromTemplate(analyseTemplate);
    const structuredLlm = llm.withStructuredOutput(structure);
    const analysisChain = analyzePrompt.pipe(structuredLlm);

    const analysisResponse = await analysisChain.invoke({
      jobDescription: jobDescription,
      skills: JSON.stringify(parsedData.skills),
      education: JSON.stringify(parsedData.education),
      projects: JSON.stringify(parsedData.projects),
      experience: JSON.stringify(parsedData.experience),
    });

    return NextResponse.json(
      {
        parsedResume: parsedData,
        analysis: analysisResponse,
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