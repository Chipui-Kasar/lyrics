"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useImageUpload } from "@/hooks/useImageUpload";
import { validateImageFile } from "@/lib/imageUtils";
import Image from "next/image";

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (imageUrl: string) => void;
  label?: string;
  placeholder?: string;
}

const ImageUpload = ({
  currentImageUrl,
  onImageUploaded,
  label = "Profile Photo",
  placeholder = "Select an image file or enter URL",
}: ImageUploadProps) => {
  const [imageUrl, setImageUrl] = useState(currentImageUrl || "");
  const [useUrlInput, setUseUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading, uploadProgress } = useImageUpload();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    const result = await uploadImage(file);

    if (result.success && result.url) {
      setImageUrl(result.url);
      onImageUploaded(result.url);
    } else {
      alert(result.error || "Failed to upload image");
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    onImageUploaded(url);
  };

  const clearImage = () => {
    setImageUrl("");
    onImageUploaded("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="image">{label}</Label>

      {/* Toggle between file upload and URL input */}
      <div className="flex gap-2 mb-2">
        <Button
          type="button"
          variant={!useUrlInput ? "default" : "outline"}
          size="sm"
          onClick={() => setUseUrlInput(false)}
        >
          Upload File
        </Button>
        <Button
          type="button"
          variant={useUrlInput ? "default" : "outline"}
          size="sm"
          onClick={() => setUseUrlInput(true)}
        >
          Enter URL
        </Button>
      </div>

      {useUrlInput ? (
        <Input
          id="image"
          name="image"
          type="url"
          placeholder={placeholder}
          value={imageUrl}
          onChange={handleUrlChange}
        />
      ) : (
        <div className="space-y-2">
          <Input
            ref={fileInputRef}
            id="image-file"
            name="image-file"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
          {uploading && (
            <p className="text-sm text-blue-600">
              Uploading... {uploadProgress}%
            </p>
          )}
        </div>
      )}

      {/* Image preview */}
      {imageUrl && (
        <div className="mt-4 space-y-2">
          <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt="Preview"
              fill
              className="object-cover"
              onError={() => {
                console.error("Failed to load image:", imageUrl);
              }}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearImage}
          >
            Remove Image
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
