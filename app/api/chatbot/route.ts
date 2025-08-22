import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function tryParseJSON(raw: string) {
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : raw);
  } catch (err) {
    console.error("Failed to parse JSON:", raw);
    return null;
  }
}

async function detectUserIntentAndSection(
  model: any,
  userMsg: string,
  history: any[]
) {
  const prompt = `
You are a resume assistant. Here is the conversation so far:
${history.map((m: any) => m.sender + ": " + m.content).join("\n")}
User: "${userMsg}"

Always look at the chat history and answer according to context. If the user's message is a short answer (like 'yes', 'no', 'this one'), use the previous bot message and the conversation context to resolve what the user means. Do not repeat clarifying questions—proceed with the comparison or requested action.

Classify the user's intent as one of ONLY these 5, or 'resume_review' if the user is asking for a full resume review, score, or analysis:
- "edit": user wants to reword, improve, or fix existing content
- "generate": user wants to add new content, bullet points, or items
- "reduce": user wants to shorten, summarize, or condense text
- "advice": user is asking a question, seeking feedback, comparison, or general guidance (including which is better, should I include, etc.)
- "resume_review": user is asking for a full resume review, score, or analysis (e.g., 'review my resume', 'score my resume', 'analyze my resume', 'rate my resume', etc.)

- If the user is asking about projects, project comparison, or anything related to their projects, set section to "projects".
- If the user is asking about experience, set section to "experience".
- If the user is asking about skills, set section to "skills".
- If the user is asking about education, set section to "education".
- If the user is asking about summary, name, email, phone, or social links, set section to "header".
- If unsure, but the message mentions a section's content (like project names), infer the section.
- If the user is asking for a full resume review, score, or analysis, set intent to 'resume_review' and section to null.

Return a JSON object:
{ "intent": "edit" | "generate" | "reduce" | "advice" | "resume_review", "section": ... }
Return ONLY the JSON.
`;
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  try {
    const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || text);
    return parsed;
  } catch (err) {
    console.error("Failed to parse intent/section JSON:", text);
    return { intent: "advice", section: null };
  }
}

function classifyQuestionType(msg: string, history: any[]) {
  const lowerMsg = msg.toLowerCase();

  if (
    /\b(what can you do|what are you|who are you|your capabilities|help me understand|what is this|how do you work|what features)\b/i.test(
      msg
    )
  ) {
    return "self_capability";
  }

  // Feature/process questions
  if (
    /\b(how do i|how to|how does|explain|process|steps|guide|tutorial)\b/i.test(
      msg
    )
  ) {
    return "process_guide";
  }

  // Resume content analysis
  if (
    /\b(my resume|my experience|my projects|my skills|should i include|is this good|analyze|review)\b/i.test(
      msg
    )
  ) {
    return "content_analysis";
  }

  // Comparison questions
  if (
    /\b(which is better|compare|vs|versus|choose|pick|select|recommend|prefer)\b/i.test(
      msg
    )
  ) {
    return "comparison";
  }

  // General resume advice
  if (
    /\b(resume tips|best practices|advice|guidance|suggestions|recommendations)\b/i.test(
      msg
    )
  ) {
    return "general_advice";
  }

  // ATS/formatting questions
  if (/\b(ats|format|layout|design|template|structure|organize)\b/i.test(msg)) {
    return "formatting_ats";
  }

  return "content_specific";
}

