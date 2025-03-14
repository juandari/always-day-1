export function cleanJSON(rawString) {
  return rawString.replace(/```(?:json)?\n?|```/g, "").trim();
}
