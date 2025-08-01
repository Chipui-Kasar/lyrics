import { useState } from "react";

interface UploadResponse {
  success: boolean;
  url?: string;
  public_id?: string;
  error?: string;
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImage = async (file: File): Promise<UploadResponse> => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setUploadProgress(100);
      return result;
    } catch (error) {
      console.error("Upload error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      };
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return {
    uploadImage,
    uploading,
    uploadProgress,
  };
};
