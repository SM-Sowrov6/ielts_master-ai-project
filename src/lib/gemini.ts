
export async function generateIELTSResponse(prompt: string, temperature: number, image?: string) {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, temperature, image }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate response");
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

export const TASK1_PROMPT = (task1Type: string, imageDescription: string) => `
You are an IELTS examiner.

Write IELTS Academic Writing Task 1 answer based on the given visual data.

Task Type: ${task1Type}

Image Description:
${imageDescription}

Instructions:
- Follow IELTS Task 1 structure (Introduction, Overview, Details)
- Minimum 150 words
- Do NOT assume data not mentioned
- Use accurate comparisons and trends
`;

export const TASK2_PROMPT = (essayType: string, question: string) => `
You are an IELTS examiner.

Write IELTS Writing Task 2 essay.

Essay Type: ${essayType}

Question:
${question}

Instructions:
- Minimum 250 words
- Include introduction, body paragraphs, conclusion
- Use clear arguments and examples
`;
