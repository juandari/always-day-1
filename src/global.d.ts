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
     prompt(input: [string, { type: "image" | "audio"; content: any }]): Promise<string>;
     prompt(input: string): Promise<string>;
  }
}
