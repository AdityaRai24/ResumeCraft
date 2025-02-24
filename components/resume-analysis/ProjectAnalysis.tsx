import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FileText,
  CheckCircle,
  XCircle,
  Trophy,
  Target,
  Star,
  Wand2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";

const ProjectAnalysis = ({ parsedData, analysis }: any) => {
  const [magicPoints, setMagicPoints] = useState<{ [key: number]: string[] }>(
    {}
  );
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleMagicPoints = async (projectIndex: number) => {
    // If magic points already exist for this project, just hide them
    if (magicPoints[projectIndex]) {
      setMagicPoints((prev) => {
        const newState = { ...prev };
        delete newState[projectIndex];
        return newState;
      });
      return;
    }

    const projectTitle = parsedData[projectIndex].title;
    const projectDescription = parsedData[projectIndex].description;


    try {
      setLoadingStates((prev) => ({ ...prev, [projectIndex]: true }));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/generatePD`,
        { projectTitle, projectDescription }
      );

      setMagicPoints((prev) => ({
        ...prev,
        [projectIndex]: response.data.textArray || [],
      }));
    } catch (error) {
      toast.error("Failed to generate magic insights");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [projectIndex]: false }));
    }
  };

  return (
    <AccordionItem
      value="projects"
      className="border rounded-lg overflow-hidden"
    >
      <AccordionTrigger className="bg-gray-50 p-4 cursor-pointer hover:no-underline">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-lg">Projects Analysis</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-gray-500">Score</div>
              <div className="font-bold text-lg">
                {Math.round(analysis.overallScore)}/100
              </div>
            </div>
            <Trophy
              className={`w-6 h-6 ${
                analysis.overallScore >= 80
                  ? "text-yellow-500"
                  : analysis.overallScore >= 60
                    ? "text-gray-500"
                    : "text-gray-400"
              }`}
            />
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="p-4 bg-white">
        <div className="space-y-6">
          {/* Overall Analysis */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium text-lg text-gray-800">
                Projects Overview
              </h4>
            </div>
            <p className="text-gray-700 leading-relaxed">{analysis.review}</p>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(analysis.subscores).map(([key, value]: any) => (
              <div
                key={key}
                className="bg-white p-4 rounded-lg border hover:border-blue-200 transition-colors"
              >
                <h4 className="text-sm text-gray-600 capitalize mb-1">
                  {key
                    .replace(/Score$/, "")
                    .split(/(?=[A-Z])/)
                    .join(" ")}
                </h4>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold">{value}</span>
                  <span className="text-gray-500 mb-1">/100</span>
                </div>
              </div>
            ))}
          </div>

          {/* Individual Projects */}
          <div className="space-y-4">
            {analysis.entries.map((project: any, i: number) => (
              <div
                key={i}
                className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-all"
              >
                <div className="bg-gray-50 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {project.projectTitle}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Project Entry {i + 1}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-gray-500">Relevance</span>
                      <span className="font-medium text-gray-700">
                        {project.relevanceScore}%
                      </span>
                    </div>
                    <Button
                      onClick={() => toggleMagicPoints(i)}
                      variant="default"
                      className="flex items-center gap-2"
                      disabled={loadingStates[i]}
                    >
                      {loadingStates[i] ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Wand2 className="w-4 h-4" />
                      )}
                      {magicPoints[i] ? "Hide Magic" : "Magic Write"}
                    </Button>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* Magic Points */}
                  {loadingStates[i] && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <div className="flex items-center gap-2 text-purple-700">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">
                          Improving project descriptions...
                        </span>
                      </div>
                    </div>
                  )}

                  {magicPoints[i] && magicPoints[i].length > 0 && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 animate-fadeIn">
                      <h4 className="text-sm font-medium text-purple-800 mb-3">
                        ✨ Improved descriptions
                      </h4>
                      <ul className="list-disc list-inside space-y-2">
                        {magicPoints[i].map((point, idx) => (
                          <li key={idx} className="text-purple-700 text-sm">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Component Checklist */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Key Components
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                      {[
                        {
                          label: "Project Name",
                          check: project.hasProjectName,
                        },
                        {
                          label: "Technologies",
                          check: project.hasTechnologies,
                        },
                        { label: "Description", check: project.hasDescription },
                        { label: "Quantifiers", check: project.hasQuantifiers },
                        { label: "Outcomes", check: project.hasOutcomes },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                            item.check
                              ? "bg-green-50 text-green-700 border border-green-100"
                              : "bg-gray-50 text-gray-500 border border-gray-200"
                          }`}
                        >
                          {item.check ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project Review */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-blue-700 text-sm">
                      {project.wittyComment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comedic Summary */}
          <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Final Thoughts
            </h4>
            <p className="text-gray-600 italic text-sm">
              ✨ {analysis.comedicSummary}
            </p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ProjectAnalysis;
