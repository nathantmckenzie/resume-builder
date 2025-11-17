"use client";

import { useResumeStore } from "@/app/store/store";

export default function PersonalInfoForm() {
  const { resume, update } = useResumeStore();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Personal Information</h2>

      <input
        className="w-full border p-2 rounded"
        placeholder="Full Name"
        value={resume.personal.fullName}
        onChange={(e) =>
          update({ personal: { ...resume.personal, fullName: e.target.value } })
        }
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Title"
        value={resume.personal.title}
        onChange={(e) =>
          update({ personal: { ...resume.personal, title: e.target.value } })
        }
      />

      {/* Add other fields */}
    </div>
  );
}
