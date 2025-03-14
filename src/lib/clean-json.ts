export function cleanJSON(rawString: string) {
  // First remove code blocks
  let cleaned = rawString.replace(/```(?:json)?\n?|```/g, "").trim();
  // Remove single-line comments
  cleaned = cleaned.replace(/\/\/.*$/gm, "");
  return cleaned;
}
