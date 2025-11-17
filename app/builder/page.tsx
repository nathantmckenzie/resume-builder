import ResumePreview from "@/app/components/resume/ResumePreview";
import PersonalInfoForm from "@/app/components/form/PersonalInfoForm";

export default function BuilderPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="p-6 overflow-y-scroll border-r">
        <h1 className="text-2xl font-bold mb-4">Resume Builder</h1>
        <PersonalInfoForm />
        {/* Add other form sections here */}
      </div>

      <div className="p-6 bg-gray-50 overflow-y-scroll">
        <ResumePreview />
      </div>
    </div>
  );
}
