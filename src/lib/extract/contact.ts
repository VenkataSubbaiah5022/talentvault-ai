export interface ContactDetails {
  name: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  github_url: string | null;
}

const EMAIL_REGEX =
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const PHONE_REGEX =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}(?:[\s.-]?\d{1,4})?/g;

const LINKEDIN_REGEX =
  /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?/gi;

const GITHUB_REGEX =
  /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+\/?/gi;

function firstMatch(text: string, regex: RegExp): string | null {
  const match = text.match(regex);
  return match?.[0] ?? null;
}

function extractName(text: string, email: string | null): string | null {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines.slice(0, 8)) {
    if (line.length < 3 || line.length > 60) continue;
    if (EMAIL_REGEX.test(line)) continue;
    if (/^(resume|curriculum vitae|cv)$/i.test(line)) continue;
    if (/^\+?\d/.test(line)) continue;
    if (/linkedin|github|http/i.test(line)) continue;
    if (/[@|•|·]/.test(line) && line.split(/\s+/).length > 4) continue;

    const cleaned = line.replace(/[^a-zA-Z\s.'-]/g, "").trim();
    const words = cleaned.split(/\s+/).filter(Boolean);

    if (words.length >= 2 && words.length <= 5) {
      const isName = words.every(
        (w) => /^[A-Z][a-zA-Z.'-]*$/.test(w) || /^[A-Z]+$/.test(w),
      );
      if (isName) return words.join(" ");
    }
  }

  if (email) {
    const local = email.split("@")[0];
    const guessed = local
      .replace(/[._-]/g, " ")
      .split(" ")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(" ");
    if (guessed.split(" ").length >= 2) return guessed;
  }

  return lines[0]?.slice(0, 60) ?? null;
}

export function extractContactDetails(rawText: string): ContactDetails {
  const email = firstMatch(rawText, EMAIL_REGEX);
  const phone = firstMatch(rawText, PHONE_REGEX);
  const linkedin_url = firstMatch(rawText, LINKEDIN_REGEX);
  const github_url = firstMatch(rawText, GITHUB_REGEX);
  const name = extractName(rawText, email);

  return { name, email, phone, linkedin_url, github_url };
}
