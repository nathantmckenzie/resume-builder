"use client";

import { useResumeStore } from "@/app/store/store";

export default function ResumePreview() {
  const { resume } = useResumeStore();

  return (
    <div className="bg-white shadow p-8 rounded max-w-[800px] mx-auto">
      <h1 className="text-3xl font-bold">{resume.personal.fullName}</h1>
      <p className="text-gray-600">{resume.personal.title}</p>

      <hr className="my-4" />

      <h2 className="text-xl font-semibold">Summary</h2>
      <p>{resume.personal.summary}</p>

      {/* Render Experience, Education, Skills */}
    </div>
  );
}
