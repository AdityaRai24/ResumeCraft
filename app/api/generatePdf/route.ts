import { NextRequest, NextResponse } from "next/server";
import chromium from "chrome-aws-lambda";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  console.log("PDF generation started");
  try {
    const { id } = await req.json(); // Extract the id from the request body

    let browser;
    let options = {};

    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
      options = {
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      };
      browser = await puppeteerCore.launch(options);
    } else {
      options = {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: "new",
      };
      browser = await puppeteer.launch(options);
    }

    console.log("Browser launched");

    const page = await browser.newPage();
    console.log("New page created");

    // Increase timeout to 60 seconds
    page.setDefaultNavigationTimeout(60000);
    page.setDefaultTimeout(60000);

    console.log("Navigating to page...");
    await page.goto(
      `${process.env.NEXT_PUBLIC_WEBSITE_URL}/build-resume/${id}/download?resumeonly=true`,
      {
        waitUntil: "networkidle0",
        timeout: 60000,
      }
    );
    console.log("Page loaded");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      scale: 1,
      height: "297mm",
      width: "210mm",
    });
    console.log("PDF generated");

    await browser.close();
    console.log("Browser closed");

    const response = new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf",
      },
    });
    console.log("Sending PDF response");

    return response;

  } catch (error: any) {
    console.error("Error in PDF generation:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF", details: error.message },
      { status: 500 }
    );
  }
}