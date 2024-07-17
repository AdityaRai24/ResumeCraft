import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function parseStringToArray(str: string) {
  // Remove leading and trailing brackets
  str = str.trim().slice(1, -1);

  // Split the string by comma and newline
  let items = str.split(/,\s*\n/);

  // Clean each item and remove surrounding quotes
  items = items.map((item) => item.trim().replace(/^"|"$/g, ""));

  return items;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { projectTitle, projectDescription } = await req.json();

    let prompt = "";

    if (projectTitle && !projectDescription) {
      prompt = `The title of the project is ${projectTitle}...Write project description in 3 points ..each point 
      must not exceed 1.5-2lines and should be
       atleast 0.5 lines...Use metrics in the job description...

      make sure the response should be in the form of array of points so that i can use JSON.parse() on that response..Dont add any text before or after it...
      write description as you are supposed to write it in a resume describing the project and not explaining it to someone

      dont put a \n after [ and before ]

       Example points : Built an Advanced Resume Builder using Next.js, Tailwind CSS, Shadcn UI, and TypeScript, allowing
users to create high ATS (Applicant Tracking System) resumes from scratch with ease, increasing
resume quality by 40%.,Integrated Convex DB for efficient database management, ensuring a 50% improvement in data
retrieval speeds and a smooth user experience with real-time updates.,Implemented customizable templates and real-time preview, enabling users to see changes
instantly and choose from various professional designs, boosting user engagement by 35%. `;
    } else if (projectTitle && projectDescription) {
      prompt = `The title of the project is ${projectTitle} and its description is ${projectDescription}...Improve this project description and write it in 3 points ..each point 
        must not exceed 1.5-2lines and should be
         atleast 0.5 lines...Use metrics in the job description this is very very important...if the description contains tech stack make sure to use it while you improve
      write description as you are supposed to write it in a resume describing the project and not explaining it to someone

        make sure the response should be in the form of array of points so that i can use JSON.parse() on that response..Dont add any text before or after it...
  
        dont put a \n after [ and before ]
  
         Example points : Built an Advanced Resume Builder using Next.js, Tailwind CSS, Shadcn UI, and TypeScript, allowing
  users to create high ATS (Applicant Tracking System) resumes from scratch with ease, increasing
  resume quality by 40%.,Integrated Convex DB for efficient database management, ensuring a 50% improvement in data
  retrieval speeds and a smooth user experience with real-time updates.,Implemented customizable templates and real-time preview, enabling users to see changes
  instantly and choose from various professional designs, boosting user engagement by 35%. `;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    const textArray = parseStringToArray(text);

    return NextResponse.json({ textArray }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
