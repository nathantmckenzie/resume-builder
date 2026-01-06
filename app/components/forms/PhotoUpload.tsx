"use client";

import { useRef } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import { useResumeStore } from "@/app/store/store";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

export default function PhotoUploadCircle() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { resume, update } = useResumeStore();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64 = await fileToBase64(file);

    update({
      personal: {
        ...resume.personal,
        photo: {
          file,
          previewUrl: URL.createObjectURL(file),
          // previewUrl: URL.createObjectURL(file),
        },
      },
    });
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        onClick={handleClick}
        className="w-[200px] h-[200px] rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-200 transition relative"
      >
        {resume.personal.photo.previewUrl ? (
          <Image
            src={resume.personal.photo.previewUrl}
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
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
        onChange={handleFileChange}
      />
    </div>
  );
}
