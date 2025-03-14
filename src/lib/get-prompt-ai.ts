export async function getPromptAi() {
  const aistatus = await window.ai.languageModel.availability();

  if (aistatus === "available") {
    const session = await window.ai.languageModel.create({
      systemPrompt:
        "You are a professional chef with extensive experience in identifying dishes from both text and images",
    });

    return session;
  }

  if (aistatus === "unavailable") {
    throw new Error(
      "AI model is currently unavailable. Please try again later."
    );
  }
}
