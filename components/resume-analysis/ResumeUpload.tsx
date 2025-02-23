import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Upload,
} from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import Tesseract from "tesseract.js";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import base64 from "base64-encode-file";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";

interface JobRequirement {
  id: number;
  title: string;
  company: string;
  description: string;
  requirements: string[];
}

interface JobCardProps {
  job: JobRequirement;
  isSelected: boolean;
  onSelect: (job: JobRequirement) => void;
}

interface Analysis {
  [key: string]: any;
}

const jobDescriptions: JobRequirement[] = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Solutions Ltd.",
    description:
      "We are looking for a passionate Frontend Developer with a strong understanding of modern frontend technologies. The ideal candidate should be proficient in JavaScript, React.js, and Next.js, with experience in building dynamic and high-performance web applications. Familiarity with CSS frameworks like Tailwind CSS or Bootstrap is essential, along with a solid grasp of state management tools such as Redux or Zustand. Responsibilities include developing and maintaining scalable UI components, optimizing frontend performance, debugging issues, and ensuring cross-browser compatibility. Exposure to server-side rendering (SSR), static site generation (SSG), and client-side rendering (CSR) is beneficial. Collaboration with designers, backend developers, and participation in code reviews, technical discussions, and UI/UX brainstorming sessions is expected.",
    requirements: [
      "Strong proficiency in JavaScript, React.js, and Next.js",
      "Experience with Tailwind CSS or Bootstrap for responsive UI design",
      "Knowledge of state management tools (Redux, Zustand, or Context API)",
      "Familiarity with SSR, SSG, and CSR techniques",
      "Understanding of API integration and RESTful services",
      "Ability to debug, test, and optimize frontend performance",
      "Experience with version control systems like Git",
      "Strong problem-solving skills and attention to detail",
    ],
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "CloudTech Innovations",
    description:
      "We are seeking a highly skilled Backend Developer who specializes in building scalable and secure backend systems. The candidate should have experience with Node.js and Express.js and be comfortable working with databases such as MongoDB, PostgreSQL, or MySQL. The role involves designing and developing RESTful APIs, optimizing database queries, implementing authentication mechanisms like JWT and OAuth, and ensuring system security and performance. Familiarity with cloud services like AWS or GCP is a plus. The ideal candidate should also have experience with microservices architecture, caching strategies, and message queues for efficient backend operations. Collaboration with frontend teams and DevOps engineers to deploy and maintain applications is expected.",
    requirements: [
      "Proficiency in Node.js and Express.js",
      "Experience with databases like MongoDB, PostgreSQL, or MySQL",
      "Knowledge of ORM tools (Prisma, Drizzle, Sequelize, or Mongoose)",
      "Understanding of authentication (JWT, OAuth) and security best practices",
      "Familiarity with RESTful API design and GraphQL",
      "Experience with cloud platforms (AWS, GCP) and containerization (Docker)",
      "Knowledge of caching strategies (Redis, Memcached) and message queues (RabbitMQ, Kafka)",
      "Ability to write efficient, scalable, and maintainable backend code",
    ],
  },
  {
    id: 3,
    title: "Web Developer",
    company: "NextGen Web Solutions",
    description:
      "We are looking for a versatile Web Developer who is proficient in both frontend and backend development. The candidate should have experience working with HTML, CSS, JavaScript, and modern frameworks like React.js or Vue.js. Strong backend knowledge, including Node.js and Express.js, is preferred. Responsibilities include developing and maintaining interactive web applications, optimizing website performance, ensuring responsiveness across devices, and integrating third-party APIs. The ideal candidate should be comfortable with database management and have a good understanding of web security principles. Strong collaboration skills are essential, as the role requires working closely with designers, product managers, and backend developers to deliver seamless user experiences.",
    requirements: [
      "Proficiency in HTML, CSS, and JavaScript",
      "Experience with frontend frameworks like React.js or Vue.js",
      "Basic to intermediate knowledge of backend technologies (Node.js, Express.js)",
      "Familiarity with databases such as MongoDB, MySQL, or PostgreSQL",
      "Ability to integrate APIs and third-party services",
      "Understanding of web performance optimization and SEO best practices",
      "Experience with Git for version control and CI/CD pipelines",
      "Strong analytical and problem-solving skills",
    ],
  },
];

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.js";

