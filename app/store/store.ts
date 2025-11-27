import { create } from "zustand";
import { ResumeData } from "@/app/types/resume";

export interface ResumePhoto {
  file: File | null;
  previewUrl: string | null;
}

export const useResumeStore = create<{
  resume: ResumeData;
  update: (data: Partial<ResumeData>) => void;
  photo: ResumePhoto;
  setPhoto: (photo: ResumePhoto) => void;
}>((set) => ({
  resume: {
    personal: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    },
    experience: [
      {
        company: "Google",
        role: "Software dev",
        startDate: "03/1991",
        endDate: "04/1998",
        description: "",
        location: "",
      },
    ],
    education: [
      {
        startDate: "",
        endDate: "",
        school: "",
        degree: "",
        location: "",
        description: "",
      },
    ],
    skills: [],
    summary: "",
    selectedCategories: ["education", "experience", "skills", "languages"],
    languages: [
      { language: "french", level: "fluent" },
      { language: "spanish", level: "proficient" },
    ],
    settings: {
      fontSize: 16,
    },
  },

  update: (data) => set((state) => ({ resume: { ...state.resume, ...data } })),

  photo: {
    file: null,
    previewUrl: null,
  },

  setPhoto: (photo) => set({ photo }),
}));
