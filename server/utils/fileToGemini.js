export const fileToGemini = (buffer, fileInfo) => {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error("A valid file buffer is required.");
  }

  return {
    inlineData: {
      mimeType: fileInfo.mimeType,
      data: buffer.toString("base64")
    }
  };
};