function extractResumeInsights(resume: any) {
  const insights = {
    totalSections: resume.sections.length,
    availableSections: resume.sections.map((s: any) => s.type),
    hasProjects: resume.sections.some((s: any) => s.type === "projects"),
    hasExperience: resume.sections.some((s: any) => s.type === "experience"),
    hasSkills: resume.sections.some((s: any) => s.type === "skills"),
    hasEducation: resume.sections.some((s: any) => s.type === "education"),
    hasCustomSections: resume.sections.some((s: any) => s.type === "custom"),
    projectCount: 0,
    experienceCount: 0,
    skillCategories: 0,
    missingCriticalSections: [] as string[],
    // New enhanced metrics
    resumeCompleteness: 0,
    contentQuality: {
      hasQuantifiableMetrics: false,
      averageDescriptionLength: 0,
      keywordRichness: 0,
      professionalTone: 0,
    },
    atsFriendliness: {
      hasKeywords: false,
      properFormatting: false,
      sectionNaming: false,
    },
    careerAlignment: {
      skillsMatchRole: false,
      experienceRelevant: false,
      projectsAligned: false,
    },
    improvementPriorities: [] as string[],
    strengthAreas: [] as string[],
    urgentFixes: [] as string[],
  };

  // Projects Section
  const projectsSection = resume.sections.find((s: any) => s.type === "projects");
  if (projectsSection?.content?.projects) {
    insights.projectCount = Array.isArray(projectsSection.content.projects)
      ? projectsSection.content.projects.length
      : 0;

    if (insights.projectCount > 0) {
      const hasMetrics = projectsSection.content.projects.some((project: any) =>
        project.description?.match(
          /\d+%|\$[\d,]+|\d+[xX]|increased|decreased|improved|reduced|saved|generated/i
        )
      );
      insights.contentQuality.hasQuantifiableMetrics = hasMetrics;
      insights.strengthAreas.push("Active project portfolio");
      if (insights.projectCount >= 3)
        insights.strengthAreas.push("Strong project variety");
    }
  }

  // Experience Section
  const experienceSection = resume.sections.find((s: any) => s.type === "experience");
  if (experienceSection?.content?.experience) {
    insights.experienceCount = Array.isArray(experienceSection.content.experience)
      ? experienceSection.content.experience.length
      : 0;

    if (insights.experienceCount > 0) {
      const totalDescLength = experienceSection.content.experience.reduce(
        (sum: number, exp: any) => sum + (exp.jobDescription?.length || 0),
        0
      );
      insights.contentQuality.averageDescriptionLength = Math.round(
        totalDescLength / insights.experienceCount
      );

      if (insights.experienceCount >= 2)
        insights.strengthAreas.push("Solid work history");
      if (insights.contentQuality.averageDescriptionLength > 200) {
        insights.strengthAreas.push("Detailed experience descriptions");
      } else if (insights.contentQuality.averageDescriptionLength < 100) {
        insights.urgentFixes.push("Expand experience descriptions");
      }
    }
  }

  // Skills Section
  const skillsSection = resume.sections.find((s: any) => s.type === "skills");
  if (skillsSection?.content?.description) {
    const strongTags = (skillsSection.content.description.match(/<strong>/g) || []).length;
    insights.skillCategories = strongTags;

    if (insights.skillCategories >= 4) {
      insights.strengthAreas.push("Comprehensive skills organization");
    } else if (insights.skillCategories <= 2) {
      insights.improvementPriorities.push("Expand and categorize skills");
    }
  }

  // Identify missing critical sections
  const criticalSections = ["experience", "skills", "education"];
  insights.missingCriticalSections = criticalSections.filter(
    (section) => !insights.availableSections.includes(section)
  );

  // Calculate resume completeness score
  insights.resumeCompleteness = Math.round(
    (insights.availableSections.length / 5) * 30 + // Section variety
      (insights.experienceCount / 3) * 25 + // Experience depth
      (insights.projectCount / 3) * 25 + // Project showcase
      (insights.skillCategories / 4) * 20 // Skills organization
  );

  // Determine improvement priorities
  if (insights.missingCriticalSections.length > 0) {
    insights.urgentFixes.push(
      `Add missing sections: ${insights.missingCriticalSections.join(", ")}`
    );
  }

  if (!insights.contentQuality.hasQuantifiableMetrics) {
    insights.improvementPriorities.push("Add quantifiable achievements");
  }

  if (insights.experienceCount === 0 && insights.projectCount === 0) {
    insights.urgentFixes.push("Add experience or project content");
  }

  if (insights.skillCategories === 0) {
    insights.urgentFixes.push("Create structured skills section");
  }

  // Determine strength areas
  if (insights.resumeCompleteness > 80) {
    insights.strengthAreas.push("Well-structured resume foundation");
  }

  if (insights.totalSections >= 4) {
    insights.strengthAreas.push("Comprehensive resume sections");
  }

  return insights;
}

