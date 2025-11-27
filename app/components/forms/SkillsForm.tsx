"use client";

import { useState } from "react";
import { useResumeStore } from "@/app/store/store";

export default function SkillsForm({
  setCurrentView,
  currentIndex,
}: {
  setCurrentView: (v: string) => void;
  currentIndex: number | null;
}) {
  const { resume, update } = useResumeStore();

  // Initialize local state from currentEntry or store
  const initial = currentEntry || resume.languages?.[0] || { language: "", level: "" };
  const [language, setLanguage] = useState({ ...initial });

  const updateStore = (patch: Partial<typeof language>) => {
    const updated = { ...language, ...patch };
    setLanguage(updated);

    const updatedLanguages = [...resume.languages];
    updatedLanguages[currentIndex] = {
      ...updatedLanguages[currentIndex],
      ...updated,
    };

    update({
      languages: updatedLanguages,
    });
  };

  const deleteEntry = () => {
    const updatedLanguages = resume.languages.filter((_, i) => i !== currentIndex);

    update({
      languages: updatedLanguages,
    });
    setCurrentView("preview");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-semibold">Skills</h2>
        <button className="cursor-pointer" onClick={() => deleteEntry()}>
          Delete
        </button>
      </div>

      {/* Language Name */}
      <div>
        <label className="font-bold mb-1 block">Skills</label>
        <input
          placeholder="Enter skill"
          className="w-full border p-2 rounded mb-3 capitalize"
          value={language.language}
          onChange={(e) => updateStore({ language: e.target.value })}
        />
      </div>
      <button
        className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded shadow"
        onClick={() => setCurrentView("preview")}
      >
        Done
      </button>
    </div>
  );
}
