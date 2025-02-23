"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Code,
  Briefcase,
  GraduationCap,
  RefreshCw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import ResumeAnalysisLoading from "@/components/ResumeAnalysisLoading";
import ResumeUpload from "@/components/resume-analysis/ResumeUpload";
import EducationAnalysis from "@/components/resume-analysis/EducationAnalysis";
import ProjectAnalysis from "@/components/resume-analysis/ProjectAnalysis";
import ExperienceAnalysis from "@/components/resume-analysis/ExperienceAnalysis";
import SkillAnalysis from "@/components/resume-analysis/SkillAnalysis";
import GeneralATS from "@/components/resume-analysis/GeneralATS";

const PDFExtractor = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [analysis, setAnalysis] = useState(null);

  return (
    <>
      <Navbar />

      <div>
        {!pdfUrl && (
          <ResumeUpload setPdfUrl={setPdfUrl} setAnalysis={setAnalysis} />
        )}

        {pdfUrl && (
          <div className="grid grid-cols-5 gap-4 w-full">
            <div className="col-span-2 sticky top-4 h-[calc(100vh-2rem)]">
              <div className="w-full h-full py-4 ml-4">
                <embed
                  src={`${pdfUrl}#toolbar=0&navpanes=0`}
                  type="application/pdf"
                  className="w-full h-full rounded-lg"
                  style={{ minHeight: "calc(100vh - 4rem)" }}
                />
              </div>
            </div>

            {!analysis && (
              <div className="w-[93%] mx-auto m-4 col-span-3">
                <ResumeAnalysisLoading />
              </div>
            )}

            {analysis && (
              <Card className="w-[93%] mx-auto m-4 col-span-3">
                <CardHeader className="flex flex-row items-start justify-between gap-6 py-6">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-bold">
                      Analysis Results
                    </CardTitle>
                    <div className="space-y-2 mt-3">
                      <p className="text-gray-600">
                        Your resume demonstrates strong technical proficiency
                        and professional experience, with notable achievements
                        and clear progression in your career path.
                      </p>
                      <p className="text-gray-600">
                        While the core content is solid, there are opportunities
                        to enhance your ATS optimization and strengthen the
                        impact of your project descriptions.
                      </p>
                      <p className="text-gray-600">
                        Strategic improvements in keyword placement and
                        quantifiable achievements could significantly boost your
                        resume's effectiveness in automated screening systems.
                      </p>
                    </div>
                  </div>

                  <div className="relative flex-shrink-0">
                    <div className="w-32 h-32 rounded-full border-8 border-red-400 flex items-center justify-center bg-white">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary-600">
                          {analysis.overall.score}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Overall Score
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                      Strong
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <Accordion type="single" collapsible className="space-y-4">
                    <SkillAnalysis analysis={analysis.sections.skills} />
                    <ExperienceAnalysis
                      analysis={analysis.sections.experience}
                    />
                    <ProjectAnalysis analysis={analysis.sections.projects} />
                    <EducationAnalysis analysis={analysis.sections.education} />
                    <GeneralATS analysis={analysis.sections.ats} />
                  </Accordion>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default PDFExtractor;
