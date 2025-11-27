"use client";

import { useResumeStore } from "@/app/store/store";
import DateEntryModal from "@/app/components/forms/DateEntryModal";

import { useState } from "react";

export default function EducationForm({
  setCurrentView,
  currentIndex,
}: {
  setCurrentView: (v: string) => void;
  currentIndex: number | null;
}) {
  const { resume, update } = useResumeStore();
  const [showStartDateModal, setShowStartDateModal] = useState<boolean>(false);
  const [showEndDateModal, setShowEndDateModal] = useState<boolean>(false);

  const educationEntry = currentIndex !== null ? resume.education[currentIndex] : null;
  if (!educationEntry) return <div>No experience selected</div>;

  // Update store whenever local state changes
  const updateEntry = (patch: Partial<typeof educationEntry>) => {
    const updatedEducation = resume.education.map((exp, index) =>
      index === currentIndex ? { ...exp, ...patch } : exp
    );
    update({
      education: updatedEducation,
    });
  };

  const deleteEntry = () => {
    const updatedEducation = resume.education.filter((_, i) => i !== currentIndex);

    update({
      education: updatedEducation,
    });
    setCurrentView("preview");
  };

  return (
    <>
      <div className="rounded-2xl bg-white shadow-md p-5">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-2xl font-semibold mb-5">Education</h2>
          <button className="cursor-pointer font-bold" onClick={() => deleteEntry()}>
            Delete
          </button>
        </div>
        <div className="">
          <div>
            <div className="font-bold mb-2">Degree</div>
            <input
              placeholder="Enter Degree"
              className="w-full p-3 rounded-md mb-3 bg-gray-100 outline-none"
              value={educationEntry.degree}
              onChange={(e) => updateEntry({ degree: e.target.value })}
            />
            <div className="font-bold mb-2">School</div>
            <input
              placeholder="School"
              className="w-full p-3 rounded-md mb-3 bg-gray-100 outline-none"
              value={educationEntry.school}
              onChange={(e) => updateEntry({ school: e.target.value })}
            />
            <div className="flex flex-row mb-3 justify-between">
              <div>
                <div className="font-bold mb-2">Start Date</div>
                <input
                  placeholder="MM/YYYY"
                  readOnly
                  className="w-full p-3 rounded-md mb-3 bg-gray-100 outline-none"
                  value={educationEntry.startDate || "MM/YYYY"}
                  onClick={() => setShowStartDateModal(true)}
                />
              </div>
              {showStartDateModal && (
                <DateEntryModal
                  setShowStartDateModal={setShowStartDateModal}
                  onSelect={({ year, month }) =>
                    updateEntry({ startDate: `${month}/${year}` })
                  }
                />
              )}
              <div>
                <div className="font-bold mb-2">End Date</div>
                <input
                  placeholder="MM/YYYY"
                  readOnly
                  className="w-full p-3 rounded-md mb-3 bg-gray-100 outline-none"
                  value={educationEntry.endDate || "MM/YYYY"}
                  onClick={() => setShowEndDateModal(true)}
                />
              </div>
              {showEndDateModal && (
                <DateEntryModal
                  setShowEndDateModal={setShowEndDateModal}
                  onSelect={({ year, month }) =>
                    updateEntry({ endDate: `${month}/${year}` })
                  }
                />
              )}
              <div>
                <div className="font-bold mb-2">Location</div>
                <input
                  placeholder="Location"
                  className="w-full p-3 rounded-md mb-3 bg-gray-100 outline-none"
                  value={educationEntry.location}
                  onChange={(e) => updateEntry({ location: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="font-bold mb-2">Description</div>
        <textarea
          placeholder="Add a description"
          className="w-full p-3 resize-none rounded-md mb-3 bg-gray-100 outline-none"
          value={educationEntry.description}
          onChange={(e) => {
            if (e.target.value.length > 1000) return;
            updateEntry({ description: e.target.value });
          }}
        />
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