const ResumeUpload: React.FC = ({
  setPdfUrl,
  setAnalysis,
}: any) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<JobRequirement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [extractedText, setExtractedText] = useState<string>("");
  const router = useRouter();

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") {
      await handleFile(file);
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const readFile = async (file: File): Promise<Uint8Array> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("loadend", (event) =>
        resolve(
          new Uint8Array((event.target as FileReader).result as ArrayBuffer)
        )
      );
      reader.readAsArrayBuffer(file);
    });
  };

  const getStructured = async (text: string): Promise<void> => {
    if (!text) {
      toast.error("Upload a valid report.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:3000/api/extract-resume-data`,
        { extractedText: text, jobDescription: selectedJob }
      );
      console.log(response.data)
      setAnalysis(response.data.analysis);
    } catch (error) {
      router.push("/check-ats-2");
      toast.error("Error analyzing resume. Please Try again.");
    } finally {
      setLoading(false);
    }
  };

  const convertToImage = async (
    pdf: pdfjsLib.PDFDocumentProxy
  ): Promise<string[]> => {
    const images: string[] = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: canvas.getContext("2d")!,
        viewport: viewport,
      }).promise;

      images.push(canvas.toDataURL("image/png"));
    }
    return images;
  };

  const convertToText = async (images: string[]): Promise<string> => {
    const worker = await Tesseract.createWorker();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    let fullText = "";

    for (const image of images) {
      const {
        data: { text },
      } = await worker.recognize(image);
      fullText += text + "\n\n";
    }

    await worker.terminate();
    return fullText;
  };

  const uploadImage = async (file: File): Promise<void> => {
    let fileData = await base64(file);
    const formData = new FormData();
    formData.append("file", fileData);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
    );
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    setPdfUrl(data.url);
    console.log(data.url);
  };

  const handleFile = async (file: File): Promise<void> => {
    if (!file) return;

    setIsLoading(true);
    setError("");
    setExtractedText("");
    setAnalysis(null);

    try {
      const fileData = await readFile(file);
      const pdf = await pdfjsLib.getDocument({ data: fileData }).promise;
      const images = await convertToImage(pdf);
      const text = await convertToText(images);

      setExtractedText(text);
      await uploadImage(file);
      await getStructured(text);
    } catch (error) {
      console.error(error);
      setError(
        `Error processing PDF: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl bg-transparent mx-auto border-none shadow-none">
      <CardHeader>
        <CardTitle className="mt-12 mb-4">
          <h1 className="text-4xl text-center md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
            Resume Analysis
          </h1>
          <p className="text-gray-600 text-lg text-center font-normal mt-4">
            Select a job description and upload your resume for targeted
            analysis
          </p>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobDescriptions.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSelected={selectedJob?.id === job.id}
              onSelect={() => setSelectedJob(job)}
            />
          ))}
        </div>

        {selectedJob && (
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center
              transition-all duration-200
              ${isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-primary/60"}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {isLoading || loading ? (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <span className="text-lg">Analyzing your resume...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <Upload
                  className={`w-12 h-12 ${isDragging ? "text-primary" : "text-gray-400"} transition-colors duration-200`}
                />
                <div className="text-lg">
                  Drag and drop your resume PDF here, or
                  <label className="ml-1 text-primary cursor-pointer hover:text-primary/80">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                      }}
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500">Supports PDF files only</p>
              </div>
            )}
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

const JobCard: React.FC<JobCardProps> = ({ job, isSelected, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-lg ${
        isSelected ? "border-primary ring-2 ring-primary" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
            <CardDescription className="text-sm mt-1">
              {job.company}
            </CardDescription>
          </div>
          {isSelected && (
            <CheckCircle2 className="text-primary h-5 w-5 flex-shrink-0 ml-2" />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p
            className={`text-sm text-gray-600 ${!isExpanded && "line-clamp-3"}`}
          >
            {job.description}
          </p>

          <div className={`space-y-2 ${!isExpanded && "hidden"}`}>
            <h4 className="text-sm font-medium">Key Requirements:</h4>
            <div className="grid grid-cols-2 gap-2">
              {job.requirements.map((req, index) => (
                <span
                  key={index}
                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full truncate"
                  title={req}
                >
                  {req}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center gap-3 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="text-xs cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 mr-1" />
              ) : (
                <ChevronDown className="h-4 w-4 mr-1" />
              )}
              {isExpanded ? "Show Less" : "Show More"}
            </Button>
            <Button
              size="sm"
              className="text-xs cursor-pointer"
              onClick={() => onSelect(job)}
            >
              Select Position
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;