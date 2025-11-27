"use client";

import { useState } from "react";
import { useResumeStore } from "@/app/store/store";
import LanguageProficiencyDropdown from "@/app/components/forms/LanguageProficiencyDropdown";

export default function LanguagesForm({
  setCurrentView,
  currentIndex,
}: {
  setCurrentView: (v: string) => void;
  currentIndex: number | null;
}) {
  const { resume, update } = useResumeStore();

  const initial =
    currentIndex !== null && resume.languages[currentIndex]
      ? resume.languages[currentIndex]
      : resume.languages?.[0] ?? { language: "", level: "" };
  const [language, setLanguage] = useState({ ...initial });

  const updateStore = (patch: Partial<typeof language>) => {
    const updated = { ...language, ...patch };
    setLanguage(updated);

    const updatedLanguages = [...resume.languages];

    if (currentIndex !== null && updatedLanguages[currentIndex]) {
      updatedLanguages[currentIndex] = {
        ...updatedLanguages[currentIndex],
        ...updated,
      };
    } else if (updatedLanguages.length > 0) {
      updatedLanguages[0] = {
        ...updatedLanguages[0],
        ...updated,
      };
    } else {
      updatedLanguages.push(updated as typeof language);
    }

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
    <>
      <div className="space-y-4 rounded-2xl bg-white shadow-md p-5">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-semibold">Languages</h2>
          <button className="cursor-pointer font-bold" onClick={() => deleteEntry()}>
            Delete
          </button>
        </div>

        <div>
          <label className="font-bold mb-1 block">Language</label>
          <input
            placeholder="Enter language (e.g., Spanish)"
            className="w-full p-3 rounded-md mb-3 capitalize outline-none bg-gray-100"
            value={language.language}
            onChange={(e) => updateStore({ language: e.target.value })}
          />
        </div>

        <div>
          <label className="font-bold mb-1 block">Proficiency</label>
          <LanguageProficiencyDropdown
            value={language.level ?? null}
            onChange={(level) => updateStore({ level })}
            currentIndex={currentIndex}
          />
        </div>
      </div>

      <div className="sticky bottom-0 bg-white rounded-2xl mt-5 h-[100px] flex justify-center items-center border border-gray-300">
        <button
          className="cursor-pointer bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl w-[280px] h-[60px] text-white font-bold"
          onClick={() => setCurrentView("preview")}
        >
          Done
        </button>
      </div>
    </>
  );
}
