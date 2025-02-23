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

const EducationAnalysis = ({ analysis }: any) => {
  return (
    <AccordionItem
      value="education"
      className="border rounded-lg overflow-hidden"
    >
      <AccordionTrigger className="bg-gray-50 p-4 cursor-pointer hover:no-underline">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-lg">Education Analysis</span>
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
          {/* Overall Assessment */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-lg text-gray-800 mb-3">
              Analysis Summary
            </h4>
            <p className="text-gray-700 leading-relaxed">{analysis.review}</p>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Education Entries */}
          <div className="space-y-4">
            {analysis?.entries?.map((entry: any, index: number) => (
              <div
                key={index}
                className="border rounded-lg bg-white hover:shadow-md transition-all"
              >
                <div className="bg-gray-50 p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-gray-600" />
                      <h3 className="font-medium text-gray-800">
                        Education Entry {index + 1}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* Component Status Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                    {[
                      { label: "Degree", check: entry.hasDegreeName },
                      { label: "Institution", check: entry.hasInstitution },
                      { label: "Dates", check: entry.hasDates },
                      { label: "CGPA", check: entry.hasCGPA },
                      { label: "Location", check: entry.hasLocation },
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

                  {/* Missing Requirements */}
                  {entry?.missingRequired.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                      <h4 className="text-sm font-medium text-red-800 mb-2">
                        Missing Components
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {entry?.missingRequired.map(
                          (field: any, idx: number) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 bg-red-100 text-red-800 rounded-lg text-sm font-medium"
                            >
                              {field}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Humorous Note */}
                  <div className="border-t pt-4">
                    <p className="text-gray-600 italic text-sm">
                      ✨ {entry.humorousNote}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Overall Roast */}
          <div className="border-t pt-4">
            <p className="text-gray-600 italic text-sm flex items-center gap-2">
              🎓 {analysis.overallRoast}
            </p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default EducationAnalysis