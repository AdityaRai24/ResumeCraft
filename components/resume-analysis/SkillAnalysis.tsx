import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Code,
  CheckCircle,
  XCircle,
  GraduationCap,
  Trophy,
  AlertCircle,
} from "lucide-react";

const SkillsAnalysis = ({ analysis } : any) => {

  return (
    <AccordionItem value="skills" className="border rounded-lg overflow-hidden">
      <AccordionTrigger className="bg-gray-50 p-4 cursor-pointer hover:no-underline">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-lg">Skills Analysis</span>
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
            <h4 className="font-medium text-lg text-gray-800 mb-3">
              Analysis Summary
            </h4>
            <p className="text-gray-700 leading-relaxed">
              {analysis.review}
            </p>
          </div>

          {/* Detailed Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(analysis.subscores).map(([key, value] : any) => (
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
                  <span className="text-2xl font-bold">
                    {Math.round(value)}
                  </span>
                  <span className="text-gray-500 mb-1">/100</span>
                </div>
              </div>
            ))}
          </div>

          {/* Skills Matching */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matching Skills */}
            <div className="border rounded-lg bg-white hover:border-green-200 transition-colors">
              <div className="bg-gray-50 p-4 border-b">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-gray-800">Matching Skills</h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {analysis?.matchingSkills?.map((skill : any, index : number) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100 hover:bg-green-100 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Missing Skills */}
            <div className="border rounded-lg bg-white hover:border-red-200 transition-colors">
              <div className="bg-gray-50 p-4 border-b">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h3 className="font-medium text-gray-800">
                    Skills to Develop
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {analysis?.missingSkills?.map((skill : any, index : number) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100 hover:bg-red-100 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Funny Takeaway */}
          <div className="border-t pt-4">
            <p className="text-gray-600 italic text-sm flex items-center gap-2">
              💡 {analysis.funnyTakeaway}
            </p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default SkillsAnalysis;