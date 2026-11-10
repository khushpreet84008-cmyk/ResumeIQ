const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

async function extractText(file) {
  const name = file.originalname.toLowerCase();
  if (name.endsWith(".pdf") || file.mimetype === "application/pdf") {
    const data = await pdfParse(file.buffer);
    return data.text;
  }
  if (name.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value;
  }
  if (name.endsWith(".txt")) return file.buffer.toString("utf8");
  throw new Error("Unsupported file type. Please upload a PDF, DOCX or TXT file.");
}
module.exports = { extractText };
