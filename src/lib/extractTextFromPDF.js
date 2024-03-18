import PdfParse from "pdf-parse";

export const extractTextFromPDF = (pdfBuffer) => {
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
