"use client";

import { useResumeStore } from "@/app/store/store";
import { useState } from "react";
import DateEntryModal from "@/app/components/forms/DateEntryModal";

export default function ExperienceForm({
  setCurrentView,
  currentIndex,
}: {
  setCurrentView: (v: string) => void;
  currentIndex: number | null;
}) {
  const { resume, update } = useResumeStore();
  const [showStartDateModal, setShowStartDateModal] = useState(false);
  const [showEndDateModal, setShowEndDateModal] = useState(false);

  const experienceEntry = currentIndex !== null ? resume.experience[currentIndex] : null;
  if (!experienceEntry) return <div>No experience selected</div>;

  const updateEntry = (updated: Partial<typeof experienceEntry>) => {
    const updatedArray = resume.experience.map((exp, index) =>
      index === currentIndex ? { ...exp, ...updated } : exp
    );
    update({ experience: updatedArray });
  };

  const deleteEntry = () => {
    const updatedExperience = resume.experience.filter((_, i) => i !== currentIndex);

    update({
      experience: updatedExperience,
    });
    setCurrentView("preview");
  };

  return (
    <>
      <div className="space-y-4 bg-white shadow-md p-5 rounded-2xl">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-2xl font-semibold">Experience</h2>
          <button className="cursor-pointer font-bold" onClick={() => deleteEntry()}>
            Delete
          </button>
        </div>

        <div className="font-semibold">Job Title</div>
        <input
          placeholder="Enter Job Title"
          className="w-full p-3 rounded-md mb-3 bg-gray-100 outline-none"
          value={experienceEntry.role}
          onChange={(e) => updateEntry({ role: e.target.value })}
        />

        <div className="font-semibold">Employer</div>
        <input
          placeholder="Enter Employer"
          className="w-full p-3 rounded-md mb-3 bg-gray-100 outline-none"
          value={experienceEntry.company}
          onChange={(e) => updateEntry({ company: e.target.value })}
        />

        <div className="flex flex-row gap-4">
          <div>
            <div className="font-bold mb-2">Start Date</div>
            <input
              placeholder="MM/YYYY"
              readOnly
              className="w-full p-3 rounded-md mb-3 bg-gray-100 relative outline-none"
              value={experienceEntry.startDate || "MM/YYYY"}
              onClick={() => setShowStartDateModal(true)}
            />
            {showStartDateModal && (
              <DateEntryModal
                setShowStartDateModal={setShowStartDateModal}
                entry={experienceEntry}
                onSelect={({ year, month }) =>
                  updateEntry({ startDate: `${month}/${year}` })
                }
              />
            )}
          </div>

          <div>
            <div className="font-bold mb-2">End Date</div>
            <input
              placeholder="MM/YYYY"
              readOnly
              className="w-full p-3 rounded-md mb-3 bg-gray-100 outline-none"
              value={experienceEntry.endDate || "MM/YYYY"}
              onClick={() => setShowEndDateModal(true)}
            />
            {showEndDateModal && (
              <DateEntryModal
                setShowEndDateModal={setShowEndDateModal}
                onSelect={({ year, month }) =>
                  updateEntry({ endDate: `${month}/${year}` })
                }
              />
            )}
          </div>

          <div>
            <div className="font-bold mb-2">Location</div>
            <input
              placeholder="Location"
              className="w-full p-3 rounded-md mb-3 bg-gray-100 outline-none"
              value={experienceEntry.location || ""}
              onChange={(e) => updateEntry({ location: e.target.value })}
            />
          </div>
        </div>

        <div className="font-bold">Description</div>
        <textarea
          placeholder="Describe your role & achievements"
          className="w-full p-3 resize-none rounded-md mb-3 bg-gray-100 outline-none"
          value={experienceEntry.description || ""}
          onChange={(e) => {
            // if (e.target.value.length > 1000) return;
            updateEntry({ description: e.target.value });
          }}
        />
      </div>
      <div className="sticky bottom-0 bg-white rounded-2xl h-[100px] flex justify-center items-center border border-gray-300">
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
