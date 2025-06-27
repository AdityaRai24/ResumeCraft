import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, resume } = body;

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const msg = message?.content?.message?.trim();
    if (!msg || !resume) {
      throw new Error("Missing required fields in request body");
    }

    const resumeSections = resume.sections.map((item: any) => item.type);
    // Section detection prompt
    const sectionDetectionPrompt = `
      You are an assistant for a resume editing tool.\n\nAvailable sections: ${JSON.stringify(resumeSections)}\nUser request: "${msg}"\n\nWhich single section should be updated? Return ONLY the most relevant section name as a plain string, e.g. "projects". Do not explain, do not return an array.\nHeader contains personal details, rest is understood from the name itself.`;

    const sectionDetectionResponse = await model.generateContent(sectionDetectionPrompt);
    const sectionDetectionText = sectionDetectionResponse.response.text().trim();
    let detectedSection = "";
    try {
      detectedSection = sectionDetectionText.replace(/^"|"$/g, '');
    } catch (e) {
      console.error("Failed to parse detected section from LLM:", sectionDetectionText, e);
    }

    console.log("Detected section:", detectedSection);

    // Find the section object in resume.sections
    const sectionObj = resume.sections.find((item: any) => item.type === detectedSection);
    if (!sectionObj) {
      return NextResponse.json({ error: `Section '${detectedSection}' not found in resume.` }, { status: 400 });
    }

    // Prompt Gemini to update the section
    const sectionEditPrompt = `
      You are a resume editing assistant.\n\n# USER REQUEST\n"${msg}"\n\n# SECTION DATA TO UPDATE\n${JSON.stringify(sectionObj, null, 2)}\n\n# INSTRUCTIONS\n- Update ONLY the provided section data according to the user request.\n- Do NOT change the schema, structure, or field names.\n- If adding, modifying, or removing items, do so within the provided structure.\n- If you are adding something new, fill ALL fields that are present in the schema. If you have nothing to fill, use a reasonable dummy value (e.g., 'Dummy Project', 'N/A', '0000-00-00', etc.). If not even a dummy value is possible, use undefined, but NEVER use null.\n- If you are editing, only edit those parts required by the user request; keep all other fields and values unchanged.\n- The schema must ALWAYS remain unchanged.\n- Return ONLY the updated section data as valid JSON, matching the original format exactly.\n- Do NOT include any explanations, markdown, or extra text.\n- If the request is unclear, make a reasonable professional update.`;

    const sectionEditResponse = await model.generateContent(sectionEditPrompt);
    const sectionEditText = sectionEditResponse.response.text().trim();
    let updatedSectionObj = null;
    try {
      const jsonObjectMatch = sectionEditText.match(/\{[\s\S]*\}/);
      if (jsonObjectMatch) {
        updatedSectionObj = JSON.parse(jsonObjectMatch[0]);
      } else {
        updatedSectionObj = JSON.parse(sectionEditText);
      }
    } catch (e) {
      console.error("Failed to parse updated section data from Gemini:", sectionEditText, e);
      return NextResponse.json({ error: "Failed to parse updated section data from Gemini." }, { status: 500 });
    }

    // Update the resume.sections array
    const updatedSections = resume.sections.map((item: any) =>
      item.type === detectedSection ? updatedSectionObj : item
    );
    const updatedResume = { ...resume, sections: updatedSections };

    return NextResponse.json({ updatedResume }, { status: 200 });
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
