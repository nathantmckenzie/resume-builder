"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Entry = {
  startDate?: string | null;
  endDate?: string | null;
};

type DateEntryModalProps = {
  setShowStartDateModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEndDateModal?: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect: (value: { year: number; month: string }) => void;
  entry?: Entry;
};

export default function DateEntryModal({
  setShowStartDateModal,
  setShowEndDateModal,
  onSelect,
  entry,
}: DateEntryModalProps) {
  const startYear = entry?.startDate ? Number(entry.startDate.split("/")[1]) : null;

  let years = Array.from({ length: 60 }, (_, i) => 2025 - i);
  if (setShowEndDateModal && startYear) years = years.filter((y) => y >= startYear);

  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const handleSelect = (year: number, month: string) => {
    if (setShowStartDateModal) {
      setShowStartDateModal(false);
      onSelect({ year, month });
    } else if (setShowEndDateModal) {
      setShowEndDateModal(false);
      onSelect({ year, month });
    }
  };

  const closeModal = () => {
    if (setShowStartDateModal) setShowStartDateModal(false);
    if (setShowEndDateModal) setShowEndDateModal(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md grid grid-cols-2 gap-4 z-10"
      >
        {/* Years */}
        <div className="max-h-80 overflow-y-auto border-r pr-4">
          <h2 className="font-semibold mb-2 text-lg">Year</h2>
          <div className="flex flex-col gap-2">
            {years.map((year) => (
              <button
                key={year}
                className={`cursor-pointer p-2 rounded-xl text-left transition border ${
                  selectedYear === year
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Months */}
        <div className="max-h-80 overflow-y-auto pl-4">
          <h2 className="font-semibold mb-2 text-lg">Month</h2>
          <div className="flex flex-col gap-2">
            {months.map((month) => (
              <button
                key={month}
                className={`p-2 rounded-xl cursor-pointer text-left transition border ${
                  selectedMonth === month
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedMonth(month)}
              >
                {month}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button
            className="cursor-pointer px-4 py-2 rounded-xl border border-gray-400 hover:bg-gray-100"
            onClick={closeModal}
          >
            Cancel
          </button>

          <button
            disabled={!selectedYear || !selectedMonth}
            className="cursor-pointer px-4 py-2 rounded-xl bg-blue-600 text-white disabled:bg-gray-300 disabled:text-gray-600"
            onClick={() =>
              selectedYear && selectedMonth && handleSelect(selectedYear, selectedMonth)
            }
          >
            Select
          </button>
        </div>
      </motion.div>
    </div>
  );
}
