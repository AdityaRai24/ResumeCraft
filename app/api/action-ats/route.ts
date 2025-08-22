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

    const { resume, desiredRole, experienceLevel } = await req.json();

    if (!resume) {
      return NextResponse.json(
        { error: "Cannot find resume." },
        { status: 400 }
      );
    }

    if (!desiredRole) {
      return NextResponse.json(
        { error: "Desired role is required for optimization." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite-preview-06-17",
    });

    // Extract projects and experience sections
    const projectsSection = resume.find(
      (section: any) => section.type === "projects"
    );
    const experienceSection = resume.find(
      (section: any) => section.type === "experience"
    );

    let optimizedResume = [...resume];
    let usedActionWords: string[] = [];

    // Optimize Projects Section first
    if (projectsSection) {
      const result = await optimizeProjectsSection(
        model,
        projectsSection,
        desiredRole,
        experienceLevel,
        usedActionWords
      );

      const projectIndex = resume.findIndex(
        (section: any) => section.type === "projects"
      );
      if (projectIndex !== -1) {
        optimizedResume[projectIndex] = result.optimizedSection;
        usedActionWords = result.usedActionWords;
      }
    }

    // Optimize Experience Section with used action words from projects
    if (experienceSection) {
      const result = await optimizeExperienceSection(
        model,
        experienceSection,
        desiredRole,
        experienceLevel,
        usedActionWords
      );

      const experienceIndex = resume.findIndex(
        (section: any) => section.type === "experience"
      );
      if (experienceIndex !== -1) {
        optimizedResume[experienceIndex] = result.optimizedSection;
      }
    }

    return NextResponse.json(
      {
        updatedResume: optimizedResume,
        success: true,
        message: "Resume successfully optimized for ATS compatibility",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in resume optimization:", error);

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          {
            error:
              "Invalid API key. Please check your Google AI configuration.",
          },
          { status: 401 }
        );
      }
      if (error.message.includes("quota")) {
        return NextResponse.json(
          { error: "API quota exceeded. Please try again later." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "An unexpected server error occurred. Please try again.",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}

async function optimizeProjectsSection(
  model: any,
  projectsSection: any,
  desiredRole: string,
  experienceLevel: string,
  usedActionWords: string[]
) {
  const actionWords = [
    "Achieved",
    "Built",
    "Created",
    "Designed",
    "Developed",
    "Enhanced",
    "Fixed",
    "Improved",
    "Launched",
    "Led",
    "Made",
    "Reduced",
    "Solved",
    "Tested",
    "Updated",
    "Added",
    "Completed",
    "Delivered",
    "Expanded",
    "Increased",
    "Managed",
    "Planned",
    "Started",
    "Worked",
    "Handled",
    "Organized",
    "Setup",
    "Used",
    "Applied",
    "Focused",
    "Helped",
  ];

  const availableWords = actionWords.filter((word) => {
    const count = usedActionWords.filter(
      (used) => used.toLowerCase() === word.toLowerCase()
    ).length;
    return count < 2;
  });

  const prompt = `You are an expert ATS resume optimizer specializing in PROJECT SECTIONS. Your task is to optimize the projects section for ATS compatibility and keyword relevance.

TARGET ROLE: ${desiredRole}
EXPERIENCE LEVEL: ${experienceLevel}
ALREADY USED ACTION WORDS: ${usedActionWords.join(", ")}

🛑 STRUCTURE PRESERVATION (MANDATORY):
- You must preserve the exact JSON structure of the projects section
- Do NOT change metadata like "type", "isVisible", "style", "orderNumber"
- Only modify the "content" field and its nested structures
- Maintain the projects array structure within content
- Preserve all HTML tags: <ul><li></li></ul>

📌 WORD COUNT VERIFICATION:
Before finalizing each bullet point, COUNT THE WORDS to ensure it meets the 20-25 word requirement:
- Count every single word including articles (a, an, the), prepositions, etc.
- If under 20 words: Add technical details, collaboration aspects, or specific outcomes
- If over 25 words: Remove unnecessary words while keeping key information
- EXAMPLE: "Developed responsive web application using React and Node.js that improved user engagement by 40% and reduced page load time significantly through optimized code." (23 words ✓)

📌 OPTIMIZATION RULES FOR PROJECTS:

1. REMOVE ATS-INCOMPATIBLE FORMATTING:
   - Remove ALL emojis/icons/symbols (📧 📍 ✅ ⚙ 🚀 etc.)
   - Clean up any special characters that ATS cannot parse
   - Standardize date formats

2. ACTION WORDS (CRITICAL):
   - ONLY use these simple action words: ${availableWords.join(", ")}
   - DO NOT use complex words like "architected", "spearheaded", "orchestrated", "facilitated"
   - Each action word can be used MAXIMUM 2 times across the entire resume
   - Avoid repeating action words already used: ${usedActionWords.join(", ")}

3. PROJECT TITLES:
   - Enhance project titles for clarity and keyword relevance
   - Make them professional and descriptive
   - Include relevant technologies if appropriate

4. BULLET POINTS (<li> content) - WORD COUNT CRITICAL:
   - Use simple action verbs from the approved list above
   - Generate exactly 3 points per project (unless original has more, then keep same number)
   - MANDATORY: Each bullet point must be EXACTLY 20-25 words (count every word)
   - MINIMUM 20 words, MAXIMUM 25 words per bullet point
   - Include specific details, technologies, metrics, and outcomes to reach word count
   - Quantify results where logical: "Improved performance by 30%", "Reduced load time by 2 seconds"
   - Add technical details, methodologies, or collaboration aspects to meet word requirement

5. KEYWORD OPTIMIZATION:
   - Include industry-relevant keywords based on target role
   - For software roles: REST APIs, CI/CD, Agile, Unit Testing, Docker, TypeScript, React, Node.js, etc.
   - Make keyword usage natural and contextual

6. TECHNICAL DEPTH:
   - Highlight specific technologies, frameworks, and methodologies used
   - Show problem-solving and innovation
   - Use simple, clear language

7. AVOID BUZZWORDS:
   - Remove and avoid cliché buzzwords like 'Results-driven', 'Team player', 'Proactive', 'Detail-oriented', 'Strategic thinker', 'Problem-solver', 'Self-motivated', 'Adaptable', 'Strong communication skills', 'Leadership experience', 'Cross-functional collaboration', 'Analytical mindset', 'Fast learner', 'Goal-oriented', 'Takes ownership'.
   - Instead, demonstrate these qualities through concrete examples and metrics within the bullet points.

OUTPUT: Return ONLY the complete projects section as valid JSON (no markdown formatting).

PROJECTS SECTION TO OPTIMIZE:
${JSON.stringify(projectsSection, null, 2)}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const generatedText = response.text().trim();

  try {
    const cleanedText = generatedText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "");
    const optimizedSection = JSON.parse(cleanedText);

    // Extract used action words from the optimized content
    const newUsedWords = extractActionWords(optimizedSection, actionWords);
    const allUsedWords = [...usedActionWords, ...newUsedWords];

    return {
      optimizedSection,
      usedActionWords: allUsedWords,
    };
  } catch (parseError) {
    console.error("Failed to parse projects optimization:", parseError);
    return {
      optimizedSection: projectsSection,
      usedActionWords,
    };
  }
}

async function optimizeExperienceSection(
  model: any,
  experienceSection: any,
  desiredRole: string,
  experienceLevel: string,
  usedActionWords: string[]
) {
  const actionWords = [
    "Achieved",
    "Built",
    "Created",
    "Designed",
    "Developed",
    "Enhanced",
    "Fixed",
    "Improved",
    "Launched",
    "Led",
    "Made",
    "Reduced",
    "Solved",
    "Tested",
    "Updated",
    "Added",
    "Completed",
    "Delivered",
    "Expanded",
    "Increased",
    "Managed",
    "Planned",
    "Started",
    "Worked",
    "Handled",
    "Organized",
    "Setup",
    "Used",
    "Applied",
    "Focused",
    "Helped",
  ];

  const availableWords = actionWords.filter((word) => {
    const count = usedActionWords.filter(
      (used) => used.toLowerCase() === word.toLowerCase()
    ).length;
    return count < 2;
  });

  const prompt = `You are an expert ATS resume optimizer specializing in EXPERIENCE SECTIONS. Your task is to optimize the work experience section for ATS compatibility and impact.

TARGET ROLE: ${desiredRole}
EXPERIENCE LEVEL: ${experienceLevel}
ALREADY USED ACTION WORDS: ${usedActionWords.join(", ")}

🛑 STRUCTURE PRESERVATION (MANDATORY):
- You must preserve the exact JSON structure of the experience section
- Do NOT change metadata like "type", "isVisible", "style", "orderNumber"
- Only modify the "content" field and its nested structures
- Maintain all HTML tags: <ul><li></li></ul>
- Preserve job titles, company names, and date ranges

📌 WORD COUNT VERIFICATION:
Before finalizing each bullet point, COUNT THE WORDS to ensure it meets the 20-25 word requirement:
- Count every single word including articles (a, an, the), prepositions, etc.
- If under 20 words: Add technical details, team collaboration, or specific metrics
- If over 25 words: Remove unnecessary words while keeping key achievements
- EXAMPLE: "Led cross-functional team of 8 developers to deliver enterprise software solution that increased client satisfaction by 35% and reduced processing time." (21 words ✓)

📌 OPTIMIZATION RULES FOR EXPERIENCE:

1. REMOVE ATS-INCOMPATIBLE FORMATTING:
   - Remove ALL emojis/icons/symbols (📧 📍 ✅ ⚙ 🚀 etc.)
   - Clean up any special characters that ATS cannot parse
   - Standardize date formats (e.g., "Jan 2023 – Mar 2024")

2. ACTION WORDS (CRITICAL):
   - ONLY use these simple action words: ${availableWords.join(", ")}
   - DO NOT use complex words like "architected", "spearheaded", "orchestrated", "facilitated"
   - Each action word can be used MAXIMUM 2 times across the entire resume
   - DO NOT repeat action words already used: ${usedActionWords.join(", ")}

3. BULLET POINTS (<li> content) - WORD COUNT CRITICAL:
   - Start with simple action verbs from the approved list above
   - Generate exactly 3 points per job (unless original has more, then keep same number)
   - MANDATORY: Each bullet point must be EXACTLY 20-25 words (count every word)
   - MINIMUM 20 words, MAXIMUM 25 words per bullet point
   - Include specific details, technologies, metrics, teams, and outcomes to reach word count
   - Keep language simple and clear, avoid complex terminology
   - Focus on RESULTS and IMPACT, not just responsibilities
   - Quantify achievements: "Increased efficiency by 40%", "Managed team of 8", "Reduced costs by $50K"
   - Add collaboration details, methodologies, or technical specifics to meet word requirement

4. ACHIEVEMENT-FOCUSED LANGUAGE:
   - Transform responsibilities into accomplishments
   - Use simple, direct language
   - Show progression and growth in responsibilities

5. KEYWORD OPTIMIZATION:
   - Include role-specific keywords naturally
   - For tech roles: Agile, Scrum, CI/CD, Cloud, APIs, Database, Testing, etc.
   - For business roles: Strategy, Analytics, Process Improvement, Stakeholder Management, etc.
   - Match keywords to the target role requirements

6. TECHNICAL AND SOFT SKILLS:
   - Highlight both technical proficiencies and leadership/collaboration skills
   - Show cross-functional work and team collaboration
   - Use simple, clear language

7. AVOID BUZZWORDS:
   - Remove and avoid cliché buzzwords like 'Results-driven', 'Team player', 'Proactive', 'Detail-oriented', 'Strategic thinker', 'Problem-solver', 'Self-motivated', 'Adaptable', 'Strong communication skills', 'Leadership experience', 'Cross-functional collaboration', 'Analytical mindset', 'Fast learner', 'Goal-oriented', 'Takes ownership'.
   - Instead, demonstrate these qualities through concrete examples and metrics within the bullet points.

OUTPUT: Return ONLY the complete experience section as valid JSON (no markdown formatting).

EXPERIENCE SECTION TO OPTIMIZE:
${JSON.stringify(experienceSection, null, 2)}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const generatedText = response.text().trim();

  try {
    const cleanedText = generatedText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "");
    const optimizedSection = JSON.parse(cleanedText);

    return {
      optimizedSection,
      usedActionWords,
    };
  } catch (parseError) {
    console.error("Failed to parse experience optimization:", parseError);
    return {
      optimizedSection: experienceSection,
      usedActionWords,
    };
  }
}

function extractActionWords(section: any, actionWords: string[]): string[] {
  const usedWords: string[] = [];
  const content = JSON.stringify(section).toLowerCase();

  actionWords.forEach((word) => {
    const regex = new RegExp(`\\b${word.toLowerCase()}\\b`, "g");
    const matches = content.match(regex);
    if (matches) {
      matches.forEach(() => usedWords.push(word));
    }
  });

  return usedWords;
}
