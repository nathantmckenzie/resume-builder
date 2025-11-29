"use client";

import Image from "next/image";
import { useResumeStore } from "@/app/store/store";
import { Camera } from "lucide-react";

export default function PersonalInfoFormPreview({ setCurrentView }) {
  const { resume } = useResumeStore();

  return (
    <div
      onClick={() => setCurrentView("personal")}
      className="h-[200px] flex flex-row rounded-2xl justify-between items-center bg-white p-7 cursor-pointer shadow-md"
    >
      <div className="flex flex-col justify-center">
        <div className="text-gray-400 text-lg font-bold pb-2">
          {resume.personal.fullName.length ? resume.personal.fullName : "Your name"}
        </div>
        <div className="text-gray-400 text-sm font-semibold pb-1">
          {resume.personal.email.length ? resume.personal.email : "Email"}
        </div>
        <div className="text-gray-400 text-sm font-semibold pb-1">
          {resume.personal.phone.length ? resume.personal.phone : "Phone"}
        </div>
        <div className="text-gray-400 text-sm font-semibold pb-1">
          {resume.personal.title.length ? resume.personal.title : "Title"}
        </div>
      </div>
      {resume.personal.photo.previewUrl ? (
        <div className="w-[130px] h-[130px] rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-200 transition relative">
          <Image
            alt="Uploaded photo"
            src={resume.personal.photo.previewUrl}
            className="object-cover"
            width={130}
            height={130}
          />
        </div>
      ) : (
        <Camera className="w-12 h-12 text-gray-400" />
      )}
    </div>
  );
}
