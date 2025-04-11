import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    // Change to a simpler schema that just returns HTML content
    const parser = z.object({
      skillsHtml: z
        .string()
        .describe(
          "Complete HTML for skills section formatted with ul/li elements and bold category names"
        ),
    });

    const { desiredRole, roughSkills, experienceLevel } = await req.json();

    if (!desiredRole) {
      return NextResponse.json(
        { error: "Desired role is required" },
        { status: 400 }
      );
    }

    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY!,
      modelName: "gemini-1.5-flash",
    });

    const modelWithStructure = model.withStructuredOutput(parser);

    const promptTemplate = PromptTemplate.fromTemplate(`
      You are an expert resume skills writer. Generate a comprehensive skills section for a resume based on the desired role provided.

      The output should be a single HTML string with skills organized in a list format.
      
      Format the output exactly like this example (this is HTML, not Markdown):
      <ul>
        <li><strong>Frontend :</strong> HTML5, CSS3, JavaScript (ES6+), TypeScript, React.js, Next.js, Redux, Tailwind CSS, Bootstrap, Responsive Design, Flexbox, CSS Grid, Webpack, Babel.</li>
        <li><strong>Backend :</strong> Node.js, Express.js, REST APIs, GraphQL, Authentication (JWT, OAuth), MongoDB, Mongoose, PostgreSQL, WebSockets (Socket.io), Real-Time Data.</li>
        <li><strong>DevOps:</strong> Docker, Kubernetes, AWS (S3, EC2, Lambda), DigitalOcean, CI/CD Pipelines (GitHub Actions, Jenkins), Nginx, Apache, PM2.</li>
        <li><strong>Version Control & Tools:</strong> Git, GitHub, GitLab, Postman, Insomnia, Swagger, VS Code, WebStorm. Testing: Jest, Mocha, Chai, Cypress, Selenium.</li>
        <li><strong>Additional Skills:</strong> Performance Optimization, Agile Project Management.</li>
      </ul>
      
      Include 3-6 relevant categories with detailed skills appropriate for the role.
      
      Desired Role: {desiredRole}
      Experience Level: {experienceLevel}
      Rough Skills (include these when relevant): {roughSkills}

      Your output should be the complete HTML with opening <ul> and closing </ul> tags, containing list items with category names in <strong> tags.
      Each category should include specific technologies, frameworks, and methodologies relevant to the role.
    `);

    const prompt = await promptTemplate.format({
      desiredRole: desiredRole,
      experienceLevel: experienceLevel || "Mid-level",
      roughSkills: roughSkills || "",
    });

    const response = await modelWithStructure.invoke(prompt);
    console.log("Structured response:", response);

    // Return the direct HTML content
    return NextResponse.json({
      skillsContent: response.skillsHtml,
    });
  } catch (error) {
    console.error("Error generating skills:", error);

    let errorMessage = "Failed to generate skills";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
