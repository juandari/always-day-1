export {};

declare global {
  interface Window {
    ai: {
      languageModel: {
        create: () => Promise<LanguageModelSession>;
      };
    };
  }

  interface LanguageModelSession {
    prompt: (input: string) => Promise<string>;
  }
}
