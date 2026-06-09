import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIExtractionResult } from "@/types/candidate";

const MODEL_ID = "gemini-2.5-flash";

const EXTRACTION_PROMPT = `You are a resume parsing assistant for recruiters. Extract structured data from the scrubbed resume text below.

Rules:
- PII has already been removed (placeholders like [EMAIL], [PHONE], [LINKEDIN], [GITHUB] may appear — ignore them).
- Return ONLY valid JSON, no markdown fences.
- skills: array of distinct technical and professional skills (lowercase preferred, 5-15 items).
- years_experience: total years of professional experience as a number (estimate from roles if needed).
- recent_job_title: most recent or current job title.
- location: city and country if available, or "Remote" if clearly remote-only.
- resume_summary: 1-2 sentence professional summary for a recruiter card (max 200 chars, no contact info).

JSON shape:
{
  "skills": ["react", "node.js"],
  "years_experience": 5,
  "recent_job_title": "Senior Software Engineer",
  "location": "Hyderabad, India",
  "resume_summary": "Senior engineer with 5 years building React and Node.js SaaS products."
}

Scrubbed resume text:
`;

export async function extractResumeData(
  scrubbedText: string,
): Promise<AIExtractionResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL_ID,
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  });

  const truncated =
    scrubbedText.length > 12000
      ? scrubbedText.slice(0, 12000) + "\n...[truncated]"
      : scrubbedText;

  const result = await model.generateContent(EXTRACTION_PROMPT + truncated);
  const text = result.response.text();

  let parsed: AIExtractionResult;
  try {
    parsed = JSON.parse(text) as AIExtractionResult;
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  if (!Array.isArray(parsed.skills) || parsed.skills.length === 0) {
    throw new Error("AI extraction missing skills");
  }

  return {
    skills: parsed.skills.map((s) => String(s).trim()).filter(Boolean),
    years_experience: Number(parsed.years_experience) || 0,
    recent_job_title: String(parsed.recent_job_title || "Unknown").trim(),
    location: String(parsed.location || "Unknown").trim(),
    resume_summary: String(parsed.resume_summary || "").trim().slice(0, 300),
  };
}
