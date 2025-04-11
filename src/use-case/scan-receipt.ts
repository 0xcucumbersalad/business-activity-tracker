import { generationConfig } from "@/constant/constant";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/env";
import { systemInstruction } from "@/constant/constant";

const genAI = new GoogleGenerativeAI(env.GEMINI_SECRET_KEY);

export async function ScanReceipt(image: string) {
  const mimeType = (dataUrl: string) => dataUrl.split(";")[0].split(":")[1];

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction,
  });

  const scanSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: mimeType(image),
              data: image.split(",")[1],
            },
          },
        ],
      },
    ],
  });

  const scanResult = await scanSession.sendMessage(
    "Please process the receipt image and extract all text content from it.",
  );

  return JSON.parse(scanResult.response.text());
}
