export default function safeParse(code: string, defaultValue: unknown = undefined) {
  try {
    return JSON.parse(code);
  } catch (e) {
    return defaultValue;
  }
}