import { categories } from "@/app/constants/categories";

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  location: string;
}

export interface Education {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

export interface Skill {
  name: string;
  level?: string;
}

export interface Language {
  language: string;
  level?: string;
}

export type Category = (typeof categories)[number];

export interface ResumeData {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  selectedCategories: Category[];
  languages: Language[];
}
