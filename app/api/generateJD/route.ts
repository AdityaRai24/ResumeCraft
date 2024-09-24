import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

function parseStringToArray(str: string) {
  str = str.trim().slice(1, -1);
  let items = str.split(/,\s*\n/);
  items = items.map((item) => item.trim().replace(/^"|"$/g, ""));

  return items;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { companyName, role,jobDescription } = await req.json();

    let prompt = "";

    if (companyName && role && !jobDescription) {
      prompt = `for a ${role} who has worked at ${companyName} write a job description in 3 points..each point 
      must not exceed 1.5-2lines and should be
       atleast 0.5 lines...Use metrics in the job description...

      make sure the response should be in the form of array of points so that i can use JSON.parse() on that response..Dont add any text before or after it...

      dont put a \n after [ and before ]

       Example points : Designed and developed web applications used by the DJSI committee, ensuring a 99.5% uptime to support critical sustainability ratings.,Optimized code and implemented efficient database management strategies, resulting in a 25% reduction in application load times.,Successfully integrated third-party data feeds, improving the accuracy and comprehensiveness of DJSI data by 15% `;
    } else {
      prompt = `for a ${role} who has worked at ${companyName} this is the job descriptoin ${jobDescription}..write 3 bullet points..each point 
      must not exceed 1.5-2lines and should be
       atleast 0.5 lines...Use metrics in the job description to make it more ats friendly...

      make sure the response should be in the form of array of points so that i can use JSON.parse() on that response..Dont add any text before or after it...

      dont put a \n after [ and before ]

       Example points : Designed and developed web applications used by the DJSI committee, ensuring a 99.5% uptime to support critical sustainability ratings.,Optimized code and implemented efficient database management strategies, resulting in a 25% reduction in application load times.,Successfully integrated third-party data feeds, improving the accuracy and comprehensiveness of DJSI data by 15% `;
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
