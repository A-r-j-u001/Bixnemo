import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import fs from "fs";

// NOTE: Handling multipart/form-data in Next.js App Router API Routes is tricky.
// We might need to use `request.formData()` standard API.

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const fileManager = {
  uploadFile: async (path: string, options: any) => {
    // This is a mock since GoogleGenerativeAI SDK doesn't have direct file upload in the node client easily exposed without the FileManager API
    // actually, we need @google/generative-ai/files which is separate or check newer SDK versions.
    // For this MVP, we will use the "inline data" method if the file is small, or just assume the model supports it via prompt if we transcribe it first.

    // Wait, Gemini 1.5 Flash supports audio.
    // We need to convert the file buffer to base64.
    const fileData = fs.readFileSync(path);
    return {
      inlineData: {
        data: fileData.toString("base64"),
        mimeType: options.mimeType,
      }
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Prepare for Gemini
    // We use the inline data method.

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Please listen to this audio and generate detailed Minutes of the Meeting.";

    const imagePart = {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: file.type || "audio/mp3",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const summary = response.text();

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Audio Upload/Gemini Error:", error);
    return NextResponse.json({ error: "Failed to process audio" }, { status: 500 });
  }
}
