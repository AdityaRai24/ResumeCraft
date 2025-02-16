"use client"
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, FileText, CheckCircle, XCircle } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";
import toast from "react-hot-toast";
import axios from "axios";

pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.js";

const AnalysisSection = ({ title, data, icon }) => (
  <div className="border rounded-lg p-4 mb-4">
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <div className="space-y-2">
      {data}
    </div>
  </div>
);

const PDFExtractor = () => {
  const [extractedText, setExtractedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Previous functions remain the same
  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("loadend", (event) =>
        resolve(new Uint8Array(event.target.result))
      );
      reader.readAsArrayBuffer(file);
    });
  };

  const convertToImage = async (pdf) => {
    const images = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: canvas.getContext("2d"),
        viewport: viewport,
      }).promise;

      images.push(canvas.toDataURL("image/png"));
    }
    return images;
  };

  const convertToText = async (images) => {
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

  const handleFile = async (file) => {
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
      await getStructured(text);
    } catch (error) {
      console.log(error);
      setError(`Error processing PDF: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") {
      await handleFile(file);
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const getStructured = async (text) => {
    if (!text) {
      toast.error("Upload a valid report.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:3000/api/extract-resume-data`,
        { extractedText: text }
      );
      setAnalysis(response.data.analysis);
    } catch (error) {
      console.log(error);
      toast.error("Error analyzing resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Resume Analyzer</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="flex flex-col items-center space-y-4">
              <Upload className="w-12 h-12 text-gray-400" />
              <div className="text-lg">
                Drag and drop your resume PDF here, or
                <label className="ml-1 text-blue-500 hover:text-blue-600 cursor-pointer">
                  browse
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500">Supports PDF files only</p>
            </div>
          </div>

          {(isLoading || loading) && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Analyzing your resume...</span>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <AnalysisSection
              title="Skills Analysis"
              icon={<FileText className="w-5 h-5" />}
              data={
                <div>
                  <div className="mb-3">
                    <h4 className="font-medium mb-2">Matching Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.skillsAnalysis.matchingSkills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-green-100 text-green-800 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <h4 className="font-medium mb-2">Missing Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.skillsAnalysis.missingSkills.map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-red-100 text-red-800 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Funny Takes</h4>
                    {analysis.skillsAnalysis.sassyComments.map((comment, i) => (
                      <p key={i} className="text-gray-600 italic mb-1">"{comment}"</p>
                    ))}
                  </div>
                </div>
              }
            />

            <AnalysisSection
              title="Experience Analysis"
              icon={<FileText className="w-5 h-5" />}
              data={
                <div>
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Career Story Roast</h4>
                    <p className="text-gray-600 italic">"{analysis.experienceAnalysis.careerStoryRoast}"</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Funny Highlights</h4>
                    {analysis.experienceAnalysis.funnyHighlights.map((highlight, i) => (
                      <p key={i} className="text-gray-600 mb-1">• {highlight}</p>
                    ))}
                  </div>
                </div>
              }
            />

            <AnalysisSection
              title="Projects Analysis"
              icon={<FileText className="w-5 h-5" />}
              data={
                <div>
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Comedy Summary</h4>
                    <p className="text-gray-600 italic">"{analysis.projectsAnalysis.comedicSummary}"</p>
                  </div>
                  {analysis.projectsAnalysis.entries.map((project, i) => (
                    <div key={i} className="mb-3 p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        {project.relevanceScore > 70 ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <p className="font-medium">Project {i + 1}</p>
                      </div>
                      <p className="text-gray-600 italic mt-1">"{project.wittyComment}"</p>
                    </div>
                  ))}
                </div>
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PDFExtractor;