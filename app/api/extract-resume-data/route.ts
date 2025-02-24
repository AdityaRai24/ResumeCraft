import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import toast from "react-hot-toast";

export const runtime = 'edge'

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  maxRetries: 2,
});

const skillsEducationStructure = {
  type: "object",
  properties: {
    skillsAnalysis: {
      type: "object",
      properties: {
        matchingSkills: { type: "array", items: { type: "string" } },
        missingSkills: { type: "array", items: { type: "string" } },
        overallScore: { type: "number" },
        subscores: {
          type: "object",
          properties: {
            matchingSkillsScore: { type: "number" },
            technicalDepthScore: { type: "number" },
          },
          required: ["matchingSkillsScore", "technicalDepthScore"],
        },
        review: { type: "string" },
        funnyTakeaway: { type: "string" },
      },
      required: [
        "matchingSkills",
        "missingSkills",
        "funnyTakeaway",
        "overallScore",
        "subscores",
        "review",
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
              humorousNote: { type: "string" },
            },
            required: [
              "hasDegreeName",
              "hasInstitution",
              "hasDates",
              "hasCGPA",
              "hasLocation",
              "missingRequired",
              "humorousNote",
            ],
          },
        },
        overallScore: { type: "number" },
        subscores: {
          type: "object",
          properties: {
            completenessScore: { type: "number" },
            relevanceScore: { type: "number" },
          },
          required: ["completenessScore", "relevanceScore"],
        },
        overallRoast: { type: "string" },
        review: { type: "string" },
      },
      required: [
        "entries",
        "overallRoast",
        "overallScore",
        "subscores",
        "review",
      ],
    },
  },
  required: ["skillsAnalysis", "educationAnalysis"],
};

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
              hasQuantifiers: { type: "boolean" },
              hasOutcomes: { type: "boolean" },
              relevanceScore: { type: "number" },
              projectTitle: { type: "string" },
              wittyComment: { type: "string" },
            },
            required: [
              "hasProjectName",
              "hasTechnologies",
              "hasDescription",
              "hasQuantifiers",
              "hasOutcomes",
              "relevanceScore",
              "projectTitle",
              "wittyComment",
            ],
          },
        },
        numberOfBulletPoints: { type: "number" },
        overallScore: { type: "number" },
        subscores: {
          type: "object",
          properties: {
            relevanceScore: { type: "number" },
            technicalScore: { type: "number" },
          },
          required: ["relevanceScore", "technicalScore"],
        },
        comedicSummary: { type: "string" },
        review: { type: "string" },
      },
      required: [
        "entries",
        "comedicSummary",
        "overallScore",
        "subscores",
        "review",
        "numberOfBulletPoints",
      ],
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
              improvementTips: { type: "array", items: { type: "string" } },
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
              "improvementTips",
            ],
          },
        },
        numberOfBulletPoints: { type: "number" },
        overallScore: { type: "number" },
        subscores: {
          type: "object",
          properties: {
            roleRelevanceScore: { type: "number" },
            achievementsScore: { type: "number" },
            clarityScore: { type: "number" },
          },
          required: ["roleRelevanceScore", "achievementsScore", "clarityScore"],
        },
        funnyHighlights: { type: "array", items: { type: "string" } },
        careerStoryRoast: { type: "string" },
        review: { type: "string" },
      },
      required: [
        "entries",
        "overallScore",
        "subscores",
        "funnyHighlights",
        "careerStoryRoast",
        "review",
        "numberOfBulletPoints",
      ],
    },
  },
  required: ["projectsAnalysis", "experienceAnalysis"],
};

const atsAnalysisStructure = {
  type: "object",
  properties: {
    atsScore: { type: "number" },
    overallReview: { type: "string" },
  },
  required: ["atsScore", "overallReview"],
};

const extractDataTemplate = `
You are a highly intelligent resume parser with a witty personality. Your goal is to extract structured information while making light, professional jokes.

STRICT JSON OUTPUT REQUIREMENTS:
1. Extract all resume text accurately.
2. Remove unnecessary spaces, markdown, or extraneous content.
3. Ensure fields are correctly structured and labeled:
   - "Work Experience" → "experience"
   - "Technical Skills" → "skills"
   - "Projects" → "projects"
   - "Education" → "education"
   - Any other sections should be renamed using underscores (e.g., "certifications" → "certifications")
4. Group personal details under "personal_details" and set "profilePic": false
5. Maintain a clean and readable JSON structure.
6. Parse projects , experience or any other sections descriptions into array of points if it exists in bullet points.
7. Sections with some what similar meaning should not be changed. For eg : Projects and Experience both should be extracted and stored under projects and experience keys respectively. Positions of Responsibility section is not the same as experience.
8. While parsing projects and experience, project titles and job roles/experience role should be named as title only and descriptions to be named description only.

*** RESUME DATA STARTS ***
{resume}
*** RESUME DATA ENDS ***
`;

