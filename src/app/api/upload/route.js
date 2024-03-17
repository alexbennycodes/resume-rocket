import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import PdfParse from "pdf-parse";

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

    cookies().set({
      name: "pdfText",
      value: pdfText,
      httpOnly: true,
      path: "/",
    });

    return NextResponse.json({
      message: "Success",
      status: 201,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error, status: 500 });
  }
}

const extractTextFromPDF = (pdfBuffer) => {
  return new Promise((resolve, reject) => {
    PdfParse(pdfBuffer)
      .then(function (data) {
        resolve(data.text);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
