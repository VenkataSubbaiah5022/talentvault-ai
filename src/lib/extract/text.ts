import mammoth from "mammoth";

export async function extractTextFromFile(
  buffer: Buffer,
  filename: string,
): Promise<string> {
  const ext = filename.split(".").pop()?.toLowerCase();

  if (ext === "pdf") {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      const text = result.text?.trim();
      if (!text) throw new Error("Could not extract text from PDF");
      return text;
    } finally {
      await parser.destroy();
    }
  }

  if (ext === "docx" || ext === "doc") {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value?.trim();
    if (!text) throw new Error("Could not extract text from Word document");
    return text;
  }

  throw new Error(`Unsupported file type: .${ext}. Use PDF or DOCX.`);
}

export function isSupportedResumeFile(filename: string): boolean {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext === "pdf" || ext === "docx" || ext === "doc";
}
