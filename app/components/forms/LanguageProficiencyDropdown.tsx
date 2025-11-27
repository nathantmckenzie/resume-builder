"use client";

import { useState } from "react";
import { useResumeStore } from "@/app/store/store";

const OPTIONS = ["Basic", "Conversational", "Proficient", "Fluent", "Native/Bilingual"];

export default function LanguageProficiencyDropdown({
  value,
  onChange,
  currentIndex,
}: {
  value: string | null;
  onChange: (val: string) => void;
  currentIndex: number | null;
}) {
  const { resume, update } = useResumeStore();
  const [open, setOpen] = useState(false);

  const handleSelect = (option: string) => {
    const updatedLanguages = [...resume.languages];

    if (currentIndex !== null && updatedLanguages[currentIndex]) {
      updatedLanguages[currentIndex] = {
        ...updatedLanguages[currentIndex],
        level: option,
      };
    } else if (updatedLanguages.length > 0) {
      updatedLanguages[0] = {
        ...updatedLanguages[0],
        level: option,
      };
    } else {
      updatedLanguages.push({ language: "", level: option });
    }

    update({ languages: updatedLanguages });
    onChange(option);
    setOpen(false);
  };

  return (
    <div className="relative w-full max-w-sm">
      <button
        onClick={() => setOpen(!open)}
        className="cursor-pointer w-full rounded-xl border-2p-3 text-left text-lg bg-gray-100 p-3 shadow-sm hover:border-gray-400 transition capitalize"
      >
        {value || "Select proficiency level"}
      </button>

      {open && (
        <div className="absolute mt-2 w-full rounded-xl bg-white shadow-lg border border-gray-200 z-10">
          {OPTIONS.map((opt) => (
            <div
              key={opt}
              onClick={() => handleSelect(opt)}
              className="p-3 text-lg hover:bg-gray-100 cursor-pointer transition"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
