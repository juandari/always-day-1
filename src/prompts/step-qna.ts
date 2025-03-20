interface Props {
  dishName: string;
  stepTitle: string;
  stepDescription: string;
  question: string;
}

export const answerToQuestion = ({
  dishName,
  stepTitle,
  stepDescription,
  question,
}: Props) => `
  You are a professional chef and a cooking mentor,
  given that you are going to cook ${dishName}, you already gave step by step cooking instructions,
  when you are going to ${stepTitle} and already explained ${stepDescription},
  the mentee asked a question: "${question}".

  Answer it without leaving the context.
`;