function generateAdvicePrompt(
  questionType: string,
  msg: string,
  history: any[],
  resumeInsights: any,
  desiredRole: string,
  experienceLevel: string,
  sectionContent: string | null
) {
  const baseContext = `
# CHAT HISTORY
${history.map((m: any) => m.sender + ": " + m.content).join("\n")}

# USER QUESTION
"${msg}"

# USER PROFILE
Target Role: ${desiredRole}
Experience Level: ${experienceLevel}
Resume Sections: ${resumeInsights.availableSections.join(", ")}

# CURRENT RESUME ANALYSIS
- Total sections: ${resumeInsights.totalSections}
- Projects: ${resumeInsights.hasProjects ? `${resumeInsights.projectCount} projects` : "None"}
- Work Experience: ${resumeInsights.hasExperience ? `${resumeInsights.experienceCount} positions` : "None"}
- Skills: ${resumeInsights.hasSkills ? `${resumeInsights.skillCategories} categories` : "None"}
- Missing critical sections: ${resumeInsights.missingCriticalSections.length > 0 ? resumeInsights.missingCriticalSections.join(", ") : "None"}
`;

  const responseInstructions = `
# RESPONSE GUIDELINES
- Always look at the chat history and answer according to context
- If the user's message is a short answer (like 'yes', 'no', 'this one'), use the previous bot message and conversation context
- If the user asks you to choose, recommend, or pick one option, always make a best-effort recommendation
- Only use <ul>, <li>, <b>, <strong>, <br> for formatting
- Keep responses concise and actionable
- Never use markdown formatting
- Reference the user's actual resume content when relevant
`;

  switch (questionType) {
    case "self_capability":
      return `
You are ResumeCraft's AI assistant. Answer questions about your capabilities clearly and accurately.

${baseContext}

# MY CAPABILITIES
I can help you with your resume by:
- <b>Editing sections:</b> Improve wording, tone, and impact of existing content
- <b>Generating content:</b> Create new bullet points, descriptions, and section content
- <b>Reducing length:</b> Shorten and condense content while keeping key achievements
- <b>Providing advice:</b> Answer questions about resume best practices, ATS optimization, and content strategy
- <b>Section analysis:</b> Review specific sections like projects, experience, skills, and education

# WHAT I WORK WITH
- Your actual resume data (${resumeInsights.availableSections.join(", ")} sections)
- Your target role (${desiredRole}) and experience level (${experienceLevel})
- Resume best practices and ATS optimization techniques

# WHAT I CANNOT DO
- Review your entire resume (use our Resume Analysis page for that)
- Access external websites or your LinkedIn profile
- Remember our conversation after this chat ends
- Provide legal or career counseling advice

${responseInstructions}

Answer the user's question about my capabilities directly and concisely.
`;

    case "process_guide":
      return `
You are a resume assistant providing step-by-step guidance.

${baseContext}

# INSTRUCTIONS
- Provide clear, actionable steps for the user's request
- Reference their current resume state and target role
- Focus on practical implementation
- If the question is about using this chatbot, explain the process clearly

${responseInstructions}

Provide a step-by-step guide for the user's question.
`;

    case "comparison":
      return `
You are a resume assistant helping with decision-making.

${baseContext}

${sectionContent ? `# RELEVANT SECTION CONTENT\n${sectionContent}` : ""}

# INSTRUCTIONS
- Always make a clear recommendation when asked to choose
- Explain your reasoning briefly
- Consider the user's target role and experience level
- Reference their actual resume content when making comparisons
- Don't ask for more information unless absolutely necessary

${responseInstructions}

Make a clear recommendation and explain your reasoning briefly.
`;

    case "content_analysis":
      return `
You are a resume assistant analyzing the user's actual resume content.

${baseContext}

${sectionContent ? `# SECTION BEING ANALYZED\n${sectionContent}` : ""}

# ANALYSIS FOCUS
- Evaluate based on ATS optimization and recruiter preferences
- Consider relevance to target role (${desiredRole})
- Look for quantifiable achievements and impact statements
- Assess professional tone and clarity

${responseInstructions}

Provide specific feedback based on the user's actual resume content.
`;

    case "general_advice":
      return `
You are a resume expert providing best practice advice.

${baseContext}

# ADVICE PARAMETERS
- Tailor advice to ${desiredRole} role and ${experienceLevel} level
- Consider current resume state and missing elements
- Focus on modern resume standards and ATS optimization
- Provide actionable recommendations

${responseInstructions}

Provide targeted advice based on resume best practices and the user's specific situation.
`;

    case "formatting_ats":
      return `
You are an ATS and formatting expert for resumes.

${baseContext}

# FORMATTING EXPERTISE
- ATS-friendly structure and keywords
- Professional formatting standards
- Section organization and hierarchy
- Content presentation best practices

${responseInstructions}

Provide specific formatting and ATS optimization advice.
`;

    default:
      return `
You are a world-class resume assistant providing contextual advice.

${baseContext}

${sectionContent ? `# RELEVANT SECTION CONTENT\n${sectionContent}` : ""}

${responseInstructions}

Answer the user's question with context-aware, actionable advice.
`;
  }
}

function generateSectionPrompt(
  sectionType: string,
  userIntent: string,
  msg: string,
  sectionObj: any,
  desiredRole: string,
  experienceLevel: string
) {
  const baseInstructions = `
You are an expert ATS resume writer.

The user wants to ${
    userIntent === "reduce"
      ? "shorten and polish"
      : userIntent === "generate"
        ? "generate new content"
        : "edit or improve"
  } the following ${sectionType} section.

# USER REQUEST
"${msg}"

# ORIGINAL ${sectionType.toUpperCase()} SECTION
${JSON.stringify(sectionObj, null, 2)}

# CORE INSTRUCTIONS
- Keep the same JSON structure and field names.
- Do not use any markdown formatting other than <ul> and <li> for descriptions (e.g., no bold **text**, no italics).
- ONLY update the specific item(s) or field(s) that the user is referring to in their request.
- If the user mentions a specific item by name, title, or position, only modify that item.
- If the user wants to add new content to a specific item, only update that item's description.
- If the user wants to modify a specific field, only change that field.
- Leave all other items and fields completely unchanged.
- Return ONLY the updated section as valid JSON.
`;

  const sectionSpecificInstructions = {
    projects: {
      reduce:
        "- Make the descriptions more concise while keeping key tools, numbers, and business impact.",
      generate: `- For the specific project being updated, generate exactly 3 professional project description bullet points.
- Start each point with a strong action verb (Built, Developed, Implemented, Designed, Created, etc.)
- Include specific metrics and quantifiable achievements compulsorily for each point. (e.g., "reduced load time by 40%", "processed 10,000+ records")
- Mention technical tools, frameworks, or methods used (React, Node.js, MongoDB, AWS, etc.)
- Focus on impact and results, not just responsibilities
- Each point must be at least 1.5 sentences and at most 2 sentences (around 25 words)
- Use industry-standard terminology relevant to ${desiredRole}
- Format as HTML: <ul><li>point1</li><li>point2</li><li>point3</li></ul>`,
      edit: "- Improve tone and flow while preserving meaning and structure. Use strong verbs and add metrics if missing.",
    },
    experience: {
      reduce:
        "- Make the descriptions more concise while preserving tools, numbers, and business outcomes.",
      generate: `- For the specific job entry being updated, generate exactly 3 professional bullet points.
- Start each point with a strong action verb (Led, Managed, Developed, Implemented, Optimized, etc.)
- Include specific metrics and quantifiable achievements (e.g., "increased sales by 25%", "managed team of 8 people", "reduced costs by $50K")
- Mention relevant tools, technologies, or methodologies used in the role
- Focus on accomplishments and business impact, not just job duties
- Each point must be at least 1.5 sentences and at most 2 sentences (around 25 words)
- Use terminology appropriate for ${desiredRole} and ${experienceLevel} level
- Format as HTML: <ul><li>point1</li><li>point2</li><li>point3</li></ul>`,
      edit: "- Improve clarity and flow. Add metrics if helpful. Maintain the current structure.",
    },
    skills: {
      reduce:
        "- Make the skills more concise while keeping key technologies and categories.",
      generate: `- Generate a comprehensive skills section with 4-6 categories.
- Organize skills by category with <strong> tags for category names
- Include specific technologies, frameworks, tools, and methodologies
- Categories should be relevant to ${desiredRole} (e.g., Programming Languages, Frameworks, Databases, Tools, etc.)
- Include skills appropriate for ${experienceLevel} level experience
- Each category should have 4-8 relevant skills
- Format as HTML: <ul><li><strong>Category:</strong> skill1, skill2, skill3</li><li><strong>Category:</strong> skill1, skill2, skill3</li></ul>
- Focus on industry-standard and in-demand technologies`,
      edit: "- Improve organization and clarity. Add relevant skills if missing.",
    },
    custom: {
      reduce:
        "- Make the descriptions more concise while keeping key achievements and impact.",
      generate: `- For the specific section being updated, generate exactly 3 professional bullet points.
- Start each point with a strong action verb (Achieved, Earned, Completed, Contributed, etc.)
- Include specific metrics, outcomes, or recognition (e.g., "scored 95th percentile", "recognized as top performer")
- Mention relevant skills, tools, or methodologies demonstrated
- Focus on achievements, certifications, awards, or notable accomplishments
- Each point must be at least 1.5 sentences and at most 2 sentences
- Use terminology appropriate for ${desiredRole} and ${experienceLevel} level
- Format as HTML: <ul><li>point1</li><li>point2</li><li>point3</li></ul>
- Each bullet point must be max 1.5 sentences long.`,
      edit: "- Improve clarity and flow. Add metrics if helpful. Maintain the current structure.",
    },
    education: {
      reduce:
        "- Make the descriptions more concise while keeping key achievements and relevant coursework.",
      generate: `- For the specific education entry being updated, generate exactly 3 professional bullet points.
- Start each point with a strong action verb (Completed, Studied, Specialized, Achieved, etc.)
- Include specific achievements (GPA, honors, awards, relevant projects)
- Mention relevant coursework, specializations, or research areas related to ${desiredRole}
- Focus on academic accomplishments and skills gained
- Each point must be at least 1.5 sentences and at most 2 sentences
- Use terminology appropriate for ${desiredRole} and ${experienceLevel} level
- Format as HTML: <ul><li>point1</li><li>point2</li><li>point3</li></ul>
- Each bullet point must be max 1.5 sentences long.`,
      edit: "- Improve clarity and flow. Add metrics if helpful. Maintain the current structure.",
    },
  };

  const specificInstructions =
    sectionSpecificInstructions[
      sectionType as keyof typeof sectionSpecificInstructions
    ];
  if (!specificInstructions) {
    return `${baseInstructions}
- Update ONLY the specific field(s) or item(s) that the user is referring to in their request.
- If adding/modifying, fill all required fields (use "N/A" or 'undefined' if unsure, never null).`;
  }

  const intentInstruction =
    specificInstructions[userIntent as keyof typeof specificInstructions];
  return `${baseInstructions}
${intentInstruction}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message,
      resume,
      desiredRole,
      experienceLevel,
      intent,
      section,
      history = [],
    } = body;

    const msg = message?.content?.message?.trim();
    if (!msg || !resume || !desiredRole || !experienceLevel) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: message, resume, desiredRole, or experienceLevel",
        },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite-preview-06-17",
    });

    let detectedSection = section;
    let userIntent = intent;
    if (!userIntent || !detectedSection) {
      // Use Gemini to detect both intent and section with context
      const detection = await detectUserIntentAndSection(model, msg, history);
      userIntent = userIntent || detection.intent;
      detectedSection = detectedSection || detection.section;
      if (!detectedSection) {
        const lowerMsg = msg.toLowerCase();
        console.log("infered");
        if (lowerMsg.includes("project")) detectedSection = "projects";
        else if (lowerMsg.includes("experience"))
          detectedSection = "experience";
        else if (lowerMsg.includes("skill")) detectedSection = "skills";
        else if (lowerMsg.includes("education")) detectedSection = "education";
        else if (lowerMsg.includes("summary")) detectedSection = "summary";
        else if (lowerMsg.includes("header")) detectedSection = "header";
      }
    }
    // Map summary, name, email, phone, social to header section
    const headerAliases = ["summary", "name", "email", "phone", "social"];
    if (headerAliases.includes(detectedSection)) {
      detectedSection = "header";
    }
    console.log("User intent:", userIntent);
    console.log("Detected section:", detectedSection);

    // If intent is resume_review, return analysis page link
    if (userIntent === "resume_review") {
      return NextResponse.json(
        {
          advice: `For a comprehensive review, score, or analysis of your entire resume, please use our dedicated <a href=\"https://resume-craft-virid.vercel.app/resume-analysis\" target=\"_blank\"><b>Resume Analysis</b></a> page. This chatbot is best for section-specific advice and edits.`,
        },
        { status: 200 }
      );
    }

    // Only require section for section-specific intents
    const sectionSpecificIntents = ["edit", "generate", "reduce"];
    let sectionObj = null;
    if (sectionSpecificIntents.includes(userIntent)) {
      sectionObj = resume.sections.find(
        (item: any) => item.type === detectedSection
      );
      if (!sectionObj) {
        return NextResponse.json(
          { error: `Section '${detectedSection}' not found in resume.` },
          { status: 400 }
        );
      }
    }

    if (
      userIntent === "advice" ||
      userIntent === "compare" ||
      userIntent === "ask"
    ) {
      const resumeInsights = extractResumeInsights(resume);

      const questionType = classifyQuestionType(msg, history);

      const relevantSection = detectedSection
        ? resume.sections.find((s: any) => s.type === detectedSection)
        : null;
      const sectionContent = relevantSection
        ? JSON.stringify(relevantSection, null, 2)
        : null;

      const advicePrompt = generateAdvicePrompt(
        questionType,
        msg,
        history,
        resumeInsights,
        desiredRole,
        experienceLevel,
        sectionContent
      );

      const response = await model.generateContent(advicePrompt);
      let advice = response.response.text().trim();
      advice = advice.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>"); // bold
      if (/^\d+\. /m.test(advice)) {
        advice =
          "<ul>" + advice.replace(/^(\d+)\. (.*)$/gm, "<li>$2</li>") + "</ul>";
      }
      if (/^- /m.test(advice)) {
        advice = "<ul>" + advice.replace(/^- (.*)$/gm, "<li>$1</li>") + "</ul>";
      }
      advice = advice.replace(/\n/g, "<br>");
      return NextResponse.json({ advice }, { status: 200 });
    }

    // === GENERAL SECTION Q&A (not direct edit/generate/reduce, but about a section) ===
    if (
      [
        "projects",
        "experience",
        "skills",
        "education",
        "custom",
        "summary",
        "header",
      ].includes(detectedSection) &&
      ["edit", "generate", "reduce"].indexOf(userIntent) === -1
    ) {
      // Get the section content
      const sectionContent = sectionObj
        ? JSON.stringify(sectionObj, null, 2)
        : "";
      // Optionally, provide the whole resume if needed
      const resumeContent = JSON.stringify(resume, null, 2);
      const sectionQAPrompt = `
You are a world-class resume assistant. The user has a question about their '${detectedSection}' section.

- Always look at the chat history and answer according to context. If the user's message is a short answer (like 'yes', 'no', 'this one'), use the previous bot message and the conversation context to resolve what the user means. Do not repeat clarifying questions—proceed with the comparison or requested action.
- If the user asks you to choose, recommend, or pick one option, always make a best-effort recommendation based on the available information, even if you have to make reasonable assumptions. Only ask for clarification if absolutely necessary. Do not say 'undecided' or repeat clarifying questions if the user has already asked for a direct answer.

# USER QUESTION
"${msg}"

# SECTION NAME
${detectedSection}

# SECTION CONTENT
${sectionContent}

# USER PROFILE
Target Role: ${desiredRole}
Experience Level: ${experienceLevel}

# FULL RESUME (if needed for context)
${resumeContent}

# RESPONSE INSTRUCTIONS
- Answer the user's question about the section, referencing the section content and user context.
- If the question is ambiguous, ask a clarifying question.
- Respond in clean HTML only (<ul>, <li>, <b>, <strong>, <br>), concise and actionable.
- No markdown, no long paragraphs, no generic advice.
`;
      const response = await model.generateContent(sectionQAPrompt);
      const sectionAnswer = response.response.text().trim();
      return NextResponse.json({ advice: sectionAnswer }, { status: 200 });
    }

    // === SECTION UPDATE PROCESSING ===
    if (sectionSpecificIntents.includes(userIntent)) {
      const sectionPrompt = generateSectionPrompt(
        detectedSection,
        userIntent,
        msg,
        sectionObj,
        desiredRole,
        experienceLevel
      );

      const response = await model.generateContent(sectionPrompt);
      const text = response.response.text().trim();
      const parsed = tryParseJSON(text);
      console.log(parsed);
      if (!parsed) {
        return NextResponse.json(
          { error: `Failed to parse updated ${detectedSection} section.` },
          { status: 500 }
        );
      }

      const updatedSections = resume.sections.map((item: any) =>
        item.type === detectedSection ? parsed : item
      );

      const updatedResume = { ...resume, sections: updatedSections };

      // Generate a dynamic confirmation message using the model
      const confirmationPrompt = `
You are a helpful resume assistant. The user just made a change to their '${detectedSection}' section with the following request:
"${msg}"

Write a short, positive confirmation message (max 2 sentences, similar in length to: 'Perfect! I've updated your resume based on your request. The changes have been applied successfully!').
Do not use markdown. Respond in plain text only.`;
      const confirmationResponse =
        await model.generateContent(confirmationPrompt);
      let confirmationMsg = confirmationResponse.response.text().trim();
      // Remove markdown if any
      confirmationMsg = confirmationMsg.replace(/\*\*(.*?)\*\*/g, "$1");
      confirmationMsg = confirmationMsg.replace(/\*/g, "");
      confirmationMsg = confirmationMsg.replace(/`/g, "");
      confirmationMsg = confirmationMsg.replace(/_/g, "");
      return NextResponse.json(
        { updatedResume, confirmationMsg },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 }
    );
  }
}
