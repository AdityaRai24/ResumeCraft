import pdf from "pdf-poppler";
import fs from "fs";
import path from "path";

/**
 * Convert PDF to Image
 */
export async function pdfToImage(base64Pdf: string): Promise<string> {
  const pdfBuffer = Buffer.from(base64Pdf.split(",")[1], "base64");

  const pdfPath = path.join("/tmp", "resume.pdf");
  fs.writeFileSync(pdfPath, pdfBuffer);

  const imagePath = pdfPath.replace(".pdf", ".jpg");

  const opts = {
    format: "jpeg",
    out_dir: path.dirname(imagePath),
    out_prefix: "resume",
    scale: 2.0, // High resolution
  };

  await pdf.convert(pdfPath, opts);

  return imagePath; // Return converted image path
}
