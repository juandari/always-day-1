import { describe, it, expect } from "vitest";
import { cleanJSON } from "./clean-json";

describe("cleanJSON", () => {
  it("should remove code block markers", () => {
    const input = '```json\n{"name": "test"}\n```';
    const expected = '{"name": "test"}';
    expect(cleanJSON(input)).toBe(expected);
  });

  it("should remove code block markers without json specification", () => {
    const input = '```\n{"name": "test"}\n```';
    const expected = '{"name": "test"}';
    expect(cleanJSON(input)).toBe(expected);
  });

  it("should remove single-line comments", () => {
    const input = '{"name": "test"} // this is a comment';
    const expected = '{"name": "test"} ';
    expect(cleanJSON(input)).toBe(expected);
  });

  it("should remove single-line comments with multiple slashes", () => {
    const input =
      '{"name": "test", "value": "test"}// this is a comment // another comment';
    const expected = '{"name": "test", "value": "test"}';
    expect(cleanJSON(input)).toBe(expected);
  });

  it("should handle multiple single-line comments", () => {
    const input =
      '// header comment\n{"name": "test"} // inline comment\n// footer comment';
    const expected = '\n{"name": "test"} \n';
    expect(cleanJSON(input)).toBe(expected);
  });

  it("should trim whitespace", () => {
    const input = '  \n  {"name": "test"}  \n  ';
    const expected = '{"name": "test"}';
    expect(cleanJSON(input)).toBe(expected);
  });

  it("should handle complex cases with both code blocks and comments", () => {
    const input =
      '```json\n// header comment\n{"name": "test", // inline comment\n"value": true}\n// footer comment\n```';
    const expected = '\n{"name": "test", \n"value": true}\n';
    expect(cleanJSON(input)).toBe(expected);
  });
});
