import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 });
    }

    const apiKey = authHeader.split("Bearer ")[1];
    if (!apiKey) {
      return NextResponse.json({ error: "API key is empty" }, { status: 401 });
    }

    const { image, mimeType } = await req.json();
    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Initialize SDK with the provided key
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are an expert carbon footprint estimator. Analyze the provided image of a receipt, utility bill, or ticket.
      Extract what the item is (e.g., "Grocery Shopping", "Electricity Bill", "Flight to NYC", "Gas Station").
      Estimate the carbon footprint of the items or activities in the image in kg of CO2e.
      Respond ONLY with a JSON object in this exact format, with no markdown formatting or backticks:
      {
        "title": "Short descriptive title",
        "carbonValue": 12.5
      }
      If you cannot determine the contents, provide a best guess based on the visual context or return 0 for carbonValue.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        prompt,
        {
          inlineData: {
            data: image,
            mimeType: mimeType || "image/jpeg",
          },
        },
      ],
    });

    const text = response.text || "";
    
    // Clean up potential markdown formatting from the response
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    let result;
    try {
      result = JSON.parse(cleanText);
    } catch (e) {
      console.error("Failed to parse Gemini response:", cleanText);
      // Fallback
      result = { title: "Unknown Item", carbonValue: 0 };
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Scan API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process image" }, { status: 500 });
  }
}
