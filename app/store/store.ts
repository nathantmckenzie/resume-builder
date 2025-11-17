import { create } from "zustand";
import { ResumeData } from "@/app/types/resume";

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
    },
    experience: [],
    education: [],
    skills: [],
  },
  update: (data) => set((state) => ({ resume: { ...state.resume, ...data } })),
}));
