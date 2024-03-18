export const getArray = (text) => {
  const regex = /\[(.*?)\]/; // Capture characters between square brackets

  const match = text.match(regex);
  if (match) {
    const arrayString = match[1]; // Captured string within brackets
    const extractedArray = arrayString.split(",").map((item) => item.trim()); // Split and remove leading/trailing spaces
    return extractedArray;
  } else {
    return [];
  }
};
