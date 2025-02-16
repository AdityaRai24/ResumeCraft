const Tesseract = require("tesseract.js");

async function extractedData(imageUrl) {
  try {
    // let imageUrl = "https://i.ibb.co/0jYZHW34/Screenshot-2025-02-15-215026.png";
    const result = await Tesseract.recognize(imageUrl, "eng", {
      logger: (info) => console.log(info),
    });
    return {
      success: true,
      text: result.data.text,
      confidence: result.data.confidence,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports = extractedData;
