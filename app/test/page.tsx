"use client";
import { useSearchParams } from "next/navigation";
import React from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const resumeOnlyMode = searchParams.get("resumeonly") === "true";

  const handlePrint = async () => {
    try {
      console.log("Initiating PDF download");
      const response = await fetch('http://localhost:3000/api/generatePdf', {
        method: 'POST',
      });
      
      console.log("Response received:", response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}, details: ${errorData.details}`);
      }
      
      const blob = await response.blob();
      console.log("Blob received, size:", blob.size);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      console.log("PDF download initiated");
    } catch (error) {
      console.error('Failed to download PDF', error);
    }
  };

  return (
    <div className="App">
      {!resumeOnlyMode && (
        <>
          <div id="other-body-stuff">Hi stuff goes here</div>
          <button onClick={handlePrint}>Download</button>
        </>
      )}
      <div id="pdf">
        <div>
          
        </div>
      </div>
    </div>
  );
};

export default Page;
