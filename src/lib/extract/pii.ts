const EMAIL_REGEX =
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

const PHONE_REGEX =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}(?:[\s.-]?\d{1,4})?/g;

const LINKEDIN_REGEX =
  /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?/gi;

const GITHUB_REGEX =
  /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+\/?/gi;

export function scrubPII(rawText: string): string {
  return rawText
    .replace(EMAIL_REGEX, "[EMAIL]")
    .replace(LINKEDIN_REGEX, "[LINKEDIN]")
    .replace(GITHUB_REGEX, "[GITHUB]")
    .replace(PHONE_REGEX, "[PHONE]");
}
