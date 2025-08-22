import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 }
      );
    }

    const { resume, section, taggedText, description, index } =
      await req.json();
    if (!resume || !section || !taggedText || !description) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const reqdSection = resume.sections.find(
      (item: any) => item.type === section
    );
    let updatedResume = { ...resume };

    console.log(reqdSection, index);

    if (!Array.isArray(updatedResume.sections)) {
      return NextResponse.json(
        { error: "Resume sections are not in array format." },
        { status: 400 }
      );
    }

    if (typeof index === "number" && reqdSection) {
      let arrayField = null;
      let descField = null;
      if (Array.isArray(reqdSection.content?.projects)) {
        arrayField = "projects";
        descField = "description";
      } else if (Array.isArray(reqdSection.content?.experience)) {
        arrayField = "experience";
        descField = "jobDescription";
      }
      if (arrayField && descField && reqdSection.content[arrayField][index]) {
        const item = reqdSection.content[arrayField][index];
        const originalDesc = item[descField];
        const prompt = `
        
        You are an expert resume writer.
         Here is a description from a resume section:\n"""\n${originalDesc}\n"""\n\n
         Rewrite ONLY this text according to the following instruction:\n"""\n${description}\n"""\n\n
         # GUIDELINES\n- If the original description uses HTML structure (like <ul>, <li>, <strong>, etc.), you MUST strictly follow the same HTML structure in your improved description. 
         Do NOT break, remove, or change the HTML tags or their order.\n-
          If the original text does not use any markdown or HTML, do not add any markdown or HTML.\n- 
          If the original text uses a markdown pattern (like **bold**, *italics*, etc.), keep the same pattern in your improved text.\n- 
          Otherwise, reply as is.\n- Do not change the structure or any other fields.\n- 
          Only update the description as requested.\n-
           Keep all other fields, points and content unchanged.\n- 
           Return only the improved description, nothing else.`;
        let rewrittenText;
        try {
          const result = await model.generateContent(prompt);
          const response = await result.response;
          rewrittenText = response.text().trim();
          // Remove code block markers and trim whitespace
          rewrittenText = rewrittenText
            .replace(/^```[a-zA-Z]*\n?|```$/g, "")
            .trim();
        } catch (aiError) {
          console.log(aiError);
          return NextResponse.json(
            { error: "Failed to generate content. Please try again." },
            { status: 503 }
          );
        }
        // Replace only the description at the given index
        updatedResume.sections = updatedResume.sections.map((sec: any) => {
          if (sec.type !== section) return sec;
          const newSec = { ...sec };
          const arr = [...newSec.content[arrayField]];
          arr[index] = { ...arr[index], [descField]: rewrittenText };
          newSec.content = { ...newSec.content, [arrayField]: arr };
          return newSec;
        });
        return NextResponse.json(
          {
            updatedResume,
            confirmationMsg: "The tagged text has been updated as requested!",
          },
          { status: 200 }
        );
      }
    }

    const prompt = `You are an expert resume writer. Here is the full section from a resume (as JSON):\n"""\n${JSON.stringify(reqdSection, null, 2)}\n"""\n\nThe following text is present in this section:\n"""\n${taggedText}\n"""\n\nRewrite ONLY this text according to the following instruction:\n"""\n${description}\n"""\n\n# GUIDELINES\n\
- You MUST look at the field in the section where the tagged text appears.\n\
- If that field uses HTML (like <ul>, <li>, <strong>, etc.) or markdown (like **bold**, *italics*), your improved text MUST use the same structure and formatting.\n\
- Do NOT break, remove, or change the HTML or markdown tags or their order.\n\
- If the field does not use any markdown or HTML, do not add any.\n\
- Only update the tagged text as requested.\n\
- Keep all other fields and content unchanged.\n\
- Return ONLY the updated description string (the value of the description field inside content), nothing else.\n\
- Do NOT return an object or the whole section.`;
    let rewrittenText;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      rewrittenText = response.text().trim();
      // Remove code block markers and trim whitespace
      rewrittenText = rewrittenText
        .replace(/^```[a-zA-Z]*\n?|```$/g, "")
        .trim();
    } catch (aiError) {
      console.log(aiError);
      return NextResponse.json(
        { error: "Failed to generate content. Please try again." },
        { status: 503 }
      );
    }
    if (section === "header") {
      updatedResume.sections = updatedResume.sections.map((sec: any) => {
        if (sec.type !== section) return sec;
        const newSec = { ...sec };
        newSec.content.summary = rewrittenText;
        return newSec;
      });
    }
    if (section === "skills") {
      updatedResume.sections = updatedResume.sections.map((sec: any) => {
        if (sec.type !== section) return sec;
        const newSec = { ...sec };
        newSec.content.description = rewrittenText;
        return newSec;
      });
    }

    console.log(rewrittenText);
    return NextResponse.json(
      {
        updatedResume,
        confirmationMsg: "The tagged text has been updated as requested!",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected server error occurred. Please try again." },
      { status: 500 }
    );
  }
}
