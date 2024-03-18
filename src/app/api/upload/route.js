import { extractTextFromPDF } from "@/lib/extractTextFromPDF";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ message: "No files received.", status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = new Buffer.from(buffer);
    const pdfText = await extractTextFromPDF(pdfData);

    return NextResponse.json({
      message: "Text extracted successfully",
      status: 201,
      data: pdfText,
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: error.message,
      success: false,
      status: 500,
    });
  }
}
