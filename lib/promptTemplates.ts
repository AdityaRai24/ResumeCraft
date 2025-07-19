export interface GeneralDescriptionPromptParams {
  sectionType: string;
  userIntent: string;
  userMessage: string;
  sectionObj: any;
  desiredRole: string;
  experienceLevel: string;
}

export function buildGeneralDescriptionPrompt({
  sectionType,
  userIntent,
  userMessage,
  sectionObj,
  desiredRole,
  experienceLevel,
}: GeneralDescriptionPromptParams) {
  return `
You are an expert ATS resume writer.

The user wants to ${
    userIntent === "reduce"
      ? "shorten and polish"
      : userIntent === "generate"
        ? "generate new content"
        : "edit or improve"
  } the following ${sectionType} section.

# USER REQUEST
"${userMessage}"

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
- For each answer, write exactly three sentences, each similar in length and style to the following examples. Remember this is just an example this is not the answer:
  - "Developed a full-stack e-commerce platform utilizing Next.js, React, Node.js, and MongoDB, leading to a 30% increase in conversion rates through an enhanced user experience."
  - "Improved server-side rendering (SSR) with Next.js and optimized image delivery through CDN, reducing initial page load time by 40% and boosting SEO rankings significantly."
  - "Created a RESTful API utilizing Node.js and Express to facilitate seamless data communication between the front-end and back-end, managing over 10,000 daily transactions efficiently."
- Each sentence should be concise, impactful, and approximately 20–30 words.
- Do not exceed three sentences per answer unless user explicitly requests for it.
- Focus on quantifiable achievements, technologies used, and the impact of the work.
`;
}
