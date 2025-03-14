export async function getPromptAi() {
  const aistatus = await self.ai.languageModel.availability();

  if (aistatus === "available") {
    const session = await self.ai.languageModel.create();

    return session;
  }

  if(aistatus === "unavailable") {
    throw new Error("AI model is currently unavailable. Please try again later.");
  }
}
