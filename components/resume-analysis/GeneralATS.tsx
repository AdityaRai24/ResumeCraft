import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  CheckCircle, 
  XCircle, 
  Trophy,
  AlertCircle,
  Tag,
  CheckSquare,
  Bot
} from "lucide-react";

const GeneralATS = ({ analysis } : any) => {
  return (
    <AccordionItem value="ats" className="border rounded-lg overflow-hidden">
      <AccordionTrigger className="bg-gray-50 p-4 cursor-pointer hover:no-underline">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-lg">ATS Analysis</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm text-gray-500">ATS Score</div>
              <div className="font-bold text-lg">
                {Math.round(analysis.atsScore)}/100
              </div>
            </div>
            <Trophy className={`w-6 h-6 ${
              analysis.atsScore >= 80 ? 'text-yellow-500' :
              analysis.atsScore >= 60 ? 'text-gray-500' :
              'text-gray-400'
            }`} />
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="p-4 bg-white">
        <div className="space-y-6">
          {/* Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(analysis.subscores).map(([key, value] : any) => (
              <div key={key} className="bg-white p-4 rounded-lg border hover:border-blue-200 transition-colors">
                <h4 className="text-sm text-gray-600 capitalize mb-1">
                  {key.replace(/Score$/, '').split(/(?=[A-Z])/).join(' ')}
                </h4>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold">{Math.round(value)}</span>
                  <span className="text-gray-500 mb-1">/100</span>
                </div>
              </div>
            ))}
          </div>

          {/* Keyword Analysis */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="bg-green-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-gray-800">Keyword Analysis</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Match Rate:</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {Math.round(analysis.keywordMatch.overallMatchRate * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Matched Keywords */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Matched Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordMatch.matched.map((keyword : string, idx : number) => (
                    <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              {analysis.keywordMatch.missing.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywordMatch.missing.map((keyword : string, idx : number) => (
                      <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Format Analysis */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="bg-blue-50 p-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-gray-800">Format Analysis</h3>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Format Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  { label: "Proper Structure", check: analysis.formatAnalysis.hasProperStructure },
                  { label: "Clean Formatting", check: analysis.formatAnalysis.hasCleanFormatting }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      item.check 
                        ? 'bg-green-50 text-green-700 border border-green-100' 
                        : 'bg-red-50 text-red-700 border border-red-100'
                    }`}
                  >
                    {item.check ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Format Issues */}
              {analysis.formatAnalysis.issues.length > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <h4 className="text-sm font-medium text-yellow-800">Formatting Issues</h4>
                  </div>
                  <ul className="space-y-2">
                    {analysis.formatAnalysis.issues.map((issue : string, idx : number) => (
                      <li key={idx} className="text-yellow-700 text-sm flex items-start gap-2">
                        <span>•</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-indigo-800 mb-3">Recommendations</h4>
            <ul className="space-y-2">
              {analysis.recommendations.map((recommendation : string, idx : number) => (
                <li key={idx} className="text-indigo-700 text-sm flex items-start gap-2">
                  <span>•</span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>

          {/* Humorous Verdict */}
          <div className="border-t pt-4">
            <p className="text-gray-600 italic text-sm">
              🤖 {analysis.humorousVerdict}
            </p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default GeneralATS;