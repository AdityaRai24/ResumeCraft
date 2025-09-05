import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    // Validate API key
    if (!process.env.GOOGLE_API_KEY) {
      console.error("Missing GOOGLE_API_KEY environment variable");
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 }
      );
    }

    const { desiredRole, experienceLevel, roughSkills } = await req.json();

    // Validate required fields
    if (!desiredRole) {
      return NextResponse.json(
        { error: "Desired role is required." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Prompt
    const prompt = `You are an expert ATS resume writer. Generate a comprehensive skills section for a resume based on the desired role provided.

The output should be a single HTML string with skills organized in a list format.

Format the output exactly like this example (this is HTML, not Markdown):
<ul>
  <li><strong>Frontend :</strong> HTML5, CSS3, JavaScript (ES6+), TypeScript, React.js, Next.js, Redux, Tailwind CSS, Bootstrap, Responsive Design, Flexbox, CSS Grid, Webpack, Babel.</li>
  <li><strong>Backend :</strong> Node.js, Express.js, REST APIs, GraphQL, Authentication (JWT, OAuth), MongoDB, Mongoose, PostgreSQL, WebSockets (Socket.io), Real-Time Data.</li>
  <li><strong>DevOps:</strong> Docker, Kubernetes, AWS (S3, EC2, Lambda), DigitalOcean, CI/CD Pipelines (GitHub Actions, Jenkins), Nginx, Apache, PM2.</li>
  <li><strong>Version Control & Tools:</strong> Git, GitHub, GitLab, Postman, Insomnia, Swagger, VS Code, WebStorm. Testing: Jest, Mocha, Chai, Cypress, Selenium.</li>
  <li><strong>Additional Skills:</strong> Performance Optimization, Agile Project Management.</li>
</ul>

Include 3-4 relevant categories with detailed skills appropriate for the role.

Desired Role: ${desiredRole}
Experience Level: ${experienceLevel || "Mid-level"}
Rough Skills (include these when relevant): ${roughSkills || ""}

Your output should be the complete HTML with opening <ul> and closing </ul> tags, containing list items with category names in <strong> tags.
Each category should include specific technologies, frameworks, and methodologies relevant to the role.

Return ONLY the HTML <ul> block, nothing else.`;

    // Generate AI response
    let generatedText;
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      generatedText = response.text().trim();
    } catch (aiError) {
      console.error("Google AI API error:", aiError);
      return NextResponse.json(
        { error: "Failed to generate content. Please try again." },
        { status: 503 }
      );
    }

    // Extract HTML
    const ulStart = generatedText.indexOf("<ul>");
    const ulEnd = generatedText.lastIndexOf("</ul>");

    if (ulStart === -1 || ulEnd === -1) {
      console.error("Invalid AI response format:", generatedText);
      return NextResponse.json(
        { error: "Generated content format is invalid. Please try again." },
        { status: 502 }
      );
    }

    const htmlContent = generatedText.substring(ulStart, ulEnd + 5);

    // Validate number of bullet points
    const liCount = (htmlContent.match(/<li>/g) || []).length;
    if (liCount < 3 || liCount > 6) {
      console.error("Incorrect number of skill categories generated:", liCount);
      return NextResponse.json(
        {
          error:
            "Generated content doesn't meet requirements. Please try again.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        skillsContent: htmlContent,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in generateSkills route:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred. Please try again." },
      { status: 500 }
    );
  }
}
