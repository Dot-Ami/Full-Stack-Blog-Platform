"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { startUpload } = useUploadThing("postImage", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        onChange(res[0].url);
      }
      setIsUploading(false);
    },
    onUploadError: (err) => {
      setError(err.message || "Failed to upload image");
      setIsUploading(false);
    },
  });

  const handleUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setError(null);

      try {
        await startUpload([file]);
      } catch {
        setError("Failed to upload image");
        setIsUploading(false);
      }
    },
    [startUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUrlInput = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      onChange(url);
    }
  };

  if (value) {
    return (
      <div className={cn("relative", className)}>
        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
          <Image
            src={value}
            alt="Featured image"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-3 right-3 p-2 rounded-lg bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-xl transition-colors cursor-pointer",
          isUploading
            ? "border-indigo-300 bg-indigo-50"
            : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
        )}
      >
        {isUploading ? (
          <>
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-sm text-slate-600">Uploading...</p>
          </>
        ) : (
          <>
            <div className="p-3 rounded-full bg-slate-100">
              <Upload className="w-6 h-6 text-slate-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-700">
                Drop an image here or{" "}
                <label className="text-indigo-600 hover:text-indigo-500 cursor-pointer">
                  browse
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                </label>
              </p>
              <p className="mt-1 text-xs text-slate-500">
                PNG, JPG, GIF up to 4MB
              </p>
            </div>
            <button
              type="button"
              onClick={handleUrlInput}
              className="text-xs text-slate-500 hover:text-slate-700 underline"
            >
              Or enter a URL
            </button>
          </>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  );
}

