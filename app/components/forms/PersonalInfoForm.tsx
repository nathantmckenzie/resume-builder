"use client";

import { useResumeStore } from "@/app/store/store";
import PhotoUpload from "./PhotoUpload";

export default function PersonalInfoForm({
  setCurrentView,
}: {
  setCurrentView: (v: string) => void;
}) {
  const { resume, update } = useResumeStore();

  return (
    <>
      <div className="space-y-4 bg-white rounded-2xl p-7">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-2xl font-semibold mb-5">Edit Personal Information</h2>
        </div>
        <div className="flex flex-row">
          <div className="w-[70%] mr-10">
            <div className="font-bold">Full name</div>
            <input
              placeholder="Enter your first and last name"
              className="w-full p-3 rounded-md mb-3 mt-3 bg-gray-100 outline-none"
              value={resume.personal.fullName}
              onChange={(e) =>
                update({ personal: { ...resume.personal, fullName: e.target.value } })
              }
            />

            <div className="font-bold">Professional title</div>
            <input
              placeholder="Target position or current role"
              className="w-full p-3 rounded-md mb-3 bg-gray-100 mt-3 outline-none"
              value={resume.personal.title}
              onChange={(e) =>
                update({ personal: { ...resume.personal, title: e.target.value } })
              }
            />
          </div>
          <div className="flex justify-center items-center flex-col">
            <div className="font-bold">Photo</div>
            <PhotoUpload />
          </div>
        </div>

        <div className="font-bold">Email</div>
        <input
          placeholder="Enter Email"
          className="w-full p-3 rounded-md mb-3 bg-gray-100 outline-none"
          value={resume.personal.email}
          onChange={(e) => {
            if (e.target.value.length > 60) return;
            update({ personal: { ...resume.personal, email: e.target.value } });
          }}
        />

        <div className="font-bold">Phone</div>
        <input
          placeholder="Enter Phone"
          className="w-full p-3 rounded-md mb-3 bg-gray-100 outline-none"
          value={resume.personal.phone}
          onChange={(e) => {
            if (e.target.value.length > 60) return;
            update({ personal: { ...resume.personal, phone: e.target.value } });
          }}
        />

        <div className="font-bold">Location</div>
        <input
          placeholder="City, Country"
          className="w-full p-3 rounded-md mb-3 bg-gray-100 outline-none"
          value={resume.personal.location}
          onChange={(e) => {
            if (e.target.value.length > 60) return;
            update({ personal: { ...resume.personal, location: e.target.value } });
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
