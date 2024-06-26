"use client";
import { useParams } from "next/navigation";
import React, { useRef } from "react";
import Template1 from "@/templates/template1/template1";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import html2canvas from "html2canvas"
import jsPDF from 'jspdf'

const LiveResumePreview = () => {
  const params = useParams();
  const templateDetails = useQuery(api.resume.getTemplateDetails, {
    id: params.id as Id<"resumes">,
  });
  const componentRef = useRef();

  const handlePrint = async () => {
    const capture = document.querySelector('#resumeSection');
    if (!capture) return;
    const scale = 2;
    const canvas = await html2canvas(capture as HTMLElement, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
    });
  
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
  
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
    let heightLeft = pdfHeight;
    let position = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();
  
    while (heightLeft >= 0) {
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
      position -= pageHeight;
      if (heightLeft > 0) {
        pdf.addPage();
      }
    }
  
    pdf.save('Resume.pdf');
  };


  if (templateDetails === null) {
    return <div>Template not found</div>;
  }
  if (templateDetails === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center mx-auto">
      <button
        onClick={handlePrint}
        className="mb-4 px-4 py-2 no-scrollbar bg-blue-500 text-white rounded hover:bg-blue-600 print:hidden"
      >
        Print Resume
      </button>
      <div className="resume-container no-scrollbar" ref={componentRef}>
        <Template1 obj={templateDetails} />
      </div>
    </div>
  );
};

export default LiveResumePreview;
