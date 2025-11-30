import { create } from "zustand";
import { ResumeData } from "@/app/types/resume";

export interface ResumePhoto {
  file: File | null;
  previewUrl: string | null;
}

export const useResumeStore = create<{
  resume: ResumeData;
  update: (data: Partial<ResumeData>) => void;
}>((set) => ({
  resume: {
    personal: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      photo: {
        file: null,
        previewUrl: null,
      },
    },
    experience: [
      // {
      //   company: "",
      //   role: "",
      //   startDate: "",
      //   endDate: "",
      //   description: "",
      //   location: "",
      // },
    ],
    education: [
      // {
      //   startDate: "",
      //   endDate: "",
      //   school: "",
      //   degree: "",
      //   location: "",
      //   description: "",
      // },
    ],
    skills: [],
    summary: "",
    selectedCategories: ["education", "experience", "skills", "languages"],
    languages: [
      // { language: "", level: "" }
    ],
    settings: {
      fontSize: 16,
      backgroundColor: "white",
    },
  },

  update: (data) => set((state) => ({ resume: { ...state.resume, ...data } })),
}));
