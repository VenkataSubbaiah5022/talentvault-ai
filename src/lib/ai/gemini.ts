import { GoogleGenerativeAI } from "@google/generative-ai";
import { isQuotaError, parseRetryDelayMs } from "@/lib/ai/quota";
import { sleep } from "@/lib/utils/sleep";
import type { AIExtractionResult } from "@/types/candidate";

const MODEL_ID = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

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

  const text = await generateWithRetry(model, EXTRACTION_PROMPT + truncated);

  let parsed: AIExtractionResult;
  try {
    parsed = JSON.parse(text) as AIExtractionResult;
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  const skills = Array.isArray(parsed.skills)
    ? parsed.skills.map((s) => String(s).trim()).filter(Boolean)
    : [];

  return {
    skills,
    years_experience: Number(parsed.years_experience) || 0,
    recent_job_title: String(parsed.recent_job_title || "Unknown").trim(),
    location: String(parsed.location || "Unknown").trim(),
    resume_summary: String(parsed.resume_summary || "").trim().slice(0, 300),
  };
}

function isRetryableGeminiError(err: unknown): boolean {
  const message =
    err instanceof Error ? err.message : String(err);
  return (
    isQuotaError(message) ||
    message.toLowerCase().includes("503") ||
    message.toLowerCase().includes("unavailable")
  );
}

async function generateWithRetry(
  model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
  prompt: string,
): Promise<string> {
  const maxAttempts = 5;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (attempt < maxAttempts - 1 && isRetryableGeminiError(err)) {
        await sleep(parseRetryDelayMs(message, attempt));
        continue;
      }
      throw err;
    }
  }

  throw new Error("AI request failed after retries");
}