const skillsEducationTemplate = `
You're an intelligent and witty resume reviewer. Your goal is to analyze skills and education sections with both humor and actionable feedback while maintaining a structured approach.

ANALYSIS REQUIREMENTS:

Skills Section Analysis:
1. Skills Matching Process:
   - Matching Skills: List skills appearing in BOTH the job description and resume
   - Missing Skills: List skills in the job description but absent from the resume
   - Ensure that technical terms are well-recognized industry standards
   - Skills are 1-2 words of skill

2. Scoring Criteria (0-100):
   - Matching Skills (40%): Based on overlap with job requirements
   - Technical Depth (30%): Evaluation of skill sophistication
   - Presentation (30%): Organization and clarity

3. Review Format:
   - Provide a concise but insightful summary
   - Offer constructive feedback
   - Include a funny takeaway that's relevant but never offensive

Education Section Analysis:
1. Entry Analysis Requirements:
   - Check for: Degree Name, Institution, Dates, CGPA, Location
   - Highlight missing required elements
   - Add one humorous observation while staying professional

2. Scoring Criteria (0-100):
   - Completeness (50%): All required information present
   - Relevance (50%): Match with job requirements

3. Review Components:
   - Overall Roast: A witty but constructive comment
   - Detailed feedback on completeness and improvements

HUMOR GUIDELINES:
- Use industry-relevant jokes
- Keep humor light and professional
- Ensure it supports rather than overshadows feedback

Job Description: {jobDescription}
Skills Section: {skills}
Education Section: {education}

Return a structured JSON response as specified in the schema.

All scores should be out of 100. If a section is empty score should be 0.
`;

const projectsExperienceTemplate = `
You're an expert resume reviewer analyzing projects and work experience. Provide deep analysis, humor, and actionable insights.

ANALYSIS REQUIREMENTS:

Projects Section Analysis:
1. Evaluate each project for:
   - Technical complexity and relevance
   - Impact measurement and clarity
   - Quantifiable achievements

2. Scoring Criteria (0-100):
   - Relevance and Impact (40%)
   - Technical Complexity (30%)
   - Presentation Clarity (30%)

3. Review Format:
   - Provide specific improvement suggestions
   - Include witty comments on project descriptions
   - Add a humorous summary of project section

Experience Section Analysis:
1. Career Progression Review:
   - Role relevance to target position
   - Achievement quantification
   - Professional growth demonstration

2. Scoring Criteria (0-100):
   - Role Relevance (40%)
   - Achievement Quality (30%)
   - Clarity and Impact (30%)

3. Review Components:
   - Identify missing key details
   - Analyze buzzword usage
   - Provide funny but insightful career story roast

HUMOR GUIDELINES:
- Keep jokes industry-relevant
- Maintain professionalism
- Use humor to enhance, not detract from analysis

Job Description: {jobDescription}
Projects Section: {projects}
Experience Section: {experience}

Return structured JSON data as specified in the schema.
All scores should be out of 100. If a section is empty score should be 0.

`;

const atsTemplate = `
You are an ATS (Applicant Tracking System) expert with a sense of humor. Analyze this resume for ATS compatibility and keyword matching.

Resume Review : {allReviews}

ANALYSIS REQUIREMENTS:

1. ATS Score Calculation (0-100):
   - Keyword matching (40%): Match rate with job description
   - Section organization (30%): Standard section headers and layout
   - Consistent date formats

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

5. Overall review should be a 3-5 sentence summary of what is right and what is wrong with the resume in a humorous tone. Use the resume review and generate this overall review.


Return a structured JSON response as specified in the schema.
All scores should be out of 100

`;

function calculateOverallScore({
  skillsScore,
  educationScore,
  projectsScore,
  experienceScore,
  atsScore,
}: {
  skillsScore: number;
  educationScore: number;
  projectsScore: number;
  experienceScore: number;
  atsScore: number;
}): number {
  return Math.round(
    skillsScore * 0.25 +
      educationScore * 0.15 +
      projectsScore * 0.2 +
      experienceScore * 0.25 +
      atsScore * 0.15
  );
}

