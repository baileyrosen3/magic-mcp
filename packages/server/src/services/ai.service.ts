import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-05-20",
});

export const generateComponent = async (
  prompt: string
): Promise<string | null> => {
  try {
    const fullPrompt = `
      You are an expert React developer. Your task is to create a single, self-contained React component based on the user's request.
      - The component must be written in TypeScript with modern best practices.
      - It should be fully functional and styled with inline styles.
      - Do not include any external dependencies or libraries.
      - Return only the raw code for the component inside a single typescript code block. Do not include any explanations, markdown, or extra text.
      - The user's request is: "${prompt}"
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    // Extract code from the markdown block
    return text.replace(/```typescript\n|```/g, "").trim();
  } catch (error) {
    console.error("Error generating component with Gemini:", error);
    return null;
  }
};

export const refineComponent = async (
  existingCode: string,
  prompt: string
): Promise<string | null> => {
  try {
    const fullPrompt = `
      You are an expert React developer. Your task is to refine an existing React component based on the user's request.
      - The component must be written in TypeScript with modern best practices.
      - Modify the provided code to meet the user's refinement instructions.
      - Return only the raw, updated code for the component inside a single typescript code block. Do not include any explanations, markdown, or extra text.
      
      Here is the component to refine:
      ${existingCode}
      
      My instructions are: ${prompt}
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    // Extract code from the markdown block
    return text.replace(/```typescript\n|```/g, "").trim();
  } catch (error) {
    console.error("Error refining component with Gemini:", error);
    return null;
  }
};
