"use client";

import { useRef } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { useResumeStore } from "@/app/store/store";

export default function PhotoUploadCircle() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { photo, setPhoto } = useResumeStore();

  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhoto({
      file,
      previewUrl: URL.createObjectURL(file),
    });
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        onClick={handleClick}
        className="w-[200px] h-[200px] rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-200 transition relative"
      >
        {photo.previewUrl ? (
          <Image
            src={photo.previewUrl}
            alt="Uploaded photo"
            fill
            className="object-cover"
          />
        ) : (
          <Camera className="w-12 h-12 text-gray-500" />
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