export async function POST(req: NextRequest) {
  try {
    const { extractedText, jobDescription } = await req.json();

    if (!extractedText || !jobDescription) {
      return NextResponse.json(
        { error: "Missing required data (resume or job description)" },
        { status: 400 }
      );
    }

    const extractDataPrompt = PromptTemplate.fromTemplate(extractDataTemplate);
    const extractChain = extractDataPrompt.pipe(llm);
    const result = await extractChain.invoke({ resume: extractedText });

    const cleanResponse = result.lc_kwargs.content
      .trim()
      .replace(/^```json\s*/, "")
      .replace(/```$/, "");

    const parsedData = JSON.parse(cleanResponse);

    const skillsEducationPrompt = PromptTemplate.fromTemplate(
      skillsEducationTemplate
    );
    const skillsEducationLlm = llm.withStructuredOutput(
      skillsEducationStructure
    );
    const skillsEducationChain = skillsEducationPrompt.pipe(skillsEducationLlm);

    const skillsEducationAnalysis = await skillsEducationChain.invoke({
      jobDescription: JSON.stringify(jobDescription),
      skills: JSON.stringify(parsedData.skills || []),
      education: JSON.stringify(parsedData.education || []),
    });

    const projectsExperiencePrompt = PromptTemplate.fromTemplate(
      projectsExperienceTemplate
    );
    const projectsExperienceLlm = llm.withStructuredOutput(
      projectsExperienceStructure
    );
    const projectsExperienceChain = projectsExperiencePrompt.pipe(
      projectsExperienceLlm
    );

    const projectsExperienceAnalysis = await projectsExperienceChain.invoke({
      jobDescription: JSON.stringify(jobDescription),
      projects: JSON.stringify(parsedData.projects || []),
      experience: JSON.stringify(parsedData.experience || []),
    });

    const atsPrompt = PromptTemplate.fromTemplate(atsTemplate);
    const atsLlm = llm.withStructuredOutput(atsAnalysisStructure);
    const atsChain = atsPrompt.pipe(atsLlm);

    const allReviews = {
      skillsScore: skillsEducationAnalysis.skillsAnalysis.overallScore,
      educationScore: skillsEducationAnalysis.educationAnalysis.overallScore,
      projectsScore: projectsExperienceAnalysis.projectsAnalysis.overallScore,
      experienceScore:
        projectsExperienceAnalysis.experienceAnalysis.overallScore,
      skillsReview: skillsEducationAnalysis.skillsAnalysis.review,
      educationReview: skillsEducationAnalysis.educationAnalysis.review,
      projectsReview: projectsExperienceAnalysis.projectsAnalysis.review,
      experienceReview: projectsExperienceAnalysis.experienceAnalysis.review,
    };

    const atsAnalysis = await atsChain.invoke({
      resumeText: extractedText,
      jobDescription: jobDescription,
      allReviews: allReviews,
    });

    const overallScore = calculateOverallScore({
      skillsScore: skillsEducationAnalysis.skillsAnalysis.overallScore,
      educationScore: skillsEducationAnalysis.educationAnalysis.overallScore,
      projectsScore: projectsExperienceAnalysis.projectsAnalysis.overallScore,
      experienceScore:
        projectsExperienceAnalysis.experienceAnalysis.overallScore,
      atsScore: atsAnalysis.atsScore,
    });

    const analysisResponse = {
      parsedResume: parsedData,
      analysis: {
        overall: {
          score: overallScore,
          breakdowns: {
            skills: {
              score: skillsEducationAnalysis.skillsAnalysis.overallScore,
              weight: "25%",
            },
            education: {
              score: skillsEducationAnalysis.educationAnalysis.overallScore,
              weight: "15%",
            },
            projects: {
              score: projectsExperienceAnalysis.projectsAnalysis.overallScore,
              weight: "20%",
            },
            experience: {
              score: projectsExperienceAnalysis.experienceAnalysis.overallScore,
              weight: "25%",
            },
            ats: {
              score: atsAnalysis.atsScore,
              weight: "15%",
            },
          },
        },
        sections: {
          skills: skillsEducationAnalysis.skillsAnalysis,
          education: skillsEducationAnalysis.educationAnalysis,
          projects: projectsExperienceAnalysis.projectsAnalysis,
          experience: projectsExperienceAnalysis.experienceAnalysis,
          ats: atsAnalysis,
        },
      },
    };

    return NextResponse.json(analysisResponse, { status: 200 });
  } catch (error: any) {
    toast.error("Error processing resume");
    return NextResponse.json(
      {
        error: "Failed to process resume",
        details: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

