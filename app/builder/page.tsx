"use client";

import React, { useState, useEffect, useRef } from "react";

import ResumePreview from "@/app/components/resume/ResumePreview";
import PersonalInfoForm from "@/app/components/forms/PersonalInfoForm";
import PersonalInfoFormPreview from "@/app/components/forms/PersonalInfoFormPreview";
import FormPreview from "@/app/components/forms/FormPreview";
import EducationForm from "@/app/components/forms/EducationForm";
import LanguagesForm from "@/app/components/forms/LanguagesForm";
import ExperienceForm from "@/app/components/forms/ExperienceForm";
import AddCategoryModal from "@/app/components/forms/AddCategoryModal";
import { downloadPDF } from "@/app/components/resume/helper-functions";

type Section = "personal" | "education" | "languages" | "experience" | string;
type View = "preview" | Section;

export default function BuilderPage() {
  const [currentView, setCurrentView] = useState<View>("preview");
  const [currentEntry, setCurrentEntry] = useState(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const hiddenPagesRef = useRef<HTMLDivElement | null>(null);
  const FULL_WIDTH = 850;
  const FULL_HEIGHT = 1100;

  const DEFAULT_CATEGORIES = ["personal", "experience", "education", "languages"];
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const addCategory = (name: string) => {
  //   const cleaned = name.trim().toLowerCase();
  //   if (!cleaned) return;

  //   if (!categories.includes(cleaned)) {
  //     setCategories((prev) => [...prev, cleaned]);
  //   }

  //   setIsModalOpen(false);
  // };

  // Previews auto-render based on categories
  const previews = categories.map((category) => {
    if (category === "personal") {
      return {
        id: "personal",
        component: <PersonalInfoFormPreview setCurrentView={setCurrentView} />,
      };
    }

    // All other categories use FormPreview
    return {
      id: category,
      component: (
        <FormPreview
          type={category}
          setCurrentView={setCurrentView}
          setCurrentEntry={setCurrentEntry}
          setCurrentIndex={setCurrentIndex}
        />
      ),
    };
  });

  // Forms (dynamic fallback)
  const forms: Record<string, React.JSX.Element> = {
    personal: <PersonalInfoForm setCurrentView={setCurrentView} />,
    education: (
      <EducationForm currentIndex={currentIndex} setCurrentView={setCurrentView} />
    ),
    languages: (
      <LanguagesForm currentIndex={currentIndex} setCurrentView={setCurrentView} />
    ),
    experience: (
      <ExperienceForm currentIndex={currentIndex} setCurrentView={setCurrentView} />
    ),
  };

  return (
    <>
      <div className="fixed top-0 bg-white h-[70px] w-full flex justify-end items-center shadow">
        <button
          onClick={() => downloadPDF(hiddenPagesRef, FULL_WIDTH, FULL_HEIGHT)}
          className="bg-[#2563eb] text-[#ffffff] px-4 py-2 rounded shadow mr-5 cursor-pointer"
        >
          Download PDF
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen pt-[70px]">
        <div className="p-6 overflow-y-scroll hide-scrollbar">
          {currentView === "preview"
            ? previews.map((preview) => <div key={preview.id}>{preview.component}</div>)
            : forms[currentView] ?? (
                <div className="p-4">
                  <h2 className="font-bold text-xl capitalize">
                    {currentView} (No form yet)
                  </h2>
                  <p className="text-gray-600">This category has no form component.</p>
                </div>
              )}
          {/* {currentView === "preview" && (
            <button
              className="px-4 py-2 mt-7 bg-blue-600 text-white rounded-lg cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              Add Category
            </button>
          )} */}
        </div>

        <div className="p-6 overflow-y-scroll hide-scrollbar hidden md:block">
          <ResumePreview hiddenPagesRef={hiddenPagesRef} />
        </div>
        {/* 
        {currentView === "preview" && (
          <AddCategoryModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            categories={[
              { type: "Projects", description: "Show your completed projects" },
              { type: "Skills", description: "Highlight your technical skills" },
              { type: "Certifications", description: "List your certifications" },
              { type: "Hobbies", description: "Optional personal hobbies" },
            ]}
          />
        )} */}
      </div>
    </>
  );
}
