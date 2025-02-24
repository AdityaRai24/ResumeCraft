"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import ResumeAnalysisLoading from "@/components/ResumeAnalysisLoading";
import ResumeUpload from "@/components/resume-analysis/ResumeUpload";
import EducationAnalysis from "@/components/resume-analysis/EducationAnalysis";
import ProjectAnalysis from "@/components/resume-analysis/ProjectAnalysis";
import ExperienceAnalysis from "@/components/resume-analysis/ExperienceAnalysis";
import SkillAnalysis from "@/components/resume-analysis/SkillAnalysis";
import GeneralATS from "@/components/resume-analysis/GeneralATS";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const PDFExtractor = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);


  const { user } = useUser();

  const isPremiumMember = useQuery(api.premiumUsers.isPremiumMember, {
    userId: user?.id ? user?.id : "randomuserid",
  });

  if (!user) {
    return redirect("/sign-up");
  }


  return (
    <>
      <Navbar />

      <div>
        {!pdfUrl && (
          <ResumeUpload
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
            setParsedData={setParsedData}
            setPdfUrl={setPdfUrl}
            setAnalysis={setAnalysis}
          />
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
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-2xl font-bold">
                        Analysis Results
                      </CardTitle>
                      <div className="relative group">
                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center cursor-help">
                          <span className="text-xs font-bold text-gray-600">
                            i
                          </span>
                        </div>
                        <div className="absolute left-0  bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-[999999]">
                          Resume analysis results may not be 100% reliable. This
                          is an experimental project and should be used as a
                          general guideline only.
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mt-3">
                      <p>{analysis.sections.ats.overallReview}</p>
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
                  </div>
                </CardHeader>

                <CardContent>
                  <Accordion type="single" collapsible className="space-y-4">
                    <SkillAnalysis analysis={analysis.sections.skills} />
                    <ExperienceAnalysis
                      parsedData={parsedData.experience}
                      analysis={analysis.sections.experience}
                    />
                    <ProjectAnalysis
                      parsedData={parsedData.projects}
                      analysis={analysis.sections.projects}
                    />
                    <EducationAnalysis analysis={analysis.sections.education} />
                    <GeneralATS
                      jobDescription={selectedJob}
                      parsedData={parsedData}
                      analysis={analysis.sections}
                    />
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
