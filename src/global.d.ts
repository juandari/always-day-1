export {};

declare global {
  interface Window {
    ai: {
      languageModel: {
        create: (
          options?: AIAssistantCreateOptions
        ) => Promise<LanguageModelSession>;
        availability: () => Promise<string>;
      };
    };
  }
  interface LanguageModelSession {
    prompt(
      input: [string, { type: "image" | "audio"; content: any }] | string,
      options?: AIAssistantPromptOptions
    ): Promise<string>;
  }
}
