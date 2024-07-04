// pages/api/generatePdf.js
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  console.log("PDF generation started");
  try {
    const { id } = await req.json(); // Extract the id from the request body

    const browser = await puppeteer.launch({
      headless: true as any,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    console.log("Browser launched");
    
    const page = await browser.newPage();
    console.log("New page created");
    
    // Increase timeout to 60 seconds
    page.setDefaultNavigationTimeout(60000);
    page.setDefaultTimeout(60000);
    
    console.log("Navigating to page...");
    await page.goto(`http://localhost:3000/build-resume/${id}/download?resumeonly=true`, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });
    console.log("Page loaded");
    
    // Use a more reliable wait method
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 5000)));
    console.log("Waited additional 5 seconds");
    
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      scale: 1,
      height: '297mm',
      width: '210mm',
    }); 
    console.log("PDF generated");
    
    await browser.close();
    console.log("Browser closed");

    const response = new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=resume.pdf',
      },
    });
    console.log("Sending PDF response");
    return response;

  } catch (error : any) {
    console.error("Error in PDF generation:", error);
    return NextResponse.json({ error: 'Failed to generate PDF', details: error.message }, { status: 500 });
  }
}